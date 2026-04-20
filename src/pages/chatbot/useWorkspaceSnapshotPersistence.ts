import { useEffect } from 'react';

import type {
  ChatbotWorkspaceSnapshot,
  PersistedParsedChatRecord,
} from './chatPersistence';
import { saveChatbotWorkspaceSnapshot } from './chatPersistence';
import type { StructuredMessageMap } from './components/schema/structuredMessageStore';
import type { ConversationItem } from './data';
import type { MockChartType, MockMessageType } from './service';

interface UseWorkspaceSnapshotPersistenceOptions {
  activeKey: string;
  bootstrappedConversationKeys: Record<string, true>;
  chatMessageMap: Record<string, PersistedParsedChatRecord[]>;
  conversations: ConversationItem[];
  mockChartType: MockChartType;
  mockType: MockMessageType;
  structuredMessageMap: StructuredMessageMap;
}

export const useWorkspaceSnapshotPersistence = ({
  activeKey,
  bootstrappedConversationKeys,
  chatMessageMap,
  conversations,
  mockChartType,
  mockType,
  structuredMessageMap,
}: UseWorkspaceSnapshotPersistenceOptions) => {
  useEffect(() => {
    const snapshot: ChatbotWorkspaceSnapshot = {
      version: 1,
      conversations,
      activeKey,
      bootstrappedConversationKeys,
      chatMessageMap,
      structuredMessageMap,
      mockType,
      mockChartType,
    };

    saveChatbotWorkspaceSnapshot(snapshot);
  }, [
    activeKey,
    bootstrappedConversationKeys,
    chatMessageMap,
    conversations,
    mockChartType,
    mockType,
    structuredMessageMap,
  ]);
};
