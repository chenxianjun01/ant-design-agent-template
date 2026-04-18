import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { MessageType } from '../../data';
import SchemaSlot from './SchemaSlot';

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');

  return {
    ...actual,
    message: {
      ...actual.message,
      success: jest.fn(),
    },
  };
});

const createFormMessage = () => ({
  id: 'form-message',
  role: 'assistant' as const,
  type: MessageType.FORM,
  content: {
    title: '测试表单',
    initialValues: {
      applicant: '张三',
    },
  },
});

describe('SchemaSlot runtime', () => {
  it('prefers external schemaFieldRender over default Formily runtime', () => {
    const schemaFieldRender = jest.fn(() =>
      React.createElement(
        'div',
        { 'data-testid': 'schema-override' },
        'override',
      ),
    );

    render(
      React.createElement(SchemaSlot, {
        message: createFormMessage(),
        schema: {
          type: 'object',
          properties: {
            applicant: {
              type: 'string',
              title: '申请人',
              'x-component': 'Input',
            },
          },
        },
        schemaFieldRender,
      }),
    );

    expect(schemaFieldRender).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('schema-override').textContent).toBe('override');
    expect(screen.queryByText('提交')).toBeNull();
  });

  it('returns no default runtime for non-form messages', () => {
    const { container } = render(
      React.createElement(SchemaSlot, {
        message: {
          id: 'table-message',
          role: 'assistant' as const,
          type: MessageType.TABLE,
          content: {
            dataSource: [],
          },
        },
        schema: {
          type: 'object',
          properties: {},
        },
      }),
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows safe fallback for unsupported form schema', () => {
    render(
      React.createElement(SchemaSlot, {
        message: createFormMessage(),
        schema: {
          type: 'object',
        },
      }),
    );

    expect(
      screen.getByText('当前 schema 暂不支持 Formily 默认渲染'),
    ).toBeTruthy();
  });

  it('bridges Formily form submit to onFormSubmit with normalized values', async () => {
    const onFormSubmit = jest.fn().mockResolvedValue({
      status: 'success',
    });

    render(
      React.createElement(SchemaSlot, {
        message: createFormMessage(),
        schema: {
          type: 'object',
          required: ['applicant'],
          properties: {
            applicant: {
              type: 'string',
              title: '申请人',
              'x-component': 'Input',
            },
          },
        },
        onFormSubmit,
      }),
    );

    expect(screen.getByDisplayValue('张三')).toBeTruthy();

    fireEvent.click(
      screen.getByRole('button', {
        name: /提\s*交/,
      }),
    );

    await waitFor(() => {
      expect(onFormSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onFormSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'form-message',
        type: MessageType.FORM,
      }),
      {
        applicant: '张三',
      },
    );
  });

  it('renders supported field types and submits normalized values', async () => {
    const onFormSubmit = jest.fn().mockResolvedValue({
      status: 'success',
    });

    render(
      React.createElement(SchemaSlot, {
        message: {
          id: 'multi-field-form',
          role: 'assistant' as const,
          type: MessageType.FORM,
          content: {
            title: '多字段表单',
            initialValues: {
              applicant: '李四',
              priority: 'high',
              needNotify: true,
              estimateHours: 6,
              description: '需要跟进',
              planDate: '2026-04-18',
            },
          },
        },
        schema: {
          type: 'object',
          properties: {
            applicant: {
              type: 'string',
              title: '申请人',
              'x-component': 'Input',
            },
            priority: {
              type: 'string',
              title: '优先级',
              enum: ['low', 'medium', 'high'],
              'x-component': 'Select',
            },
            needNotify: {
              type: 'boolean',
              title: '是否通知',
              'x-component': 'Switch',
            },
            estimateHours: {
              type: 'number',
              title: '预计工时',
              'x-component': 'InputNumber',
            },
            description: {
              type: 'string',
              title: '说明',
              'x-component': 'TextArea',
            },
            planDate: {
              type: 'string',
              title: '计划日期',
              'x-component': 'DatePicker',
            },
          },
        },
        onFormSubmit,
      }),
    );

    expect(screen.getByDisplayValue('李四')).toBeTruthy();
    expect(screen.getByDisplayValue('需要跟进')).toBeTruthy();
    expect(screen.getByDisplayValue('6')).toBeTruthy();
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe(
      'true',
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /提\s*交/,
      }),
    );

    await waitFor(() => {
      expect(onFormSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onFormSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'multi-field-form',
        type: MessageType.FORM,
      }),
      expect.objectContaining({
        applicant: '李四',
        priority: 'high',
        needNotify: true,
        estimateHours: 6,
        description: '需要跟进',
      }),
    );
  });

  it('degrades safely for malformed schema-like inputs', () => {
    render(
      React.createElement(SchemaSlot, {
        message: createFormMessage(),
        schema: 'invalid-schema' as unknown as Record<string, unknown>,
      }),
    );

    expect(
      screen.getByText('当前 schema 暂不支持 Formily 默认渲染'),
    ).toBeTruthy();
  });
});
