import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { PersistedParsedChatRecord } from './chatPersistence';
import {
  applyAgentExecutionMessagePatch,
  type IMessageItem,
  MessageType,
} from './data';
import {
  appendRuntimeEvent,
  getRuntimeEventsByConversation,
  type RuntimeEventMap,
} from './runtimeObservability';
import {
  CHAT_PROVIDER_MODE,
  fetchRemoteAgentRuntimeStreamBatch,
} from './service';

interface UseRuntimeExecutionSyncOptions {
  activeKey: string;
  parsedMessages: PersistedParsedChatRecord[];
  structuredMessages: IMessageItem[];
  upsertStructuredMessage: (message: IMessageItem) => void;
  updateStructuredMessage: (
    messageId: string,
    updater: (message: IMessageItem) => IMessageItem,
  ) => void;
}

export const useRuntimeExecutionSync = ({
  activeKey,
  parsedMessages,
  structuredMessages,
  upsertStructuredMessage,
  updateStructuredMessage,
}: UseRuntimeExecutionSyncOptions) => {
  const [runtimeEventMap, setRuntimeEventMap] = useState<RuntimeEventMap>({});
  const syncedRemoteExecutionIdsRef = useRef<Record<string, true>>({});
  const runtimeStreamStopsRef = useRef<Record<string, () => void>>({});

  const runtimeEvents = useMemo(
    () => getRuntimeEventsByConversation(runtimeEventMap, activeKey),
    [activeKey, runtimeEventMap],
  );

  const recordRuntimeEvent = useCallback(
    (
      event: Parameters<typeof appendRuntimeEvent>[2],
      conversationKey = activeKey,
    ) => {
      setRuntimeEventMap((previous) =>
        appendRuntimeEvent(previous, conversationKey, event),
      );
    },
    [activeKey],
  );

  useEffect(() => {
    if (CHAT_PROVIDER_MODE !== 'remote') {
      return;
    }

    parsedMessages.forEach((record) => {
      if (record.status === 'loading' || record.status === 'updating') {
        return;
      }

      const structuredMessage =
        record.message.role === 'assistant'
          ? record.message.structuredMessage
          : undefined;

      if (structuredMessage?.type !== MessageType.AGENT_EXECUTION) {
        return;
      }

      const syncKey = `${activeKey}:${structuredMessage.id}`;
      if (syncedRemoteExecutionIdsRef.current[syncKey]) {
        return;
      }

      syncedRemoteExecutionIdsRef.current[syncKey] = true;
      upsertStructuredMessage(structuredMessage);
      recordRuntimeEvent({
        type: 'stream.message',
        level: 'success',
        summary: '已同步远端 execution 消息到本地更新链路',
        messageId: structuredMessage.id,
      });
    });
  }, [activeKey, parsedMessages, recordRuntimeEvent, upsertStructuredMessage]);

  const startRuntimeStream = useCallback(
    (messageId: string) => {
      const streamKey = `${activeKey}:${messageId}`;
      if (runtimeStreamStopsRef.current[streamKey]) {
        return;
      }

      let stopped = false;
      const stop = () => {
        stopped = true;
        delete runtimeStreamStopsRef.current[streamKey];
      };

      runtimeStreamStopsRef.current[streamKey] = stop;

      void (async () => {
        let cursor: string | undefined;

        try {
          while (!stopped) {
            const batch = await fetchRemoteAgentRuntimeStreamBatch(
              messageId,
              cursor,
            );

            if (stopped) {
              return;
            }

            if (batch.patches.length > 0) {
              recordRuntimeEvent({
                type: 'stream.batch',
                level: batch.done ? 'success' : 'info',
                summary: `收到 runtime patch 批次（${batch.patches.length}）`,
                messageId,
                details: {
                  nextCursor: batch.nextCursor,
                  done: batch.done,
                },
              });
              updateStructuredMessage(messageId, (message) =>
                batch.patches.reduce(
                  (current, patch) =>
                    applyAgentExecutionMessagePatch(current, patch),
                  message,
                ),
              );
              recordRuntimeEvent({
                type: 'patch.apply',
                level: 'success',
                summary: `已应用 ${batch.patches.length} 条 runtime patch`,
                messageId,
              });
            }

            if (batch.done || !batch.nextCursor) {
              return;
            }

            cursor = batch.nextCursor;

            if (batch.pollIntervalMs && batch.pollIntervalMs > 0) {
              await new Promise<void>((resolve) => {
                window.setTimeout(resolve, batch.pollIntervalMs);
              });
            }
          }
        } finally {
          if (runtimeStreamStopsRef.current[streamKey] === stop) {
            delete runtimeStreamStopsRef.current[streamKey];
          }
        }
      })();
    },
    [activeKey, recordRuntimeEvent, updateStructuredMessage],
  );

  useEffect(() => {
    if (CHAT_PROVIDER_MODE !== 'remote') {
      return;
    }

    const runningExecutionIds = new Set(
      structuredMessages
        .filter(
          (message) =>
            message.type === MessageType.AGENT_EXECUTION &&
            (
              message.content as {
                status?: 'running' | 'success' | 'error';
              }
            ).status === 'running',
        )
        .map((message) => message.id),
    );

    runningExecutionIds.forEach((messageId) => {
      const streamKey = `${activeKey}:${messageId}`;
      if (!runtimeStreamStopsRef.current[streamKey]) {
        startRuntimeStream(messageId);
      }
    });

    Object.entries(runtimeStreamStopsRef.current).forEach(
      ([streamKey, stop]) => {
        const isActiveConversationStream = streamKey.startsWith(
          `${activeKey}:`,
        );
        const messageId = streamKey.slice(activeKey.length + 1);

        if (
          !isActiveConversationStream ||
          !runningExecutionIds.has(messageId)
        ) {
          stop();
        }
      },
    );
  }, [activeKey, startRuntimeStream, structuredMessages]);

  useEffect(
    () => () => {
      Object.values(runtimeStreamStopsRef.current).forEach((stop) => {
        stop();
      });
    },
    [],
  );

  return {
    runtimeEvents,
    recordRuntimeEvent,
  };
};
