import {
  Alert,
  message as antdMessage,
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd';
import React, { memo, useMemo, useState } from 'react';

import type { IFormMessageContent, IFormSubmitAction } from '../../data';
import {
  extractFormPropertiesFromSchema,
  isObjectRecord,
  type SchemaProperty,
} from '../schema/adapter';
import {
  normalizeInitialValues,
  serializeFormValues,
} from '../schema/formValue';
import SchemaSlot from '../schema/SchemaSlot';
import type { MessageComponentProps } from './types';

const renderFieldNode = (property: SchemaProperty) => {
  const component = property['x-component'];
  const componentProps = isObjectRecord(property['x-component-props'])
    ? property['x-component-props']
    : {};

  if (component === 'Select' || Array.isArray(property.enum)) {
    return (
      <Select
        options={(property.enum ?? []).map((item) => ({
          label: String(item),
          value: item,
        }))}
        {...componentProps}
      />
    );
  }

  if (component === 'Switch' || property.type === 'boolean') {
    return <Switch {...componentProps} />;
  }

  if (
    component === 'InputNumber' ||
    property.type === 'number' ||
    property.type === 'integer'
  ) {
    return <InputNumber style={{ width: '100%' }} {...componentProps} />;
  }

  if (component === 'DatePicker') {
    return <DatePicker style={{ width: '100%' }} {...componentProps} />;
  }

  if (component === 'TextArea') {
    return <Input.TextArea rows={4} {...componentProps} />;
  }

  return <Input {...componentProps} />;
};

const FormMessage: React.FC<MessageComponentProps> = ({
  message,
  schemaFieldRender,
  onFormSubmit,
}) => {
  const content = message.content as IFormMessageContent;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [retryable, setRetryable] = useState(true);

  const properties = useMemo(
    () => extractFormPropertiesFromSchema(message.schema),
    [message.schema],
  );

  const initialValues = useMemo(
    () => normalizeInitialValues(content.initialValues),
    [content.initialValues],
  );

  const handleFinish = async (values: Record<string, unknown>) => {
    const serializedValues = serializeFormValues(values);
    setSubmitting(true);
    setSubmitError(undefined);
    setRetryable(true);

    try {
      const result = await onFormSubmit?.(
        {
          ...message,
          content: {
            ...content,
            submitAction: content.submitAction as IFormSubmitAction | undefined,
          },
        },
        serializedValues,
      );

      if (result?.status === 'error') {
        setSubmitError(result.message ?? '提交失败，请稍后重试。');
        setRetryable(result.retryable ?? true);
        return;
      }

      void antdMessage.success('表单已提交，结果已插入对话流');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : '提交失败，请稍后重试。',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const shouldUseSchemaSlot = Boolean(message.schema);

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

      {shouldUseSchemaSlot ? (
        <SchemaSlot
          message={message}
          schema={message.schema}
          schemaFieldRender={schemaFieldRender}
          onFormSubmit={onFormSubmit}
        />
      ) : properties.length > 0 ? (
        <Form
          form={form}
          disabled={submitting}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
        >
          {submitError && (
            <Alert
              showIcon
              type="error"
              message={submitError}
              style={{ marginBottom: 16 }}
            />
          )}

          {properties.map(({ name, property }) => (
            <Form.Item
              key={name}
              name={name}
              label={property.title ?? name}
              tooltip={property.description}
              valuePropName={
                property['x-component'] === 'Switch' ||
                property.type === 'boolean'
                  ? 'checked'
                  : 'value'
              }
              rules={
                property.required
                  ? [
                      {
                        required: true,
                        message: `请输入${property.title ?? name}`,
                      },
                    ]
                  : undefined
              }
            >
              {renderFieldNode(property)}
            </Form.Item>
          ))}

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              disabled={!retryable}
            >
              {submitError ? '重新提交' : '提交'}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Empty description="当前表单 schema 不完整，暂无法渲染动态表单。" />
      )}
    </Space>
  );
};

export default memo(FormMessage);
