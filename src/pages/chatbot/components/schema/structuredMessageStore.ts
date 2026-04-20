import {
  createMessageItem,
  type IMessageItem,
  type IMessageItemDraft,
  resolveMessageTemplate,
} from '../../data';

export type StructuredMessageMap = Record<string, IMessageItem[]>;

export const getStructuredMessagesByConversation = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
): IMessageItem[] => messageMap[conversationKey] ?? [];

export const appendStructuredMessage = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
  message: IMessageItemDraft,
  values?: Record<string, unknown>,
): StructuredMessageMap => {
  const insertedMessage = values
    ? resolveMessageTemplate(message, values)
    : createMessageItem(message);

  return {
    ...messageMap,
    [conversationKey]: [
      ...getStructuredMessagesByConversation(messageMap, conversationKey),
      insertedMessage,
    ],
  };
};

export const upsertStructuredMessageByConversation = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
  message: IMessageItemDraft,
): StructuredMessageMap => {
  const nextMessage = createMessageItem(message);
  const currentMessages = getStructuredMessagesByConversation(
    messageMap,
    conversationKey,
  );
  const existingIndex = currentMessages.findIndex(
    (item) => item.id === nextMessage.id,
  );

  if (existingIndex === -1) {
    return {
      ...messageMap,
      [conversationKey]: [...currentMessages, nextMessage],
    };
  }

  return {
    ...messageMap,
    [conversationKey]: currentMessages.map((item, index) =>
      index === existingIndex ? nextMessage : item,
    ),
  };
};

export const clearStructuredMessagesByConversation = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
): StructuredMessageMap => ({
  ...messageMap,
  [conversationKey]: [],
});

export const updateStructuredMessageByConversation = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
  messageId: string,
  updater: (message: IMessageItem) => IMessageItem,
): StructuredMessageMap => ({
  ...messageMap,
  [conversationKey]: getStructuredMessagesByConversation(
    messageMap,
    conversationKey,
  ).map((message) => (message.id === messageId ? updater(message) : message)),
});

export const removeStructuredMessagesByConversation = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
): StructuredMessageMap => {
  const { [conversationKey]: _removed, ...rest } = messageMap;

  return rest;
};
