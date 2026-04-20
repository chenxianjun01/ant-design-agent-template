import type { DescriptionsProps } from 'antd';
import { Card, Descriptions, Empty, Space, Tag, Typography } from 'antd';
import React, { memo, useMemo } from 'react';

import type {
  ApprovalStatus,
  IApprovalMessageContent,
  IFormSubmitAction,
} from '../../data';
import type { MessageComponentProps } from './types';
import {
  MessageActionAlert,
  MessageActionBar,
  useMessageActionExecution,
} from './useMessageActionExecution';

const statusLabelMap: Record<ApprovalStatus, string> = {
  pending: '待审批',
  approved: '已通过',
  rejected: '已拒绝',
  processing: '处理中',
};

const statusColorMap: Record<ApprovalStatus, string> = {
  pending: 'gold',
  approved: 'green',
  rejected: 'red',
  processing: 'blue',
};

const buildActionValues = (
  content: IApprovalMessageContent,
  values?: Record<string, unknown>,
) => ({
  title: content.title,
  description: content.description ?? '',
  summary: content.summary ?? '',
  status: content.status ?? '',
  applicant: content.applicant ?? '',
  approver: content.approver ?? '',
  tags: (content.tags ?? []).join(', '),
  ...(content.fields ?? []).reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key ?? field.label] = field.value;
    return acc;
  }, {}),
  ...(values ?? {}),
});

const ApprovalMessage: React.FC<MessageComponentProps> = ({
  message,
  onFormSubmit,
}) => {
  const content = message.content as IApprovalMessageContent;
  const descriptionItems = [
    content.applicant
      ? { key: 'applicant', label: '申请人', children: content.applicant }
      : undefined,
    content.approver
      ? { key: 'approver', label: '当前处理人', children: content.approver }
      : undefined,
    ...(content.fields ?? []).map((field, index) => ({
      key: field.key ?? `${index}-${field.label}`,
      label: field.label,
      children: field.emphasis ? (
        <Typography.Text strong>{field.value}</Typography.Text>
      ) : (
        field.value
      ),
    })),
  ].filter(Boolean) as NonNullable<DescriptionsProps['items']>;
  const actions = useMemo(() => content.actions ?? [], [content.actions]);
  const { submittingKey, submitError, retryable, executeAction } =
    useMessageActionExecution({
      message: {
        ...message,
        content: {
          ...content,
          submitAction: undefined as IFormSubmitAction | undefined,
        },
      },
      onFormSubmit,
    });
  const baseValues = useMemo(() => buildActionValues(content), [content]);

  return (
    <Card
      size="small"
      title={content.title}
      extra={
        content.status ? (
          <Tag color={statusColorMap[content.status]}>
            {statusLabelMap[content.status]}
          </Tag>
        ) : undefined
      }
    >
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <MessageActionAlert error={submitError} />

        {content.description && (
          <Typography.Text type="secondary">
            {content.description}
          </Typography.Text>
        )}

        {content.summary && (
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            {content.summary}
          </Typography.Paragraph>
        )}

        {content.tags && content.tags.length > 0 && (
          <Space size={[4, 4]} wrap>
            {content.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        )}

        {descriptionItems.length > 0 ? (
          <Descriptions
            column={1}
            items={descriptionItems}
            size="small"
            styles={{ label: { width: 96 } }}
          />
        ) : (
          <Empty
            description="暂无审批摘要信息"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}

        <MessageActionBar
          actions={actions}
          baseValues={baseValues}
          executeAction={executeAction}
          retryable={retryable}
          submittingKey={submittingKey}
        />
      </Space>
    </Card>
  );
};

export default memo(ApprovalMessage);
