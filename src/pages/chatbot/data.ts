import type { TablePaginationConfig } from 'antd';
import type { MockChartType, MockMessageType } from './service';

export interface ConversationItem {
  key: string;
  label: string;
  group?: string;
  isDraft?: boolean;
  updatedAt?: string;
  starterPrompt?: string;
  starterMockType?: MockMessageType;
  starterMockChartType?: MockChartType;
}

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  TABLE = 'table',
  CHART = 'chart',
  FORM = 'form',
  MAP = 'map',
  TIMELINE = 'timeline',
  APPROVAL = 'approval',
  AGENT_EXECUTION = 'agent-execution',
}

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageSchema = Record<string, unknown>;
export type MessageTableValueType =
  | 'text'
  | 'digit'
  | 'percent'
  | 'dateTime'
  | 'tag';
export type MessageActionButtonType =
  | 'primary'
  | 'default'
  | 'dashed'
  | 'link'
  | 'text';
export type TimelineItemStatus = 'wait' | 'process' | 'finish' | 'error';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'processing';
export type AgentExecutionStatus = 'running' | 'success' | 'error';
export type AgentExecutionStepStatus = 'wait' | 'running' | 'success' | 'error';
export type AgentExecutionControlAction = 'stop' | 'retry' | 'continue';

export interface IFormSubmitActionRequest {
  action: 'request';
  promptTemplate?: string;
  mockType?: MockMessageType;
  mockChartType?: MockChartType;
}

export interface IFormSubmitActionInsertMessage {
  action: 'insertMessage';
  message: IMessageItemDraft;
}

export interface IFormSubmitActionRequestAndInsert {
  action: 'requestAndInsert';
  promptTemplate?: string;
  mockType?: MockMessageType;
  mockChartType?: MockChartType;
  message: IMessageItemDraft;
}

export interface IFormSubmitActionCallApi {
  action: 'callApi';
  api: string;
  payload?: Record<string, unknown>;
  retryable?: boolean;
  errorMessages?: Record<string, string>;
  beforeRequest?: IFormSubmitActionHook[];
  afterSuccess?: IFormSubmitActionHook[];
  onSuccessMessage?: IMessageItemDraft;
  onErrorMessage?: IMessageItemDraft;
  successPromptTemplate?: string;
  mockType?: MockMessageType;
  mockChartType?: MockChartType;
}

export interface IFormSubmitActionHookInsertMessage {
  type: 'insertMessage';
  message: IMessageItemDraft;
}

export interface IFormSubmitActionHookRequest {
  type: 'request';
  promptTemplate: string;
  mockType?: MockMessageType;
  mockChartType?: MockChartType;
}

export interface IFormSubmitActionHookClearStructuredMessages {
  type: 'clearStructuredMessages';
}

export interface IFormSubmitActionHookTrackEvent {
  type: 'trackEvent';
  event: string;
  properties?: Record<string, unknown>;
}

export interface IFormSubmitActionHookRefreshConversation {
  type: 'refreshConversation';
}

export type IFormSubmitActionHook =
  | IFormSubmitActionHookInsertMessage
  | IFormSubmitActionHookRequest
  | IFormSubmitActionHookClearStructuredMessages
  | IFormSubmitActionHookTrackEvent
  | IFormSubmitActionHookRefreshConversation;

export type IFormSubmitAction =
  | IFormSubmitActionRequest
  | IFormSubmitActionInsertMessage
  | IFormSubmitActionRequestAndInsert
  | IFormSubmitActionCallApi;

export interface IMessageTableColumn {
  key?: string;
  title: string;
  dataIndex: string;
  width?: number | string;
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  valueType?: MessageTableValueType;
}

export interface ITextMessageContent {
  text: string;
}

export interface IFileMessageItem {
  key?: string;
  name: string;
  url: string;
  size?: string;
  mimeType?: string;
  description?: string;
  actions?: IMessageAction[];
}

export interface IFileMessageContent {
  title?: string;
  description?: string;
  files: IFileMessageItem[];
}

