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
  `,

  footer: css`
    padding: ${token.paddingMD}px;
    border-top: 1px solid ${token.colorBorderSecondary};
    display: flex;
    flex-direction: column;
    gap: ${token.paddingSM}px;
    justify-content: center;
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
    max-width: 940px;
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
    max-width: 940px;
    padding: ${token.paddingXS}px ${token.paddingSM}px;
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    background: ${token.colorFillQuaternary};
  `,

  debugPanel: css`
    width: 100%;
    max-width: 940px;
  `,
}));
