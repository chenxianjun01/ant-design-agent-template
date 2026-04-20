import React, { memo, useMemo } from 'react';

import type { IMessageItem, MessageSchema } from '../data';
import { MessageType } from '../data';
import type { AgentExecutionControlHandler, FormSubmitHandler } from '../types';
import AgentExecutionMessage from './messages/AgentExecutionMessage';
import ApprovalMessage from './messages/ApprovalMessage';
import AudioMessage from './messages/AudioMessage';
import ChartMessage from './messages/ChartMessage';
import FileMessage from './messages/FileMessage';
import FormMessage from './messages/FormMessage';
import ImageMessage from './messages/ImageMessage';
import MapMessage from './messages/MapMessage';
import TableMessage from './messages/TableMessage';
import TextMessage from './messages/TextMessage';
import TimelineMessage from './messages/TimelineMessage';
import type { MessageComponentProps } from './messages/types';
import UnsupportedMessage from './messages/UnsupportedMessage';

export interface MessageRendererProps {
  message: IMessageItem;
  schemaFieldRender?: (
    schema: MessageSchema,
    message: IMessageItem,
  ) => React.ReactNode;
  onFormSubmit?: FormSubmitHandler;
  onAgentExecutionControl?: AgentExecutionControlHandler;
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
  [MessageType.AGENT_EXECUTION]: AgentExecutionMessage,
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
  onAgentExecutionControl,
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
      onAgentExecutionControl={onAgentExecutionControl}
    />
  );
};

export const createMessageBoxTextRenderer =
  (options?: Omit<MessageRendererProps, 'message'>) =>
  (message: IMessageItem): React.ReactNode => (
    <MessageRenderer message={message} {...options} />
  );

export default memo(MessageRenderer);
