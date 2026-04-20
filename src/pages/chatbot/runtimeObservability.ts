export type RuntimeEventLevel = 'info' | 'success' | 'warning' | 'error';

export type RuntimeEventType =
  | 'chat.request'
  | 'stream.message'
  | 'stream.batch'
  | 'patch.apply'
  | 'control.request'
  | 'control.result'
  | 'runtime.error';

export interface RuntimeEventRecord {
  id: string;
  timestamp: string;
  conversationKey: string;
  type: RuntimeEventType;
  level: RuntimeEventLevel;
  summary: string;
  messageId?: string;
  details?: Record<string, unknown>;
}

export type RuntimeEventMap = Record<string, RuntimeEventRecord[]>;

const DEFAULT_EVENT_LIMIT = 80;

export const getRuntimeEventsByConversation = (
  eventMap: RuntimeEventMap,
  conversationKey: string,
): RuntimeEventRecord[] => eventMap[conversationKey] ?? [];

export const appendRuntimeEvent = (
  eventMap: RuntimeEventMap,
  conversationKey: string,
  event: Omit<RuntimeEventRecord, 'id' | 'conversationKey' | 'timestamp'> & {
    id?: string;
    timestamp?: string;
  },
  limit = DEFAULT_EVENT_LIMIT,
): RuntimeEventMap => {
  const nextRecord: RuntimeEventRecord = {
    id: event.id ?? crypto.randomUUID(),
    timestamp: event.timestamp ?? new Date().toISOString(),
    conversationKey,
    type: event.type,
    level: event.level,
    summary: event.summary,
    messageId: event.messageId,
    details: event.details,
  };

  const nextEvents = [
    ...getRuntimeEventsByConversation(eventMap, conversationKey),
    nextRecord,
  ].slice(-limit);

  return {
    ...eventMap,
    [conversationKey]: nextEvents,
  };
};
