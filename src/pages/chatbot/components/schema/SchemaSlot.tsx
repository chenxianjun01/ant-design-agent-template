import { InfoCircleOutlined } from '@ant-design/icons';
import {
  DatePicker,
  FormButtonGroup,
  FormItem,
  FormLayout,
  Input,
  NumberPicker,
  Select,
  Submit,
  Switch,
} from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Alert, message as antdMessage } from 'antd';
import React, { memo, useEffect, useMemo, useState } from 'react';

import {
  type IFormMessageContent,
  type IMessageItem,
  type MessageSchema,
  MessageType,
} from '../../data';
import type { FormSubmitExecutionResult } from './formSubmitAction';
import { normalizeInitialValues, serializeFormValues } from './formValue';

export interface SchemaSlotProps {
  message: IMessageItem;
  schema?: MessageSchema;
  schemaFieldRender?: (
    schema: MessageSchema,
    message: IMessageItem,
  ) => React.ReactNode;
  onFormSubmit?: (
    message: IMessageItem,
    values: Record<string, unknown>,
  ) => void | Promise<FormSubmitExecutionResult>;
}

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    Switch,
    DatePicker,
    NumberPicker,
    TextArea: Input.TextArea,
  },
});

const isRenderableFormSchema = (
  schema: MessageSchema | undefined,
): schema is MessageSchema =>
  Boolean(
    schema &&
      typeof schema === 'object' &&
      !Array.isArray(schema) &&
      'properties' in schema,
  );

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeFormilyComponentName = (component: unknown) => {
  if (component === 'InputNumber') {
    return 'NumberPicker';
  }

  return typeof component === 'string' ? component : undefined;
};

const prepareFormilySchema = (schema: MessageSchema): MessageSchema => {
  const requiredFields = Array.isArray(schema.required)
    ? schema.required.filter((item): item is string => typeof item === 'string')
    : [];

  const visit = (value: unknown, fieldName?: string): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => visit(item));
    }

    if (!isObjectRecord(value)) {
      return value;
    }

    const next: Record<string, unknown> = Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, visit(item, key)]),
    );

    const componentName = normalizeFormilyComponentName(next['x-component']);
    if (componentName) {
      next['x-component'] = componentName;
      next['x-decorator'] =
        typeof next['x-decorator'] === 'string'
          ? next['x-decorator']
          : 'FormItem';
    }

    if (fieldName && requiredFields.includes(fieldName)) {
      next.required = true;
    }

    return next;
  };

  return visit(schema) as MessageSchema;
};

const DefaultFormSchemaSlot: React.FC<
  Required<Pick<SchemaSlotProps, 'message' | 'schema'>> &
    Pick<SchemaSlotProps, 'onFormSubmit'>
> = ({ message, schema, onFormSubmit }) => {
  const content = message.content as IFormMessageContent;
  const preparedSchema = useMemo(() => prepareFormilySchema(schema), [schema]);
  const initialValues = useMemo(
    () => normalizeInitialValues(content.initialValues),
    [content.initialValues],
  );
  const form = useMemo(
    () =>
      createForm({
        values: initialValues,
      }),
    [initialValues],
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [retryable, setRetryable] = useState(true);

  useEffect(() => {
    form.setValues(initialValues ?? {});
  }, [form, initialValues]);

  const handleSubmit = async (values: Record<string, unknown>) => {
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

  return (
    <FormProvider form={form}>
      <FormLayout layout="vertical">
        {submitError && (
          <Alert
            showIcon
            type="error"
            message={submitError}
            style={{ marginBottom: 16 }}
          />
        )}

        <SchemaField schema={preparedSchema} />

        <FormButtonGroup.FormItem style={{ marginTop: 8, marginBottom: 0 }}>
          <Submit
            block
            onSubmit={handleSubmit}
            disabled={!retryable}
            loading={submitting}
          >
            {submitError ? '重新提交' : '提交'}
          </Submit>
        </FormButtonGroup.FormItem>
      </FormLayout>
    </FormProvider>
  );
};

const SchemaSlot: React.FC<SchemaSlotProps> = ({
  message,
  schema,
  schemaFieldRender,
  onFormSubmit,
}) => {
  if (!schema) {
    return null;
  }

  if (schemaFieldRender) {
    return <>{schemaFieldRender(schema, message)}</>;
  }

  const isFormMessage = message.type === MessageType.FORM;

  if (!isFormMessage) {
    return null;
  }

  if (!isRenderableFormSchema(schema)) {
    return (
      <Alert
        showIcon
        type="info"
        icon={<InfoCircleOutlined />}
        message="当前 schema 暂不支持 Formily 默认渲染"
        description="已保留 SchemaSlot 入口；若后端 schema 不符合当前约定，可继续通过 schemaFieldRender 自定义接管。"
      />
    );
  }

  return (
    <DefaultFormSchemaSlot
      message={message}
      schema={schema}
      onFormSubmit={onFormSubmit}
    />
  );
};

export default memo(SchemaSlot);
