import { useMemo } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../locales';
import { useAppSelector } from '../store/hooks';
import './style.less';
import { clone } from 'lodash';

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
      return user.routes[0]?.path;
    }
    return locationPathname;
  }, []);

  const creatMenuItem = (menusData: typeof user.menuItems): typeof user.menuItems => {
    return menusData?.map(menu => {
      return {
        ...menu,
        label: menu.label
          ? formatMessage({
              id: `menu.${menu?.label}`
            })
          : 'UNSET',
        children: menu.children ? creatMenuItem(menu.children) : void 0
      };
    });
  };
  const menuItemProp = useMemo(() => {
    if (!user.menuItems) {
      return [];
    }
    const menuItem = clone(user.menuItems);
    return creatMenuItem(menuItem);
  }, [user]);

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[defaultSelectedKeys]}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItemProp}
      defaultValue={defaultSelectedKeys}
      onSelect={e => {
        navigator(e.key);
        onChange?.(e.key);
      }}
    />
  );
}
