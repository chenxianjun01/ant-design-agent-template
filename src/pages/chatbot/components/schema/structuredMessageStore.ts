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

export const clearStructuredMessagesByConversation = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
): StructuredMessageMap => ({
  ...messageMap,
  [conversationKey]: [],
});

export const removeStructuredMessagesByConversation = (
  messageMap: StructuredMessageMap,
  conversationKey: string,
): StructuredMessageMap => {
  const { [conversationKey]: _removed, ...rest } = messageMap;

  return rest;
};
