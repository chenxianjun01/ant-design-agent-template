import { useEffect } from 'react';

import type { ConversationItem } from './data';
import type { MockChartType, MockMessageType } from './service';
import { isMockChartType, isMockMessageType } from './service';

interface UseStarterPromptBootstrapOptions {
  activeKey: string;
  bootstrappedConversationKeys: Record<string, true>;
  conversations: ConversationItem[];
  displayedParsedMessagesLength: number;
  isRequesting: boolean;
  mockType: MockMessageType;
  sendMessage: (
    content: string,
    options?: {
      mockType?: MockMessageType;
      mockChartType?: MockChartType;
    },
  ) => void;
  setBootstrappedConversationKeys: React.Dispatch<
    React.SetStateAction<Record<string, true>>
  >;
  structuredMessagesLength: number;
}

export const useStarterPromptBootstrap = ({
  activeKey,
  bootstrappedConversationKeys,
  conversations,
  displayedParsedMessagesLength,
  isRequesting,
  mockType,
  sendMessage,
  setBootstrappedConversationKeys,
  structuredMessagesLength,
}: UseStarterPromptBootstrapOptions) => {
  useEffect(() => {
    const activeConversation = conversations.find(
      (conversation) => conversation.key === activeKey,
    );

    if (
      !activeConversation?.starterPrompt ||
      bootstrappedConversationKeys[activeKey] ||
      displayedParsedMessagesLength > 0 ||
      structuredMessagesLength > 0 ||
      isRequesting
    ) {
      return;
    }

    setBootstrappedConversationKeys((previous) => ({
      ...previous,
      [activeKey]: true,
    }));

    sendMessage(activeConversation.starterPrompt, {
      mockType: isMockMessageType(activeConversation.starterMockType)
        ? activeConversation.starterMockType
        : mockType,
      mockChartType:
        activeConversation.starterMockType === 'chart' &&
        isMockChartType(activeConversation.starterMockChartType)
          ? activeConversation.starterMockChartType
          : undefined,
    });
  }, [
    activeKey,
    bootstrappedConversationKeys,
    conversations,
    displayedParsedMessagesLength,
    isRequesting,
    mockType,
    sendMessage,
    setBootstrappedConversationKeys,
    structuredMessagesLength,
  ]);
};
