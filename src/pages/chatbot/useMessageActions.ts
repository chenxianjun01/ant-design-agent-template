import { message } from 'antd';
import { useCallback } from 'react';

export const copyTextToClipboard = async (content: string): Promise<void> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content);
    return;
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard is unavailable.');
  }

  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand('copy');
    if (!copied) {
      throw new Error('Copy command failed.');
    }
  } finally {
    document.body.removeChild(textarea);
  }
};

export const useMessageActions = () => {
  const handleCopy = useCallback(async (content: string) => {
    if (!content) {
      return;
    }

    await copyTextToClipboard(content);
    message.success('已复制到剪切板');
  }, []);

  return { handleCopy };
};
