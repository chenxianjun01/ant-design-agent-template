import { useCallback } from 'react';

import {
  buildRequestParams,
  executeFormSubmitAction,
} from './components/schema/formSubmitAction';
import {
  applySentMessageToConversation,
  refreshConversationItem,
} from './conversationHelpers';
import {
  applyAgentExecutionMessagePatch,
  type ConversationItem,
  type IAgentExecutionControl,
  type IMessageItem,
  MessageType,
} from './data';
import type { RuntimeEventRecord } from './runtimeObservability';
import {
  CHAT_PROVIDER_MODE,
  type ChatRequestParams,
  executeRemoteAgentExecutionControl,
  type MockChartType,
  type MockMessageType,
  type SubmitActionAdapter,
} from './service';

interface SendMessageOptions {
  mockType?: MockMessageType;
  mockChartType?: MockChartType;
}

interface UseChatActionsOptions {
  activeKey: string;
  clearStructuredMessages: () => void;
  insertStructuredMessage: (
    message: Omit<IMessageItem, 'id'> & { id?: string },
    values?: Record<string, unknown>,
  ) => void;
  mockChartType: MockChartType;
  mockType: MockMessageType;
  onRequest: (params: ChatRequestParams) => void;
  recordRuntimeEvent: (
    event: Omit<RuntimeEventRecord, 'id' | 'conversationKey' | 'timestamp'> & {
      id?: string;
      timestamp?: string;
    },
    conversationKey?: string,
  ) => void;
  setConversations: React.Dispatch<React.SetStateAction<ConversationItem[]>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  submitActionAdapter: SubmitActionAdapter;
  updateStructuredMessage: (
    messageId: string,
    updater: (message: IMessageItem) => IMessageItem,
  ) => void;
}

export const useChatActions = ({
  activeKey,
  clearStructuredMessages,
  insertStructuredMessage,
  mockChartType,
  mockType,
  onRequest,
  recordRuntimeEvent,
  setConversations,
  setInputValue,
  submitActionAdapter,
  updateStructuredMessage,
}: UseChatActionsOptions) => {
  const handleFormSubmit = useCallback(
    (submittedMessage: IMessageItem, values: Record<string, unknown>) =>
      executeFormSubmitAction({
        isRemoteMode: CHAT_PROVIDER_MODE === 'remote',
        submittedMessage,
        values,
        insertStructuredMessage,
        clearStructuredMessages,
        refreshConversation: () => {
          const refreshedAt = new Date().toISOString();
          setConversations((previous) =>
            refreshConversationItem(previous, activeKey, refreshedAt),
          );
        },
        onRequest,
        submitActionAdapter,
      }),
    [
      activeKey,
      clearStructuredMessages,
      insertStructuredMessage,
      onRequest,
      setConversations,
      submitActionAdapter,
    ],
  );

  const handleAgentExecutionControl = useCallback(
    async (message: IMessageItem, control: IAgentExecutionControl) => {
      if (message.type !== MessageType.AGENT_EXECUTION) {
        return;
      }

      updateStructuredMessage(message.id, (currentMessage) =>
        applyAgentExecutionMessagePatch(currentMessage, {
          pendingControlKey: control.key,
          clearControlError: true,
          summary: `正在提交${control.label}请求...`,
          updatedAt: new Date().toISOString(),
        }),
      );
      recordRuntimeEvent({
        type: 'control.request',
        level: 'info',
        summary: `已发起执行控制：${control.label}`,
        messageId: message.id,
        details: {
          action: control.action,
          controlKey: control.key,
        },
      });

      const result = await executeRemoteAgentExecutionControl(
        message.id,
        control,
      );

      updateStructuredMessage(message.id, (currentMessage) =>
        applyAgentExecutionMessagePatch(currentMessage, {
          ...(result.patch ?? {}),
          clearPendingControl: true,
          controlErrorMessage: result.success ? undefined : result.message,
          clearControlError: result.success,
          summary:
            result.patch?.summary ??
            (result.success
              ? (result.message ?? `${control.label}请求已处理`)
              : currentMessage.type === MessageType.AGENT_EXECUTION
                ? (currentMessage.content as { summary?: string }).summary
                : undefined),
          updatedAt: new Date().toISOString(),
        }),
      );
      recordRuntimeEvent({
        type: 'control.result',
        level: result.success ? 'success' : 'error',
        summary: result.success
          ? `执行控制成功：${control.label}`
          : `执行控制失败：${control.label}`,
        messageId: message.id,
        details: {
          action: control.action,
          code: result.code,
          message: result.message,
        },
      });
    },
    [recordRuntimeEvent, updateStructuredMessage],
  );

  const sendMessage = useCallback(
    (content: string, options?: SendMessageOptions) => {
      setInputValue('');
      const sentAt = new Date().toISOString();
      setConversations((previous) =>
        applySentMessageToConversation(previous, activeKey, content, sentAt),
      );
      recordRuntimeEvent({
        type: 'chat.request',
        level: 'info',
        summary: '已发起聊天请求',
        details: {
          promptPreview: content.slice(0, 40),
          mockType: options?.mockType,
          mockChartType: options?.mockChartType,
        },
      });
      onRequest(
        buildRequestParams({
          isRemoteMode: CHAT_PROVIDER_MODE === 'remote',
          messages: [{ role: 'user', content }],
          mockType: options?.mockType,
          mockChartType: options?.mockChartType,
        }),
      );
    },
    [activeKey, onRequest, recordRuntimeEvent, setConversations, setInputValue],
  );

  const handleSenderSubmit = useCallback(
    (content: string) => {
      sendMessage(content, {
        mockType,
        mockChartType: mockType === 'chart' ? mockChartType : undefined,
      });
    },
    [mockChartType, mockType, sendMessage],
  );

  return {
    handleAgentExecutionControl,
    handleFormSubmit,
    handleSenderSubmit,
    sendMessage,
  };
};
