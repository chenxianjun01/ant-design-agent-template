import { Card, Space, Tag, Typography } from 'antd';
import React, { memo } from 'react';

import type { IVideoMessageContent } from '../../data';
import type { MessageComponentProps } from './types';
import {
  MessageActionAlert,
  MessageActionBar,
  useMessageActionExecution,
} from './useMessageActionExecution';

const toVideoMimeType = (format?: string) => {
  const normalized = format?.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  return normalized.startsWith('video/') ? normalized : `video/${normalized}`;
};

const VideoMessage: React.FC<MessageComponentProps> = ({
  message,
  onFormSubmit,
}) => {
  const content = message.content as IVideoMessageContent;
  const { submittingKey, submitError, retryable, executeAction } =
    useMessageActionExecution({ message, onFormSubmit });
  const sourceType = toVideoMimeType(content.format);

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

      <Card size="small" bodyStyle={{ padding: 12 }}>
        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          <video
            controls
            playsInline
            preload="metadata"
            poster={content.poster}
            style={{
              width: '100%',
              maxHeight: 360,
              borderRadius: 12,
              background: '#000',
            }}
          >
            <source src={content.url} type={sourceType} />
            <track
              kind="captions"
              src="data:text/vtt;charset=utf-8,WEBVTT%0A%0A"
              srcLang="zh-CN"
              label="中文字幕"
              default
            />
            您的浏览器暂不支持视频播放。
          </video>
          <Space size={[8, 8]} wrap>
            {content.duration && <Tag>{content.duration}</Tag>}
            {content.format && <Tag>{content.format}</Tag>}
          </Space>
          <MessageActionBar
            actions={content.actions}
            baseValues={{
              videoTitle: content.title ?? '',
              videoUrl: content.url,
              poster: content.poster ?? '',
              duration: content.duration ?? '',
              format: content.format ?? '',
            }}
            executeAction={executeAction}
            retryable={retryable}
            submittingKey={submittingKey}
          />
        </Space>
      </Card>
    </Space>
  );
};

export default memo(VideoMessage);
