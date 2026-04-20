import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import React from 'react';
import {
  AvatarDropdown,
  AvatarName,
  Footer,
  Question,
  SelectLang,
} from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const isDev = process.env.NODE_ENV === 'development';
const isDevOrTest = isDev || process.env.CI;
const loginPath = '/user/login';

/** 与 `src/locales` 下目录一致；浏览器语言需归一化到此集合，否则会触发 umi 的 locale 警告 */
const SUPPORTED_UMI_LOCALES = new Set([
  'bn-BD',
  'en-US',
  'fa-IR',
  'id-ID',
  'ja-JP',
  'pt-BR',
  'zh-CN',
  'zh-TW',
]);

const DEFAULT_UMI_LOCALE = 'zh-CN';

function normalizeUmiLocale(raw: string): string {
  if (!raw) return DEFAULT_UMI_LOCALE;
  const key = raw.replace(/_/g, '-');
  if (SUPPORTED_UMI_LOCALES.has(key)) return key;
  const lower = key.toLowerCase();
  if (lower.startsWith('zh')) {
    if (
      lower.includes('tw') ||
      lower.includes('hk') ||
      lower.includes('mo') ||
      lower.includes('hant')
    ) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  if (lower.startsWith('en')) return 'en-US';
  if (lower.startsWith('pt')) return 'pt-BR';
  if (lower.startsWith('ja')) return 'ja-JP';
  if (lower.startsWith('id')) return 'id-ID';
  if (lower.startsWith('fa')) return 'fa-IR';
  if (lower.startsWith('bn')) return 'bn-BD';
  return DEFAULT_UMI_LOCALE;
}

/**
 * 覆盖 umi 默认 getLocale：避免 `navigator.language` / localStorage 为 `en` 等与目录名不一致时控制台报错。
 * @see https://umijs.org/docs/max/i18n#运行时配置
 */
export const locale = {
  getLocale: (): string => {
    if (typeof window === 'undefined') return DEFAULT_UMI_LOCALE;
    let fromStorage = '';
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.cookieEnabled &&
        window.localStorage
      ) {
        fromStorage = window.localStorage.getItem('umi_locale') || '';
      }
    } catch {
      // ignore
    }
    const browserLang =
      typeof navigator !== 'undefined' && typeof navigator.language === 'string'
        ? navigator.language.split('-').join('-')
        : '';
    const raw = fromStorage || browserLang || DEFAULT_UMI_LOCALE;
    return normalizeUmiLocale(raw);
  },
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (_error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (
    ![loginPath, '/user/register', '/user/register-result'].includes(
      location.pathname,
    )
  ) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    actionsRender: () => [
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    menuItemRender: (item, dom) => {
      if (item.path) {
        return (
          <Link to={item.path} prefetch>
            {dom}
          </Link>
        );
      }
      return dom;
    },
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDevOrTest && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: isDev ? '' : 'https://pro-api.ant-design-demo.workers.dev',
  ...errorConfig,
};
