import { Typography } from 'antd';
import React, { memo } from 'react';

import type { ITextMessageContent } from '../../data';
import type { MessageComponentProps } from './types';

const TextMessage: React.FC<MessageComponentProps> = ({ message }) => {
  const content = message.content as ITextMessageContent;

  return (
    <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
      {content.text}
    </Typography.Paragraph>
  );
};

export default memo(TextMessage);
