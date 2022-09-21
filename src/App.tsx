import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import zhTW from 'antd/es/locale/zh_TW';
import { useAppSelector } from './store/hooks';
import { LocaleStatus } from './store/locale';
import locales from './locales/index';
import DynamicRouter from './routes';

import './App.css';

function App() {
  const { locale } = useAppSelector(store => store.localesReducer);
  /**
   * 获取地区语言配置
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

  return (
    <ConfigProvider locale={getLocale()}>
      <IntlProvider locale={locale.split('_')[0]} messages={locales[locale]}>
        <DynamicRouter />
      </IntlProvider>
    </ConfigProvider>
  );
}

export default App;
