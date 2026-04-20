import { Card, Empty, Space, Tag, Typography } from 'antd';
import React, { memo } from 'react';

import type { IAudioMessageContent } from '../../data';
import type { MessageComponentProps } from './types';
import {
  MessageActionAlert,
  MessageActionBar,
  useMessageActionExecution,
} from './useMessageActionExecution';

const AudioMessage: React.FC<MessageComponentProps> = ({
  message,
  onFormSubmit,
}) => {
  const content = message.content as IAudioMessageContent;
  const { submittingKey, submitError, retryable, executeAction } =
    useMessageActionExecution({ message, onFormSubmit });

  return (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <MessageActionAlert error={submitError} />
      {(content.title || content.description) && (
        <div>
          {content.title && (
            <Typography.Title level={5} style={{ marginBottom: 4 }}>
              {content.title}
            </Typography.Title>
          )}
          {content.description && (
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              {content.description}
            </Typography.Paragraph>
          )}
        </div>
      )}

      {content.audios.length > 0 ? (
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          {content.audios.map((audio, index) => (
            <Card key={audio.key ?? `${index}-${audio.url}`} size="small">
              <Space orientation="vertical" size={8} style={{ width: '100%' }}>
                <Space size={[4, 4]} wrap>
                  <Typography.Text strong>{audio.title}</Typography.Text>
                  {audio.duration && <Tag>{audio.duration}</Tag>}
                </Space>
                <audio controls style={{ width: '100%' }} src={audio.url}>
                  <track kind="captions" />
                </audio>
                {audio.transcript && (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {audio.transcript}
                  </Typography.Paragraph>
                )}
                <MessageActionBar
                  actions={audio.actions}
                  baseValues={{
                    audioTitle: audio.title,
                    audioUrl: audio.url,
                    duration: audio.duration ?? '',
                    transcript: audio.transcript ?? '',
                  }}
                  executeAction={executeAction}
                  retryable={retryable}
                  submittingKey={submittingKey}
                />
              </Space>
            </Card>
          ))}
        </Space>
      ) : (
        <Empty description="暂无音频数据" />
      )}
    </Space>
  );
};

export default memo(AudioMessage);
