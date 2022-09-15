import React from 'react';
import { Button, ConfigProvider, Modal, Space } from 'antd';
import './App.css';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { LocaleStatus, TOGGLE_LOCALED } from './store/locale';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import zhTW from 'antd/es/locale/zh_TW';
import { FormattedMessage, IntlProvider } from 'react-intl'
import locales from './locales/index';
import { BrowserRouter } from 'react-router-dom';
import DynamicRouter from './routes';

function App() {
  const { locale } = useAppSelector(store => store.localesReducer);
  const dispatch =  useAppDispatch();
  console.log('app')
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
  }
  /**
   * 设置区域
   * @param locale 
   */
  const setLocales = (locale: LocaleStatus) => {
    dispatch(TOGGLE_LOCALED({
      locale,
    }));
  }

  return (
   <ConfigProvider locale={getLocale()}>
     <IntlProvider locale={locale.split('_')[0]} messages={locales[locale]}>
       <DynamicRouter />
      {/* <div>
        <FormattedMessage 
          id="app.welcome"
        />
        <FormattedMessage 
          id="app.date"
          values={{ts: Date.now()}}
        />
        <div>
          <Space>
            <Button onClick={() => setLocales(LocaleStatus.US_EN)}>
              english
            </Button>
            <Button onClick={() => setLocales(LocaleStatus.ZH_TW)}>
              繁體中文
            </Button>
            <Button onClick={() => setLocales(LocaleStatus.ZH_CN)}>
              简体中文
            </Button>
          </Space>
        </div>
      </div> */}
      {/* <BrowserRouter> */}
        
      {/* </BrowserRouter> */}
     </IntlProvider>
   </ConfigProvider>
  );
}

export default App;
