import { useEffect, useState } from 'react';

import type { PersistedParsedChatRecord } from './chatPersistence';

interface UseChatMessagePersistenceOptions {
  activeKey: string;
  initialChatMessageMap?: Record<string, PersistedParsedChatRecord[]>;
  parsedMessages: PersistedParsedChatRecord[];
}

export const useChatMessagePersistence = ({
  activeKey,
  initialChatMessageMap,
  parsedMessages,
}: UseChatMessagePersistenceOptions) => {
  const [chatMessageMap, setChatMessageMap] = useState<
    Record<string, PersistedParsedChatRecord[]>
  >(initialChatMessageMap ?? {});

  useEffect(() => {
    if (parsedMessages.length === 0) {
      return;
    }

    setChatMessageMap((previous) => ({
      ...previous,
      [activeKey]: parsedMessages,
    }));
  }, [activeKey, parsedMessages]);

  return {
    chatMessageMap,
    setChatMessageMap,
  };
};