export interface IImageMessageItem {
  key?: string;
  title?: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  description?: string;
  actions?: IMessageAction[];
}

export interface IImageMessageContent {
  title?: string;
  description?: string;
  images: IImageMessageItem[];
}

export interface IAudioMessageItem {
  key?: string;
  title: string;
  url: string;
  duration?: string;
  transcript?: string;
  actions?: IMessageAction[];
}

export interface IAudioMessageContent {
  title?: string;
  description?: string;
  audios: IAudioMessageItem[];
}

export interface IVideoMessageContent {
  title?: string;
  description?: string;
  url: string;
  poster?: string;
  duration?: string;
  format?: string;
  actions?: IMessageAction[];
}

export interface ITableMessageContent {
  title?: string;
  description?: string;
  columns?: IMessageTableColumn[];
  dataSource: Record<string, unknown>[];
  rowKey?: string;
  pagination?: false | TablePaginationConfig;
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
}

export interface IChartMessageContent {
  title?: string;
  description?: string;
  type: MockChartType;
  data: Record<string, unknown>[] | Record<string, unknown>[][];
  xField?: string;
  yField?: string | string[];
  angleField?: string;
  colorField?: string;
  seriesField?: string;
  height?: number;
  config?: Record<string, unknown>;
}

export interface IMapMessageMarker {
  key?: string;
  title: string;
  longitude: number;
  latitude: number;
  description?: string;
  clickAction?: IMessageAction;
  values?: Record<string, unknown>;
}

export interface IMapMessageContent {
  title?: string;
  description?: string;
  center: [number, number];
  zoom?: number;
  markers?: IMapMessageMarker[];
  height?: number;
}

export interface IFormMessageContent {
  title?: string;
  description?: string;
  initialValues?: Record<string, unknown>;
  submitAction?: IFormSubmitAction;
}

export interface ITimelineMessageItem {
  key?: string;
  title: string;
  description?: string;
  time?: string;
  color?: 'blue' | 'red' | 'green' | 'gray';
  status?: TimelineItemStatus;
  tags?: string[];
}

export interface ITimelineMessageContent {
  title?: string;
  description?: string;
  items: ITimelineMessageItem[];
}

