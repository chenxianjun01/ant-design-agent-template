import { Empty, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import type { IMessageTableColumn, ITableMessageContent } from '../../data';
import {
  extractTableColumnsFromSchema,
  isObjectRecord,
} from '../schema/adapter';
import SchemaSlot from '../schema/SchemaSlot';
import type { MessageComponentProps } from './types';

const inferColumnsFromData = (
  dataSource: Record<string, unknown>[],
): IMessageTableColumn[] => {
  const firstRow = dataSource[0];
  if (!firstRow) {
    return [];
  }

  return Object.keys(firstRow).map((key) => ({
    key,
    dataIndex: key,
    title: key,
    ellipsis: true,
  }));
};

const renderCellValue = (
  value: unknown,
  column?: IMessageTableColumn,
): React.ReactNode => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (column?.valueType === 'digit' && typeof value === 'number') {
    return value.toLocaleString();
  }

  if (column?.valueType === 'percent' && typeof value === 'number') {
    return `${value}%`;
  }

  if (column?.valueType === 'dateTime') {
    const formatted = dayjs(value as dayjs.ConfigType);
    return formatted.isValid() ? formatted.format('YYYY-MM-DD HH:mm:ss') : '-';
  }

  if (column?.valueType === 'tag') {
    if (Array.isArray(value)) {
      return (
        <Space size={[4, 4]} wrap>
          {value.map((item) => (
            <Tag key={String(item)}>{String(item)}</Tag>
          ))}
        </Space>
      );
    }

    return <Tag>{String(value)}</Tag>;
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(' / ');
  }

  if (isObjectRecord(value)) {
    return JSON.stringify(value);
  }

  return String(value);
};

const TableMessage: React.FC<MessageComponentProps> = ({
  message,
  schemaFieldRender,
}) => {
  const content = message.content as ITableMessageContent;

  const resolvedColumns = useMemo(() => {
    const sourceColumns =
      content.columns ??
      extractTableColumnsFromSchema(message.schema) ??
      inferColumnsFromData(content.dataSource);

    return sourceColumns.filter((column) => Boolean(column.dataIndex));
  }, [content.columns, content.dataSource, message.schema]);

  const columns = useMemo<ColumnsType<Record<string, unknown>>>(
    () =>
      resolvedColumns.map((column) => ({
        key: column.key ?? column.dataIndex,
        title: column.title,
        dataIndex: column.dataIndex,
        width: column.width,
        ellipsis: column.ellipsis,
        align: column.align,
        render: (value: unknown) => renderCellValue(value, column),
      })),
    [resolvedColumns],
  );

  const rowKey = content.rowKey ?? 'id';

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

      <SchemaSlot
        message={message}
        schema={message.schema}
        schemaFieldRender={schemaFieldRender}
      />

      <Table<Record<string, unknown>>
        rowKey={(record, index) =>
          String(record[rowKey] ?? record.key ?? index ?? 'row')
        }
        size={content.size ?? 'small'}
        bordered={content.bordered ?? true}
        pagination={content.pagination ?? false}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: <Empty description="暂无表格数据" /> }}
        columns={columns}
        dataSource={content.dataSource}
      />
    </Space>
  );
};

export default memo(TableMessage);
