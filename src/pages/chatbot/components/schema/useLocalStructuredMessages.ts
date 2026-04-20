import { useCallback, useMemo, useState } from 'react';

import type { IMessageItem, IMessageItemDraft } from '../../data';
import {
  appendStructuredMessage,
  clearStructuredMessagesByConversation,
  getStructuredMessagesByConversation,
  removeStructuredMessagesByConversation,
  type StructuredMessageMap,
  updateStructuredMessageByConversation,
  upsertStructuredMessageByConversation,
} from './structuredMessageStore';

export interface UseLocalStructuredMessagesOptions {
  conversationKey: string;
  initialMessageMap?: StructuredMessageMap;
}

export const useLocalStructuredMessages = ({
  conversationKey,
  initialMessageMap = {},
}: UseLocalStructuredMessagesOptions) => {
  const [messageMap, setMessageMap] =
    useState<StructuredMessageMap>(initialMessageMap);

  const structuredMessages = useMemo(
    () => getStructuredMessagesByConversation(messageMap, conversationKey),
    [conversationKey, messageMap],
  );

  const insertStructuredMessage = useCallback(
    (message: IMessageItemDraft, values?: Record<string, unknown>) => {
      setMessageMap((previous) =>
        appendStructuredMessage(previous, conversationKey, message, values),
      );
    },
    [conversationKey],
  );

  const clearStructuredMessages = useCallback(() => {
    setMessageMap((previous) =>
      clearStructuredMessagesByConversation(previous, conversationKey),
    );
  }, [conversationKey]);

  const upsertStructuredMessage = useCallback(
    (message: IMessageItemDraft) => {
      setMessageMap((previous) =>
        upsertStructuredMessageByConversation(
          previous,
          conversationKey,
          message,
        ),
      );
    },
    [conversationKey],
  );

  const updateStructuredMessage = useCallback(
    (messageId: string, updater: (message: IMessageItem) => IMessageItem) => {
      setMessageMap((previous) =>
        updateStructuredMessageByConversation(
          previous,
          conversationKey,
          messageId,
          updater,
        ),
      );
    },
    [conversationKey],
  );

  const removeConversationStructuredMessages = useCallback(
    (targetConversationKey: string) => {
      setMessageMap((previous) =>
        removeStructuredMessagesByConversation(previous, targetConversationKey),
      );
    },
    [],
  );

  return {
    messageMap,
    structuredMessages,
    insertStructuredMessage,
    upsertStructuredMessage,
    updateStructuredMessage,
    clearStructuredMessages,
    removeConversationStructuredMessages,
  };
};

export default useLocalStructuredMessages;
