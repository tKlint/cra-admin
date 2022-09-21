import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../locales';
import { useAppSelector } from '../store/hooks';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import './style.less';

export default function IMenu() {
  const navigator = useNavigate();
  const user = useAppSelector(state => state.userReducer);
  const { formatMessage } = useLocale();
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['/dashboard']}
      style={{ height: '100%', borderRight: 0 }}
      onSelect={e => {
        navigator(e.key);
      }}
    >
      {user.menuItems?.map(item => {
        return (
          <Menu.Item key={item?.key}>
            {formatMessage({
              id: `menu.${(item as MenuItemType)?.label as string}`
            })}
          </Menu.Item>
        );
      })}
    </Menu>
  );
}
