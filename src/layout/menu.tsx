import React, { useMemo, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../locales';
import { useAppSelector } from '../store/hooks';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import './style.less';

type IMenuProps = {
  onChange?: (path: string) => void;
};

export default function IMenu(props: IMenuProps) {
  const { onChange } = props;
  const navigator = useNavigate();
  const user = useAppSelector(state => state.userReducer);
  const { formatMessage } = useLocale();
  const defaultSelectedKeys = useMemo(() => {
    const locationPathname = location.hash.replace('#', '');
    if (!locationPathname || locationPathname === '/') {
      return '/dashboard';
    }
    return locationPathname;
  }, []);

  console.log(defaultSelectedKeys, 'defaultSelectedKeys');
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
      defaultSelectedKeys={[defaultSelectedKeys]}
      style={{ height: '100%', borderRight: 0 }}
      items={creatMenuItem()}
      defaultValue={defaultSelectedKeys}
      onSelect={e => {
        navigator(e.key);
        onChange?.(e.key);
      }}
    />
  );
}
