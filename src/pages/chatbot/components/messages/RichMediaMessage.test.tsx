import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { MessageType } from '../../data';
import AudioMessage from './AudioMessage';
import FileMessage from './FileMessage';
import ImageMessage from './ImageMessage';
import MapMessage from './MapMessage';
import VideoMessage from './VideoMessage';

describe('rich media messages', () => {
  it('renders file message content', () => {
    render(
      React.createElement(FileMessage, {
        message: {
          id: 'file-1',
          role: 'assistant',
          type: MessageType.FILE,
          content: {
            title: '交付文件',
            files: [
              {
                name: 'spec.pdf',
                url: 'https://example.com/spec.pdf',
                size: '1 MB',
                mimeType: 'application/pdf',
                actions: [
                  {
                    label: '记录下载回执',
                    submitAction: {
                      action: 'insertMessage',
                      message: {
                        role: 'assistant',
                        type: 'text',
                        content: { text: 'done' },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('交付文件')).toBeTruthy();
    expect(screen.getByText('spec.pdf')).toBeTruthy();
    expect(screen.getByText('1 MB')).toBeTruthy();
    expect(screen.getByRole('button', { name: '记录下载回执' })).toBeTruthy();
  });

  it('renders image message content', () => {
    render(
      React.createElement(ImageMessage, {
        message: {
          id: 'image-1',
          role: 'assistant',
          type: MessageType.IMAGE,
          content: {
            title: '图片集',
            images: [
              {
                title: '主图',
                url: 'https://example.com/image.png',
                alt: 'main-image',
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('图片集')).toBeTruthy();
    expect(screen.getByText('主图')).toBeTruthy();
    expect(screen.getByAltText('main-image')).toBeTruthy();
  });

  it('renders audio message content', () => {
    render(
      React.createElement(AudioMessage, {
        message: {
          id: 'audio-1',
          role: 'assistant',
          type: MessageType.AUDIO,
          content: {
            title: '播报',
            audios: [
              {
                title: '今日摘要',
                url: 'https://example.com/audio.mp3',
                duration: '00:10',
                transcript: '这是一段转写内容。',
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('播报')).toBeTruthy();
    expect(screen.getByText('今日摘要')).toBeTruthy();
    expect(screen.getByText('00:10')).toBeTruthy();
    expect(screen.getByText('这是一段转写内容。')).toBeTruthy();
  });

  it('renders video message content with inline player', () => {
    const onFormSubmit = jest.fn().mockResolvedValue({ status: 'success' });

    const { container } = render(
      React.createElement(VideoMessage, {
        onFormSubmit,
        message: {
          id: 'video-1',
          role: 'assistant',
          type: MessageType.VIDEO,
          content: {
            title: '产品演示视频',
            description: '用于验证视频消息在气泡内直接播放。',
            url: 'https://example.com/demo.mp4',
            poster: 'https://example.com/demo-poster.png',
            duration: '00:45',
            format: 'mp4',
            actions: [
              {
                label: '生成视频摘要',
                submitAction: {
                  action: 'request',
                  promptTemplate: '总结 {{videoTitle}}',
                  mockType: 'text',
                },
              },
            ],
          },
        },
      } as any),
    );

    const video = container.querySelector('video');
    const source = container.querySelector('source');

    expect(screen.getByText('产品演示视频')).toBeTruthy();
    expect(screen.getByText('用于验证视频消息在气泡内直接播放。')).toBeTruthy();
    expect(screen.getByText('00:45')).toBeTruthy();
    expect(screen.getByText('mp4')).toBeTruthy();
    expect(screen.getByRole('button', { name: '生成视频摘要' })).toBeTruthy();
    expect(video?.getAttribute('poster')).toBe(
      'https://example.com/demo-poster.png',
    );
    expect(video?.hasAttribute('controls')).toBe(true);
    expect(source?.getAttribute('src')).toBe('https://example.com/demo.mp4');
    expect(source?.getAttribute('type')).toBe('video/mp4');
  });

  it('renders map message summary content', () => {
    const onFormSubmit = jest.fn().mockResolvedValue({ status: 'success' });

    render(
      React.createElement(MapMessage, {
        onFormSubmit,
        message: {
          id: 'map-1',
          role: 'assistant',
          type: MessageType.MAP,
          content: {
            title: '地图点位',
            center: [121.47, 31.23],
            markers: [
              {
                title: '上海办公室',
                longitude: 121.47,
                latitude: 31.23,
                clickAction: {
                  label: '查看点位详情',
                  submitAction: {
                    action: 'request',
                    promptTemplate: '查看 {{markerTitle}}',
                    mockType: 'text',
                  },
                },
              },
            ],
          },
        },
      } as any),
    );

    expect(screen.getByText('地图点位')).toBeTruthy();
    expect(screen.getByText(/标记点：上海办公室/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '上海办公室' }));

    return waitFor(() => {
      expect(onFormSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.MAP,
        }),
        expect.objectContaining({
          markerTitle: '上海办公室',
          longitude: 121.47,
          latitude: 31.23,
        }),
      );
    });
  });
});
