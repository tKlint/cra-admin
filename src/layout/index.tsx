import React from 'react';
import { Layout } from 'antd'
import { useLocation } from 'react-router-dom';

import './style.less'
import RouteView from './routeView';
import IMenu from './menu';
import HeaderComponent from './header';

const { Header, Content, Sider, Footer } = Layout;

export default function BaseLayout() {
  const { pathname } = useLocation();
  const menuPathList = pathname.split('/');
  menuPathList.shift();
  
  return (
    <div className='layout-container'>
      <Layout>
        <Header className="header">
          <HeaderComponent />
        </Header>
        <Layout className="content-layout">
          <Sider collapsible>
            <IMenu />
          </Sider>
          <Layout>
            <Content>
              <div className='layout-page-container'>
                <RouteView />
              </div>
            </Content>
            <Footer>
                foofter
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}
