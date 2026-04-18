import React, { memo, useMemo } from 'react';

import type { IMessageItem, MessageSchema } from '../data';
import { MessageType } from '../data';
import ApprovalMessage from './messages/ApprovalMessage';
import AudioMessage from './messages/AudioMessage';
import ChartMessage from './messages/ChartMessage';
import FileMessage from './messages/FileMessage';
import FormMessage from './messages/FormMessage';
import ImageMessage from './messages/ImageMessage';
import MapMessage from './messages/MapMessage';
import TableMessage from './messages/TableMessage';
import type { MessageComponentProps } from './messages/TextMessage';
import TextMessage from './messages/TextMessage';
import TimelineMessage from './messages/TimelineMessage';
import UnsupportedMessage from './messages/UnsupportedMessage';
import type { FormSubmitExecutionResult } from './schema/formSubmitAction';

export interface MessageRendererProps {
  message: IMessageItem;
  schemaFieldRender?: (
    schema: MessageSchema,
    message: IMessageItem,
  ) => React.ReactNode;
  onFormSubmit?: (
    message: IMessageItem,
    values: Record<string, unknown>,
  ) => void | Promise<FormSubmitExecutionResult>;
}

type MessageComponent = React.ComponentType<MessageComponentProps>;

export const componentMap: Record<MessageType, MessageComponent> = {
  [MessageType.TEXT]: TextMessage,
  [MessageType.FILE]: FileMessage,
  [MessageType.IMAGE]: ImageMessage,
  [MessageType.AUDIO]: AudioMessage,
  [MessageType.TABLE]: TableMessage,
  [MessageType.CHART]: ChartMessage,
  [MessageType.FORM]: FormMessage,
  [MessageType.MAP]: MapMessage,
  [MessageType.TIMELINE]: TimelineMessage,
  [MessageType.APPROVAL]: ApprovalMessage,
};

const normalizeMessageType = (
  type: IMessageItem['type'],
): MessageType | undefined => {
  const normalized = String(type).toLowerCase();
  return Object.values(MessageType).find(
    (messageType) => messageType === normalized,
  );
};

const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  schemaFieldRender,
  onFormSubmit,
}) => {
  const Component = useMemo<MessageComponent>(() => {
    const type = normalizeMessageType(message.type);
    return type ? componentMap[type] : UnsupportedMessage;
  }, [message.type]);

  return (
    <Component
      message={message}
      schemaFieldRender={schemaFieldRender}
      onFormSubmit={onFormSubmit}
    />
  );
};

export const createMessageBoxTextRenderer =
  (options?: Omit<MessageRendererProps, 'message'>) =>
  (message: IMessageItem): React.ReactNode => (
    <MessageRenderer message={message} {...options} />
  );

export default memo(MessageRenderer);
