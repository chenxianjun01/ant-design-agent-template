import { Card, Empty, Image, Space, Typography } from 'antd';
import React, { memo } from 'react';

import type { IImageMessageContent } from '../../data';
import type { MessageComponentProps } from './types';
import {
  MessageActionAlert,
  MessageActionBar,
  useMessageActionExecution,
} from './useMessageActionExecution';

const ImageMessage: React.FC<MessageComponentProps> = ({
  message,
  onFormSubmit,
}) => {
  const content = message.content as IImageMessageContent;
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

      {content.images.length > 0 ? (
        <Space size={[12, 12]} wrap>
          {content.images.map((image, index) => (
            <Card
              key={image.key ?? `${index}-${image.url}`}
              size="small"
              bodyStyle={{ padding: 12 }}
            >
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                <Image
                  src={image.url}
                  alt={image.alt ?? image.title ?? `image-${index}`}
                  width="100%"
                  height={image.height}
                  style={{ objectFit: 'cover' }}
                />
                {(image.title || image.description) && (
                  <div>
                    {image.title && (
                      <Typography.Text strong>{image.title}</Typography.Text>
                    )}
                    {image.description && (
                      <Typography.Paragraph
                        type="secondary"
                        style={{ marginBottom: 0, marginTop: 4 }}
                      >
                        {image.description}
                      </Typography.Paragraph>
                    )}
                  </div>
                )}
                <MessageActionBar
                  actions={image.actions}
                  baseValues={{
                    imageTitle: image.title ?? '',
                    imageUrl: image.url,
                    imageAlt: image.alt ?? '',
                  }}
                  executeAction={executeAction}
                  retryable={retryable}
                  submittingKey={submittingKey}
                />
              </Space>
            </Card>
          ))}
        </Space>
      ) : (
        <Empty description="暂无图片数据" />
      )}
    </Space>
  );
};

export default memo(ImageMessage);
