// src/pages/chatbot/style.ts
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  layout: css`
    display: flex;
    flex: 1;
    overflow: hidden;

    @media (max-width: 960px) {
      flex-direction: column;
    }
  `,

  sidebar: css`
    width: 260px;
    background: ${token.colorBgContainer};
    border-right: 1px solid ${token.colorBorderSecondary};
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 960px) {
      width: 100%;
      max-height: 240px;
      border-right: none;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    }
  `,

  main: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
    background: ${token.colorBgContainer};
  `,

  messages: css`
    flex: 1;
    overflow-y: auto;
    padding: ${token.paddingMD}px;
    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
      width: 100%;
    }

    .ant-bubble-start:not(.ant-bubble-divider):not(.ant-bubble-system) {
      padding-inline-end: 52px;
    }

    .ant-bubble-end:not(.ant-bubble-divider):not(.ant-bubble-system) {
      padding-inline-start: 52px;
    }

    .ant-bubble-start .ant-bubble-body {
      width: min(780px, 72%);
    }

    .ant-bubble-start .ant-bubble-content {
      width: 100%;
    }

    .chatbot-stream-cursor {
      display: inline-block;
      margin-inline-start: 2px;
      color: ${token.colorPrimary};
      animation: chatbot-blink 0.8s step-end infinite;
    }

    @media (max-width: 960px) {
      .ant-bubble-start:not(.ant-bubble-divider):not(.ant-bubble-system),
      .ant-bubble-end:not(.ant-bubble-divider):not(.ant-bubble-system) {
        padding-inline: 0;
      }

      .ant-bubble-start .ant-bubble-body {
        width: calc(100% - 48px);
      }
    }
  `,

  footer: css`
    padding: ${token.paddingMD}px;
    border-top: 1px solid ${token.colorBorderSecondary};
    display: flex;
    flex-direction: column;
    gap: ${token.paddingSM}px;
    justify-content: center;
  `,

  chatSender: css`
    min-height: 140px;
    padding: 16px 24px 14px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: 32px;
    background: ${token.colorBgContainer};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
    transition: all 0.3s;

    &:hover,
    &:focus-within {
      border-color: ${token.colorBorder};
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }

    .ant-sender-content {
      min-height: 80px;
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-rows: 1fr 32px;
      align-items: end;
      gap: 0 12px;
    }

    .ant-sender-input {
      grid-column: 1 / 3;
      grid-row: 1;
      align-self: start;
      padding: 0;
      color: ${token.colorText};
      font-size: 16px;
      line-height: 1.6;
    }

    .ant-sender-input::placeholder {
      color: ${token.colorTextQuaternary};
      font-size: 16px;
    }

    .ant-sender-actions-list {
      grid-column: 2;
      grid-row: 2;
      align-self: end;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .ant-sender-actions-btn {
      width: 28px;
      height: 28px;
      min-width: 28px;
      flex-shrink: 0;
      border-radius: 50%;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      aspect-ratio: 1 / 1;
      margin-right: 6px;
    }

    .ant-sender-actions-btn:last-child {
      background: #000;
      color: #fff;
      border: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .ant-sender-actions-btn:last-child:hover {
      background: #222;
      transform: scale(1.05);
    }

    @media (max-width: 720px) {
      min-height: 120px;
      padding: 12px 16px;
      border-radius: 24px;

      .ant-sender-input,
      .ant-sender-input::placeholder {
        font-size: 15px;
      }

      .ant-sender-actions-btn {
        width: 36px;
        height: 36px;
        min-width: 36px;
      }
    }
  `,

  footerCenter: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${token.paddingLG}px;
    gap: 24px;
  `,

  emptyState: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${token.paddingLG}px;
  `,

  welcomeTitle: css`
    font-size: 32px;
    font-weight: 600;
    color: ${token.colorText};
    text-align: center;
  `,

  welcomeDescription: css`
    max-width: 720px;
    margin-bottom: 0;
    text-align: center;
    font-size: 15px;
  `,

  cursor: css`
    animation: chatbot-blink 0.8s step-end infinite;

    @keyframes chatbot-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  `,

  mockToolbarCompact: css`
    width: 100%;
    padding: ${token.paddingXS}px ${token.paddingSM}px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorFillQuaternary};
  `,

  debugPanel: css`
    width: 100%;
  `,
}));
