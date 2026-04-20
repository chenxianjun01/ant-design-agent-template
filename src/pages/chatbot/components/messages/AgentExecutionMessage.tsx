import { Alert, Button, Card, Empty, Space, Tag, Typography } from 'antd';
import React, { memo } from 'react';

import type {
  AgentExecutionStatus,
  AgentExecutionStepStatus,
  IAgentExecutionMessageContent,
} from '../../data';
import type { MessageComponentProps } from './types';

const statusLabelMap: Record<AgentExecutionStatus, string> = {
  running: '执行中',
  success: '已完成',
  error: '执行失败',
};

const statusColorMap: Record<AgentExecutionStatus, string> = {
  running: 'processing',
  success: 'success',
  error: 'error',
};

const alertTypeMap: Record<AgentExecutionStatus, 'info' | 'success' | 'error'> =
  {
    running: 'info',
    success: 'success',
    error: 'error',
  };

const stepStatusColorMap: Record<AgentExecutionStepStatus, string> = {
  wait: 'default',
  running: 'processing',
  success: 'success',
  error: 'error',
};

const stepStatusLabelMap: Record<AgentExecutionStepStatus, string> = {
  wait: '待执行',
  running: '进行中',
  success: '成功',
  error: '失败',
};

const AgentExecutionMessage: React.FC<MessageComponentProps> = ({
  message,
  onAgentExecutionControl,
}) => {
  const content = message.content as IAgentExecutionMessageContent;

  return (
    <Card
      size="small"
      title={content.title}
      extra={
        <Tag color={statusColorMap[content.status]}>
          {statusLabelMap[content.status]}
        </Tag>
      }
    >
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        {content.description && (
          <Typography.Text type="secondary">
            {content.description}
          </Typography.Text>
        )}

        {content.summary && (
          <Alert
            type={alertTypeMap[content.status]}
            showIcon
            title={content.summary}
          />
        )}

        {content.controlErrorMessage && (
          <Alert type="error" showIcon title={content.controlErrorMessage} />
        )}

        {content.controls && content.controls.length > 0 && (
          <Space size={[8, 8]} wrap>
            {content.controls.map((control) => (
              <Button
                key={control.key}
                size="small"
                type={control.buttonType ?? 'default'}
                danger={control.danger}
                disabled={
                  control.disabled ||
                  !onAgentExecutionControl ||
                  Boolean(content.pendingControlKey)
                }
                loading={content.pendingControlKey === control.key}
                onClick={() => {
                  void onAgentExecutionControl?.(message, control);
                }}
              >
                {control.label}
              </Button>
            ))}
          </Space>
        )}

        {(content.startedAt || content.updatedAt) && (
          <Space size={[8, 4]} wrap>
            {content.startedAt && <Tag>开始于 {content.startedAt}</Tag>}
            {content.updatedAt && <Tag>更新于 {content.updatedAt}</Tag>}
          </Space>
        )}

        {content.steps.length > 0 ? (
          <Space orientation="vertical" size={8} style={{ width: '100%' }}>
            {content.steps.map((step, index) => (
              <Card
                key={step.key ?? `${index}-${step.title}`}
                size="small"
                styles={{ body: { padding: 12 } }}
              >
                <Space
                  orientation="vertical"
                  size={6}
                  style={{ width: '100%' }}
                >
                  <Space size={[8, 4]} wrap>
                    <Typography.Text strong>{step.title}</Typography.Text>
                    <Tag color={stepStatusColorMap[step.status]}>
                      {stepStatusLabelMap[step.status]}
                    </Tag>
                    {step.duration && <Tag>{step.duration}</Tag>}
                  </Space>

                  {step.description && (
                    <Typography.Text type="secondary">
                      {step.description}
                    </Typography.Text>
                  )}

                  {(step.startedAt || step.finishedAt) && (
                    <Space size={[8, 4]} wrap>
                      {step.startedAt && <Tag>开始 {step.startedAt}</Tag>}
                      {step.finishedAt && <Tag>结束 {step.finishedAt}</Tag>}
                    </Space>
                  )}

                  {step.tags && step.tags.length > 0 && (
                    <Space size={[4, 4]} wrap>
                      {step.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  )}
                </Space>
              </Card>
            ))}
          </Space>
        ) : (
          <Empty
            description="暂无执行步骤"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Space>
    </Card>
  );
};

export default memo(AgentExecutionMessage);