export interface IApprovalMessageField {
  key?: string;
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface IMessageAction {
  key?: string;
  label: string;
  buttonType?: MessageActionButtonType;
  danger?: boolean;
  submitAction: IFormSubmitAction;
  values?: Record<string, unknown>;
}

export type IApprovalMessageAction = IMessageAction;

export interface IApprovalMessageContent {
  title: string;
  description?: string;
  summary?: string;
  status?: ApprovalStatus;
  applicant?: string;
  approver?: string;
  tags?: string[];
  fields?: IApprovalMessageField[];
  actions?: IApprovalMessageAction[];
}

export interface IAgentExecutionStep {
  key?: string;
  title: string;
  description?: string;
  status: AgentExecutionStepStatus;
  startedAt?: string;
  finishedAt?: string;
  duration?: string;
  tags?: string[];
}

export interface IAgentExecutionControl {
  key: string;
  label: string;
  action: AgentExecutionControlAction;
  buttonType?: MessageActionButtonType;
  danger?: boolean;
  disabled?: boolean;
}

export interface IAgentExecutionMessageContent {
  title: string;
  description?: string;
  summary?: string;
  status: AgentExecutionStatus;
  startedAt?: string;
  updatedAt?: string;
  steps: IAgentExecutionStep[];
  controls?: IAgentExecutionControl[];
  pendingControlKey?: string;
  controlErrorMessage?: string;
}

export interface IAgentExecutionStepPatch {
  key: string;
  title?: string;
  description?: string;
  status?: IAgentExecutionStep['status'];
  startedAt?: string;
  finishedAt?: string;
  duration?: string;
  tags?: string[];
}

export interface IAgentExecutionMessagePatch {
  description?: string;
  summary?: string;
  status?: IAgentExecutionMessageContent['status'];
  startedAt?: string;
  updatedAt?: string;
  controls?: IAgentExecutionControl[];
  pendingControlKey?: string;
  clearPendingControl?: boolean;
  controlErrorMessage?: string;
  clearControlError?: boolean;
  replaceSteps?: IAgentExecutionStep[];
  appendSteps?: IAgentExecutionStep[];
  updateSteps?: IAgentExecutionStepPatch[];
}

export type IMessageContent =
  | ITextMessageContent
  | IFileMessageContent
  | IImageMessageContent
  | IAudioMessageContent
  | IVideoMessageContent
  | ITableMessageContent
  | IChartMessageContent
  | IFormMessageContent
  | IMapMessageContent
  | ITimelineMessageContent
  | IApprovalMessageContent
  | IAgentExecutionMessageContent;

export interface IMessageItem {
  id: string;
  role: MessageRole;
  type: MessageType | string;
  content: IMessageContent;
  schema?: MessageSchema;
}

export type IMessageItemDraft = Omit<IMessageItem, 'id'> & { id?: string };

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isMessageRole = (value: unknown): value is MessageRole =>
  value === 'assistant' || value === 'user' || value === 'system';

const isMessageType = (value: unknown): value is MessageType =>
  Object.values(MessageType).includes(value as MessageType);

const isValidMessageContent = (
  type: MessageType,
  content: unknown,
): boolean => {
  if (!isObjectRecord(content)) {
    return false;
  }

  if (type === MessageType.TEXT) {
    return typeof content.text === 'string';
  }

  if (type === MessageType.FILE) {
    return Array.isArray(content.files);
  }

  if (type === MessageType.IMAGE) {
    return Array.isArray(content.images);
  }

  if (type === MessageType.AUDIO) {
    return Array.isArray(content.audios);
  }

  if (type === MessageType.VIDEO) {
    return (
      typeof content.url === 'string' &&
      content.url.trim().length > 0 &&
      (content.poster === undefined || typeof content.poster === 'string') &&
      (content.title === undefined || typeof content.title === 'string') &&
      (content.duration === undefined ||
        typeof content.duration === 'string') &&
      (content.format === undefined || typeof content.format === 'string')
    );
  }

  if (type === MessageType.TABLE) {
    return Array.isArray(content.dataSource);
  }

  if (type === MessageType.CHART) {
    return (
      Array.isArray(content.data) &&
      (content.type === 'line' ||
        content.type === 'column' ||
        content.type === 'pie' ||
        content.type === 'area' ||
        content.type === 'bar' ||
        content.type === 'radar' ||
        content.type === 'dualAxes')
    );
  }

  if (type === MessageType.FORM) {
    return true;
  }

  if (type === MessageType.MAP) {
    return (
      Array.isArray(content.center) &&
      content.center.length === 2 &&
      typeof content.center[0] === 'number' &&
      typeof content.center[1] === 'number'
    );
  }

  if (type === MessageType.TIMELINE) {
    return Array.isArray(content.items);
  }

  if (type === MessageType.APPROVAL) {
    return typeof content.title === 'string';
  }

  if (type === MessageType.AGENT_EXECUTION) {
    return (
      typeof content.title === 'string' &&
      Array.isArray(content.steps) &&
      (content.status === 'running' ||
        content.status === 'success' ||
        content.status === 'error')
    );
  }

  return false;
};

export const createMessageItem = (
  message: IMessageItemDraft,
): IMessageItem => ({
  ...message,
  id: message.id ?? crypto.randomUUID(),
});

export interface ITemplateConditionalValue {
  $if: string;
  $then: unknown;
  $else?: unknown;
}

const isTemplateConditionalValue = (
  value: unknown,
): value is ITemplateConditionalValue =>
  isObjectRecord(value) && typeof value.$if === 'string' && '$then' in value;

const getTemplateValueByPath = (
  values: Record<string, unknown>,
  path: string,
): unknown =>
  path
    .split('.')
    .filter(Boolean)
    .reduce<unknown>(
      (current, key) =>
        isObjectRecord(current) || Array.isArray(current)
          ? (current as Record<string, unknown>)[key]
          : undefined,
      values,
    );

const evaluateTemplateCondition = (
  condition: string,
  values: Record<string, unknown>,
): boolean => {
  const normalized = condition.trim();

  if (!normalized) {
    return false;
  }

  if (normalized.startsWith('!')) {
    return !evaluateTemplateCondition(normalized.slice(1), values);
  }

  return Boolean(getTemplateValueByPath(values, normalized));
};

export const applyTemplateString = (
  template: string,
  values: Record<string, unknown>,
): string =>
  template.replace(/\{\{([\w.]+)\}\}/g, (_, key: string) => {
    const resolved = getTemplateValueByPath(values, key);

    return resolved === undefined || resolved === null ? '' : String(resolved);
  });

const shouldKeepResolvedValue = (value: unknown) => value !== undefined;

export const resolveTemplateValue = (
  value: unknown,
  values: Record<string, unknown>,
): unknown => {
  if (isTemplateConditionalValue(value)) {
    return evaluateTemplateCondition(value.$if, values)
      ? resolveTemplateValue(value.$then, values)
      : resolveTemplateValue(value.$else, values);
  }

  if (typeof value === 'string') {
    return applyTemplateString(value, values);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => resolveTemplateValue(item, values))
      .filter(shouldKeepResolvedValue);
  }

