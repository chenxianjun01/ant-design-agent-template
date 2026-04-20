import type { StructuredMessageMap } from './components/schema/structuredMessageStore';
import type { ConversationItem, ParsedMessage } from './data';
import type { MockChartType, MockMessageType } from './service';

export const CHATBOT_WORKSPACE_STORAGE_KEY = 'chatbot.workspace.v1';

export interface PersistedParsedChatRecord {
  id: string | number;
  status?: 'local' | 'success' | 'loading' | 'error' | 'abort' | 'updating';
  message: ParsedMessage;
}

export interface ChatbotWorkspaceSnapshot {
  version: 1;
  conversations: ConversationItem[];
  activeKey: string;
  bootstrappedConversationKeys: Record<string, true>;
  chatMessageMap: Record<string, PersistedParsedChatRecord[]>;
  structuredMessageMap: StructuredMessageMap;
  mockType: MockMessageType;
  mockChartType: MockChartType;
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isConversationList = (value: unknown): value is ConversationItem[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isObjectRecord(item) &&
      typeof item.key === 'string' &&
      typeof item.label === 'string',
  );

const isParsedMessage = (value: unknown): value is ParsedMessage =>
  isObjectRecord(value) &&
  typeof value.role === 'string' &&
  typeof value.content === 'string';

const isParsedChatRecordList = (
  value: unknown,
): value is PersistedParsedChatRecord[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isObjectRecord(item) &&
      (typeof item.id === 'string' || typeof item.id === 'number') &&
      isParsedMessage(item.message),
  );

const isStringKeyRecord = <T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T,
): value is Record<string, T> =>
  isObjectRecord(value) &&
  Object.values(value).every((item) => itemGuard(item));

export const loadChatbotWorkspaceSnapshot = ():
  | ChatbotWorkspaceSnapshot
  | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const rawValue = window.localStorage.getItem(CHATBOT_WORKSPACE_STORAGE_KEY);

    if (!rawValue) {
      return undefined;
    }

    const parsed = JSON.parse(rawValue);

    if (
      !isObjectRecord(parsed) ||
      parsed.version !== 1 ||
      !isConversationList(parsed.conversations) ||
      typeof parsed.activeKey !== 'string' ||
      !isObjectRecord(parsed.bootstrappedConversationKeys) ||
      !isStringKeyRecord(parsed.chatMessageMap, isParsedChatRecordList) ||
      !isObjectRecord(parsed.structuredMessageMap) ||
      typeof parsed.mockType !== 'string' ||
      typeof parsed.mockChartType !== 'string'
    ) {
      return undefined;
    }

    return {
      version: 1,
      conversations: parsed.conversations,
      activeKey: parsed.activeKey,
      bootstrappedConversationKeys:
        parsed.bootstrappedConversationKeys as Record<string, true>,
      chatMessageMap: parsed.chatMessageMap,
      structuredMessageMap: parsed.structuredMessageMap as StructuredMessageMap,
      mockType: parsed.mockType as MockMessageType,
      mockChartType: parsed.mockChartType as MockChartType,
    };
  } catch {
    return undefined;
  }
};

export const saveChatbotWorkspaceSnapshot = (
  snapshot: ChatbotWorkspaceSnapshot,
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    CHATBOT_WORKSPACE_STORAGE_KEY,
    JSON.stringify(snapshot),
  );
};
