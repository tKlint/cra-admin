import { ConfigProvider, Modal } from 'antd';
import { IntlProvider } from 'react-intl';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import zhTW from 'antd/es/locale/zh_TW';
import { useAppSelector } from './store/hooks';
import { LocaleStatus } from './store/locale';
import locales from './locales/index';
import DynamicRouter from './routes';
import { useEffect } from 'react';
import { getThemesConfig } from './utils/getUserConfig';

import './App.less';
import './App.css';
import { useVersionUpdater } from './utils/versionUpdater';

function App() {
  const { locale } = useAppSelector(store => store.localesReducer);
  const updater = useVersionUpdater(process.env.PUBLIC_URL);
  /**
   * 获取地区语  言 配置
   * @returns Locale
   */
  const getLocale = () => {
    switch (locale) {
      case LocaleStatus.US_EN:
        return enUS;
      case LocaleStatus.ZH_CN:
        return zhCN;
      case LocaleStatus.ZH_TW:
        return zhTW;
      default:
        return zhCN;
    }
  };

  const initAppThemeConfig = () => {
    ConfigProvider.config({
      theme: {
        // primaryColor: process.env.THEME_PRIMARY_COLOR,
        ...getThemesConfig()
        // infoColor: '#be8f8fd9',
        // successColor: '#be8f8fd9',
        // processingColor: '#be8f8fd9',
        // errorColor: '#be8f8fd9',
        // warningColor: '#be8f8fd9'
      }
    });
  };
  /**
   * 版本更新回调
   */
  const onVersionUpdate = () => {
    Modal.warn({
      title: '提示',
      content: '监测到有新的版本, 请刷新页面!',
      onOk() {
        location.reload();
      },
      afterClose() {
        updater.current?.stop();
      }
    });
  };
  const initVersionWatcher = () => {
    // 只针对生产环境做版本监听
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    updater.current?.on('update', onVersionUpdate);
    updater.current?.on('no-update', () => {
      console.log('未检测到新版本');
    });
    updater.current?.start();
  };
  useEffect(() => {
    initAppThemeConfig();
    initVersionWatcher();
    return () => {
      updater.current?.stop();
    };
  }, []);

  return (
    <ConfigProvider locale={getLocale()}>
      <IntlProvider locale={locale.split('_')[0]} messages={locales[locale]}>
        <DynamicRouter />
      </IntlProvider>
    </ConfigProvider>
  );
}

export default App;
