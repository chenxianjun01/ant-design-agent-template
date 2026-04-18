import { Think } from '@ant-design/x';
import type { BubbleItemType } from '@ant-design/x/es/bubble/interface';
import React from 'react';

import MessageRenderer from './components/MessageRenderer';
import type { FormSubmitExecutionResult } from './components/schema/formSubmitAction';
import type { IMessageItem, ParsedMessage } from './data';

interface ParsedChatRecord {
  id: string | number;
  status?: BubbleItemType['status'];
  message: ParsedMessage;
}

interface BuildBubbleItemsOptions {
  activeKey: string;
  parsedMessages: ParsedChatRecord[];
  structuredMessages: IMessageItem[];
  onFormSubmit: (
    submittedMessage: IMessageItem,
    values: Record<string, unknown>,
  ) => void | Promise<FormSubmitExecutionResult>;
}

export const buildBubbleItems = ({
  activeKey,
  parsedMessages,
  structuredMessages,
  onFormSubmit,
}: BuildBubbleItemsOptions): BubbleItemType[] =>
  [
    ...parsedMessages.map((msg) => ({ kind: 'chat' as const, msg })),
    ...structuredMessages.map((message, index) => ({
      kind: 'local-structured' as const,
      message,
      key: `local-structured_${activeKey}_${index}`,
    })),
  ].map((entry) => {
    if (entry.kind === 'local-structured') {
      return {
        key: entry.key,
        role: 'ai',
        content: (
          <MessageRenderer
            message={entry.message}
            onFormSubmit={onFormSubmit}
          />
        ),
        status: 'success',
      } satisfies BubbleItemType;
    }

    const msg = entry.msg;
    const parsed = msg.message;
    const isAI = parsed.role === 'assistant';
    const thinkContent =
      parsed.role === 'assistant' ? parsed.thinkContent : undefined;
    const structuredMessage =
      parsed.role === 'assistant' ? parsed.structuredMessage : undefined;
    const isStructuredReady =
      isAI &&
      structuredMessage &&
      msg.status !== 'loading' &&
      msg.status !== 'updating';

    const item: BubbleItemType = {
      key: String(msg.id),
      role: isAI ? 'ai' : 'user',
      content: isStructuredReady ? (
        <MessageRenderer
          message={structuredMessage}
          onFormSubmit={onFormSubmit}
        />
      ) : (
        parsed.content
      ),
      loading: isAI && msg.status === 'loading',
      status: msg.status,
    };

    if (isAI && thinkContent) {
      item.header = <Think>{thinkContent}</Think>;
    }

    return item;
  });
