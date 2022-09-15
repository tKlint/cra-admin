import { Layout, Menu, MenuProps } from 'antd'
import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { useLocale } from '../locales';

import './style.less'
import userReducer from '../store/user';
import { useAppSelector } from '../store/hooks';

const { Header, Content, Sider, Footer } = Layout;
const items2: MenuProps['items'] = ['2', '1', '3'].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      // icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);
export default function BaseLayout() {
  const { formatMessage } = useLocale();
  const user = useAppSelector((state) => state.userReducer);
  const { pathname } = useLocation();
  const menuPathList = pathname.split('/');
  menuPathList.shift();
  const defaultSelectedKeys = menuPathList.map((pathname) => `/${pathname}`);

  return (
    <div className='layout-container'>
      <Layout>
        <Header className="header">
          <div className="logo">this is header</div>
        </Header>
        <Layout className="content-layout">
          <Sider collapsible>
            <Menu 
              mode="inline"
              defaultSelectedKeys={defaultSelectedKeys}
              // defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              items={user.menuItems}
              onChange={(e) => {
                console.log(e, 'e')
              }}
            />
          </Sider>
          <Layout>
            <Content>
              <div className='layout-page-container'>
                22
                <Outlet />            
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
