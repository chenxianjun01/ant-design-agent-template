import { Button, Card, Empty, List, Space, Tag, Typography } from 'antd';
import React, { memo } from 'react';

import type { IFileMessageContent } from '../../data';
import type { MessageComponentProps } from './types';
import {
  MessageActionAlert,
  MessageActionBar,
  useMessageActionExecution,
} from './useMessageActionExecution';

const FileMessage: React.FC<MessageComponentProps> = ({
  message,
  onFormSubmit,
}) => {
  const content = message.content as IFileMessageContent;
  const { submittingKey, submitError, retryable, executeAction } =
    useMessageActionExecution({ message, onFormSubmit });

  return (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <MessageActionAlert error={submitError} />
      {(content.title || content.description) && (
        <div>
          {content.title && (
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              {content.title}
            </Typography.Title>
          )}
          {content.description && (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {content.description}
            </Typography.Paragraph>
          )}
        </div>
      )}

      {content.files.length > 0 ? (
        <List
          dataSource={content.files}
          renderItem={(file) => (
            <List.Item
              actions={[
                <Button
                  key="open"
                  type="link"
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  打开
                </Button>,
              ]}
            >
              <Card size="small" style={{ width: '100%' }}>
                <Space
                  orientation="vertical"
                  size={4}
                  style={{ width: '100%' }}
                >
                  <Typography.Text strong>{file.name}</Typography.Text>
                  {file.description && (
                    <Typography.Text type="secondary">
                      {file.description}
                    </Typography.Text>
                  )}
                  <Space size={[4, 4]} wrap>
                    {file.size && <Tag>{file.size}</Tag>}
                    {file.mimeType && <Tag>{file.mimeType}</Tag>}
                  </Space>
                  <MessageActionBar
                    actions={file.actions}
                    baseValues={{
                      fileName: file.name,
                      fileUrl: file.url,
                      fileSize: file.size ?? '',
                      mimeType: file.mimeType ?? '',
                    }}
                    executeAction={executeAction}
                    retryable={retryable}
                    submittingKey={submittingKey}
                  />
                </Space>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="暂无文件数据" />
      )}
    </Space>
  );
};

export default memo(FileMessage);
