import { Layout } from 'antd';
import RouteView from './routeView';
import IMenu from './menu';
import HeaderComponent from './header';

import './style.less';
import ErrorBoundary from './ErrorBoundary';
import { useRef } from 'react';

const { Header, Content, Sider, Footer } = Layout;

export default function BaseLayout() {
  const ref = useRef<ErrorBoundary>(null);
  const onMenuChangeHandle = () => {
    ref.current?.resetError();
  };
  return (
    <div className="layout-container">
      <Layout>
        <Header className="header">
          <HeaderComponent />
        </Header>
        <Layout className="content-layout">
          <Sider collapsible>
            <IMenu onChange={onMenuChangeHandle} />
          </Sider>
          <Layout>
            <Content>
              <div className="layout-page-container">
                <ErrorBoundary ref={ref}>
                  <RouteView />
                </ErrorBoundary>
              </div>
            </Content>
            <Footer>foofter</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
