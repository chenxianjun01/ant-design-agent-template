import { Typography } from 'antd';
import React, { memo } from 'react';

import type { IMessageItem, ITextMessageContent } from '../../data';
import type { FormSubmitExecutionResult } from '../schema/formSubmitAction';

export interface MessageComponentProps {
  message: IMessageItem;
  schemaFieldRender?: (
    schema: Record<string, unknown>,
    message: IMessageItem,
  ) => React.ReactNode;
  onFormSubmit?: (
    message: IMessageItem,
    values: Record<string, unknown>,
  ) => void | Promise<FormSubmitExecutionResult>;
}

const TextMessage: React.FC<MessageComponentProps> = ({ message }) => {
  const content = message.content as ITextMessageContent;

  return (
    <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
      {content.text}
    </Typography.Paragraph>
  );
};

export default memo(TextMessage);
