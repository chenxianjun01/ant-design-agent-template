import type { IMessageAction, IMessageItem } from '../../data';
import type {
  AgentExecutionControlHandler,
  FormSubmitHandler,
} from '../../types';

export interface MessageComponentProps {
  message: IMessageItem;
  schemaFieldRender?: (
    schema: Record<string, unknown>,
    message: IMessageItem,
  ) => React.ReactNode;
  onFormSubmit?: FormSubmitHandler;
  onAgentExecutionControl?: AgentExecutionControlHandler;
}

export type MessageActionExecutor = (
  action: IMessageAction,
  actionKey: string,
  baseValues?: Record<string, unknown>,
) => Promise<boolean>;

export interface MessageActionAlertProps {
  error?: string;
}
