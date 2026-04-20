import { useCallback } from 'react';

import type { PersistedParsedChatRecord } from './chatPersistence';
import {
  createDraftConversation,
  deleteConversationItem,
} from './conversationHelpers';
import type { ConversationItem } from './data';

interface UseConversationControllerOptions {
  activeKey: string;
  setActiveKey: React.Dispatch<React.SetStateAction<string>>;
  setChatMessageMap: React.Dispatch<
    React.SetStateAction<Record<string, PersistedParsedChatRecord[]>>
  >;
  setConversations: React.Dispatch<React.SetStateAction<ConversationItem[]>>;
  removeConversationStructuredMessages: (targetConversationKey: string) => void;
}

export const useConversationController = ({
  activeKey,
  setActiveKey,
  setChatMessageMap,
  setConversations,
  removeConversationStructuredMessages,
}: UseConversationControllerOptions) => {
  const newChat = useCallback(() => {
    const key = crypto.randomUUID();
    setConversations((previous) => [createDraftConversation(key), ...previous]);
    setActiveKey(key);
  }, [setActiveKey, setConversations]);

  const deleteConversation = useCallback(
    (conversationKey: string) => {
      removeConversationStructuredMessages(conversationKey);
      setChatMessageMap((previous) => {
        const { [conversationKey]: _removed, ...rest } = previous;
        return rest;
      });
      setConversations((previous) => {
        const next = deleteConversationItem(
          previous,
          conversationKey,
          activeKey,
        );
        setActiveKey(next.nextActiveKey);
        return next.conversations;
      });
    },
    [
      activeKey,
      removeConversationStructuredMessages,
      setActiveKey,
      setChatMessageMap,
      setConversations,
    ],
  );

  const getConversationMenu = useCallback(
    (conversation: { key: string }) => ({
      items: [{ key: 'delete', label: '删除', danger: true }],
      onClick: ({ key }: { key: string }) => {
        if (key === 'delete') {
          deleteConversation(conversation.key);
        }
      },
    }),
    [deleteConversation],
  );

  return {
    getConversationMenu,
    newChat,
  };
};
