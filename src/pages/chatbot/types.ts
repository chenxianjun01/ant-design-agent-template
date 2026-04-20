import type { FormSubmitExecutionResult } from './components/schema/formSubmitAction';
import type { IAgentExecutionControl, IMessageItem } from './data';

export type MaybePromise<T> = Promise<T> | undefined;

export type FormSubmitHandler = (
  message: IMessageItem,
  values: Record<string, unknown>,
) => MaybePromise<FormSubmitExecutionResult>;

export type AgentExecutionControlHandler = (
  message: IMessageItem,
  control: IAgentExecutionControl,
) => MaybePromise<void>;
