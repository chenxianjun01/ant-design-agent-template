import { Button, Card, Empty, Space, Tag, Typography } from 'antd';
import React, { memo, useState } from 'react';

import type { RuntimeEventRecord } from '../runtimeObservability';

export interface RuntimeDebugPanelProps {
  events: RuntimeEventRecord[];
}

const levelColorMap: Record<RuntimeEventRecord['level'], string> = {
  info: 'blue',
  success: 'green',
  warning: 'orange',
  error: 'red',
};

const RuntimeDebugPanel: React.FC<RuntimeDebugPanelProps> = ({ events }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      size="small"
      title="Runtime Debug"
      styles={{
        body: expanded
          ? {
              maxHeight: 'min(360px, 40vh)',
              overflowY: 'auto',
            }
          : undefined,
      }}
      extra={
        <Button size="small" type="text" onClick={() => setExpanded((v) => !v)}>
          {expanded ? '收起' : '展开'}
        </Button>
      }
    >
      {expanded ? (
        events.length > 0 ? (
          <Space
            orientation="vertical"
            size={8}
            style={{ width: '100%' }}
            data-testid="runtime-debug-scroll-content"
          >
            {events.map((event) => (
              <Card
                key={event.id}
                size="small"
                styles={{ body: { padding: 12 } }}
              >
                <Space
                  orientation="vertical"
                  size={6}
                  style={{ width: '100%' }}
                >
                  <Space size={[8, 4]} wrap>
                    <Tag color={levelColorMap[event.level]}>{event.level}</Tag>
                    <Tag>{event.type}</Tag>
                    {event.messageId && <Tag>{event.messageId}</Tag>}
                    <Typography.Text type="secondary">
                      {event.timestamp}
                    </Typography.Text>
                  </Space>
                  <Typography.Text>{event.summary}</Typography.Text>
                  {event.details && Object.keys(event.details).length > 0 && (
                    <Typography.Paragraph
                      type="secondary"
                      style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}
                    >
                      {JSON.stringify(event.details, null, 2)}
                    </Typography.Paragraph>
                  )}
                </Space>
              </Card>
            ))}
          </Space>
        ) : (
          <Empty
            description="当前会话暂无 runtime 调试事件"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )
      ) : (
        <Typography.Text type="secondary">
          已记录 {events.length} 条 runtime 事件
        </Typography.Text>
      )}
    </Card>
  );
};

export default memo(RuntimeDebugPanel);
