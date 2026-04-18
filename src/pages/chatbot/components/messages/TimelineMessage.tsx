import { Empty, Space, Tag, Timeline, Typography } from 'antd';
import React, { memo } from 'react';

import type { ITimelineMessageContent } from '../../data';
import type { MessageComponentProps } from './TextMessage';

const statusColorMap: Record<
  NonNullable<ITimelineMessageContent['items'][number]['status']>,
  string
> = {
  wait: 'gray',
  process: 'blue',
  finish: 'green',
  error: 'red',
};

const TimelineMessage: React.FC<MessageComponentProps> = ({ message }) => {
  const content = message.content as ITimelineMessageContent;

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
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

      {content.items.length > 0 ? (
        <Timeline
          mode="left"
          items={content.items.map((item, index) => ({
            key: item.key ?? `${index}-${item.title}`,
            color:
              item.color ??
              (item.status ? statusColorMap[item.status] : undefined),
            label: item.time,
            children: (
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Typography.Text strong>{item.title}</Typography.Text>
                {item.description && (
                  <Typography.Text type="secondary">
                    {item.description}
                  </Typography.Text>
                )}
                {item.tags && item.tags.length > 0 && (
                  <Space size={[4, 4]} wrap>
                    {item.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                )}
              </Space>
            ),
          }))}
        />
      ) : (
        <Empty description="暂无时间轴数据" />
      )}
    </Space>
  );
};

export default memo(TimelineMessage);
