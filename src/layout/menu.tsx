import React from 'react';
import { Menu, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../locales';
import { useAppSelector } from '../store/hooks';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import './style.less';

export default function IMenu() {
  const navigator = useNavigate();
  const user = useAppSelector(state => state.userReducer);
  const { formatMessage } = useLocale();
  const creatMenuItem = (): MenuProps['items'] => {
    return user.menuItems?.map(item => {
      const intlLabel = formatMessage({
        id: `menu.${(item as MenuItemType)?.label as string}`
      });
      return {
        disabled: false,
        key: item?.key || '',
        title: intlLabel,
        label: intlLabel
      };
    });
  };
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['/dashboard']}
      style={{ height: '100%', borderRight: 0 }}
      items={creatMenuItem()}
      onSelect={e => {
        navigator(e.key);
      }}
    />
  );
}
