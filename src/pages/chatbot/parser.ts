import {
  type IMessageItem,
  normalizeStructuredMessage,
  type ParsedMessage,
} from './data';

const tryParseStructuredMessage = (
  rawContent: string,
): IMessageItem | undefined => {
  const trimmed = rawContent.trim();
  const candidates = [trimmed];
  const fencedJsonMatch = trimmed.match(/^```json\s*([\s\S]*?)\s*```$/i);

  if (fencedJsonMatch?.[1]) {
    candidates.unshift(fencedJsonMatch[1].trim());
  }

  for (const candidate of candidates) {
    if (!candidate.startsWith('{')) {
      continue;
    }

    try {
      const parsed = JSON.parse(candidate);
      const normalized = normalizeStructuredMessage(parsed);
      if (normalized) {
        return normalized;
      }
    } catch {}
  }

  return undefined;
};

export const parseChatMessage = (message: {
  content: string;
  role: string;
}): ParsedMessage => {
  const { content, role } = message;
  if (role !== 'assistant') return { role: 'user', content };

  const trimmed = content.trimStart();

  const fullMatch = trimmed.match(/^<think>([\s\S]*?)<\/think>([\s\S]*)$/);
  if (fullMatch) {
    const assistantContent = fullMatch[2].trimStart();
    return {
      role: 'assistant',
      thinkContent: fullMatch[1],
      content: assistantContent,
      structuredMessage: tryParseStructuredMessage(assistantContent),
    };
  }

  const partialMatch = trimmed.match(/^<think>([\s\S]*)$/);
  if (partialMatch) {
    return { role: 'assistant', thinkContent: partialMatch[1], content: '' };
  }

  return {
    role: 'assistant',
    content,
    structuredMessage: tryParseStructuredMessage(content),
  };
};
