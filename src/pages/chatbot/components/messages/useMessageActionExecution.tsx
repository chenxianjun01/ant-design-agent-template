import { Alert, message as antdMessage, Button, Space } from 'antd';
import React, { useMemo, useState } from 'react';

import type {
  IFormSubmitAction,
  IMessageAction,
  IMessageItem,
} from '../../data';
import type { MessageComponentProps } from './TextMessage';

export interface MessageActionExecutionOptions {
  message: IMessageItem;
  onFormSubmit?: MessageComponentProps['onFormSubmit'];
}

export const useMessageActionExecution = ({
  message,
  onFormSubmit,
}: MessageActionExecutionOptions) => {
  const [submittingKey, setSubmittingKey] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const [retryable, setRetryable] = useState(true);

  const executeAction = async (
    action: IMessageAction,
    actionKey: string,
    baseValues?: Record<string, unknown>,
  ) => {
    setSubmittingKey(actionKey);
    setSubmitError(undefined);
    setRetryable(true);

    try {
      const result = await onFormSubmit?.(
        {
          ...message,
          content: {
            ...(message.content as Record<string, unknown>),
            submitAction: action.submitAction as IFormSubmitAction | undefined,
          },
        },
        {
          ...(baseValues ?? {}),
          ...(action.values ?? {}),
        },
      );

      if (result?.status === 'error') {
        setSubmitError(result.message ?? '执行失败，请稍后重试。');
        setRetryable(result.retryable ?? true);
        return false;
      }

      void antdMessage.success(`已执行“${action.label}”`);
      return true;
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : '执行失败，请稍后重试。',
      );
      return false;
    } finally {
      setSubmittingKey(undefined);
    }
  };

  return {
    submittingKey,
    submitError,
    retryable,
    executeAction,
  };
};

export interface MessageActionBarProps {
  actions?: IMessageAction[];
  baseValues?: Record<string, unknown>;
  executeAction: (
    action: IMessageAction,
    actionKey: string,
    baseValues?: Record<string, unknown>,
  ) => Promise<boolean>;
  retryable: boolean;
  submittingKey?: string;
}

export const MessageActionBar: React.FC<MessageActionBarProps> = ({
  actions,
  baseValues,
  executeAction,
  retryable,
  submittingKey,
}) => {
  const normalizedActions = useMemo(() => actions ?? [], [actions]);

  if (normalizedActions.length === 0) {
    return null;
  }

  return (
    <Space size={8} wrap>
      {normalizedActions.map((action, index) => {
        const actionKey = action.key ?? `${index}-${action.label}`;

        return (
          <Button
            key={actionKey}
            type={action.buttonType ?? 'default'}
            danger={action.danger}
            loading={submittingKey === actionKey}
            disabled={!retryable}
            onClick={() => {
              void executeAction(action, actionKey, baseValues);
            }}
          >
            {action.label}
          </Button>
        );
      })}
    </Space>
  );
};

export const MessageActionAlert: React.FC<{ error?: string }> = ({ error }) =>
  error ? <Alert showIcon type="error" message={error} /> : null;