  if (isObjectRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, resolveTemplateValue(item, values)])
        .filter(([, item]) => shouldKeepResolvedValue(item)),
    );
  }

  return value;
};

export const resolveMessageTemplate = (
  message: IMessageItemDraft,
  values: Record<string, unknown>,
): IMessageItem =>
  createMessageItem(resolveTemplateValue(message, values) as IMessageItemDraft);

export const stringifyStructuredMessage = (
  message: IMessageItemDraft,
): string => JSON.stringify(createMessageItem(message), null, 2);

export const normalizeStructuredMessage = (
  value: unknown,
): IMessageItem | undefined => {
  if (!isObjectRecord(value)) {
    return undefined;
  }

  const role = value.role;
  const type = value.type;
  const content = value.content;
  const id = value.id;
  const schema = value.schema;

  if (
    !isMessageRole(role) ||
    !isMessageType(type) ||
    !isValidMessageContent(type, content)
  ) {
    return undefined;
  }

  return createMessageItem({
    id: typeof id === 'string' ? id : undefined,
    role,
    type,
    content: content as IMessageContent,
    schema: isObjectRecord(schema) ? schema : undefined,
  });
};

export const applyAgentExecutionMessagePatch = (
  message: IMessageItem,
  patch: IAgentExecutionMessagePatch,
): IMessageItem => {
  if (message.type !== MessageType.AGENT_EXECUTION) {
    return message;
  }

  const content = message.content as IAgentExecutionMessageContent;
  const stepPatchMap = new Map(
    (patch.updateSteps ?? []).map((stepPatch) => [stepPatch.key, stepPatch]),
  );
  const steps =
    patch.replaceSteps ??
    content.steps.map((step) => {
      const stepPatch = step.key ? stepPatchMap.get(step.key) : undefined;

      return stepPatch ? { ...step, ...stepPatch } : step;
    });
  const nextPendingControlKey = patch.clearPendingControl
    ? undefined
    : (patch.pendingControlKey ?? content.pendingControlKey);
  const nextControlErrorMessage = patch.clearControlError
    ? undefined
    : (patch.controlErrorMessage ?? content.controlErrorMessage);

  return {
    ...message,
    content: {
      ...content,
      description: patch.description ?? content.description,
      summary: patch.summary ?? content.summary,
      status: patch.status ?? content.status,
      startedAt: patch.startedAt ?? content.startedAt,
      updatedAt: patch.updatedAt ?? content.updatedAt,
      controls: patch.controls ?? content.controls,
      pendingControlKey: nextPendingControlKey,
      controlErrorMessage: nextControlErrorMessage,
      steps: [...steps, ...(patch.appendSteps ?? [])],
    },
  };
};

export type ParsedMessage =
  | { role: 'user'; content: string }
  | {
      role: 'assistant';
      content: string;
      thinkContent?: string;
      structuredMessage?: IMessageItem;
    };
