import type { ConversationItem } from './data';

export const getConversationGroup = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      (24 * 60 * 60 * 1000),
  );

  if (diffDays <= 0) {
    return '今天';
  }

  if (diffDays === 1) {
    return '昨天';
  }

  return '更早';
};

export const createDraftConversation = (
  key: string,
  label = '新对话',
): ConversationItem => ({
  key,
  label,
  group: '今天',
  isDraft: true,
});

export const refreshConversationItem = (
  conversations: ConversationItem[],
  activeKey: string,
  refreshedAt: string,
): ConversationItem[] => {
  const currentConversation = conversations.find(
    (conversation) => conversation.key === activeKey,
  );

  if (!currentConversation) {
    return conversations;
  }

  const refreshedConversation: ConversationItem = {
    ...currentConversation,
    group: getConversationGroup(refreshedAt),
    updatedAt: refreshedAt,
  };

  return [
    refreshedConversation,
    ...conversations.filter((conversation) => conversation.key !== activeKey),
  ];
};

export const applySentMessageToConversation = (
  conversations: ConversationItem[],
  activeKey: string,
  content: string,
  sentAt: string,
): ConversationItem[] =>
  conversations.map((conversation) =>
    conversation.key === activeKey
      ? {
          ...conversation,
          label: conversation.isDraft
            ? content.slice(0, 20)
            : conversation.label,
          isDraft: false,
          group: getConversationGroup(sentAt),
          updatedAt: sentAt,
        }
      : conversation,
  );

export const deleteConversationItem = (
  conversations: ConversationItem[],
  targetKey: string,
  activeKey: string,
): {
  conversations: ConversationItem[];
  nextActiveKey: string;
} => {
  const nextConversations = conversations.filter(
    (conversation) => conversation.key !== targetKey,
  );

  if (nextConversations.length === 0) {
    const nextKey = crypto.randomUUID();
    return {
      conversations: [createDraftConversation(nextKey, '💬 新对话')],
      nextActiveKey: nextKey,
    };
  }

  return {
    conversations: nextConversations,
    nextActiveKey:
      activeKey === targetKey ? (nextConversations[0]?.key ?? '') : activeKey,
  };
};
