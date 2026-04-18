import { Alert } from 'antd';
import React, { memo } from 'react';

import type { MessageComponentProps } from './TextMessage';

const UnsupportedMessage: React.FC<MessageComponentProps> = ({ message }) => {
  return (
    <Alert
      type="warning"
      showIcon
      message="暂不支持该消息类型"
      description={`当前返回的 type 为 "${message.type}"，请先注册对应的渲染组件。`}
    />
  );
};

export default memo(UnsupportedMessage);
