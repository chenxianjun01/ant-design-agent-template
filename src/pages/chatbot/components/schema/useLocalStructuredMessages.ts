import { useCallback, useMemo, useState } from 'react';

import type { IMessageItemDraft } from '../../data';
import {
  appendStructuredMessage,
  clearStructuredMessagesByConversation,
  getStructuredMessagesByConversation,
  removeStructuredMessagesByConversation,
  type StructuredMessageMap,
} from './structuredMessageStore';

export interface UseLocalStructuredMessagesOptions {
  conversationKey: string;
}

export const useLocalStructuredMessages = ({
  conversationKey,
}: UseLocalStructuredMessagesOptions) => {
  const [messageMap, setMessageMap] = useState<StructuredMessageMap>({});

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

  const removeConversationStructuredMessages = useCallback(
    (targetConversationKey: string) => {
      setMessageMap((previous) =>
        removeStructuredMessagesByConversation(previous, targetConversationKey),
      );
    },
    [],
  );

  return {
    structuredMessages,
    insertStructuredMessage,
    clearStructuredMessages,
    removeConversationStructuredMessages,
  };
};

export default useLocalStructuredMessages;
