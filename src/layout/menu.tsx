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
type MenuItems = Omit<UserMenu, 'label'> & {
  label?: React.ReactNode;
  icon?: React.ReactNode;
};

type MenuIconProps = {
  iconName?: string;
};

const MenuIcon = ({ iconName }: MenuIconProps) => {
  if (!iconName) {
    return null;
  }
  return (
    <span role="img" className="menu-icon ant-menu-item-icon">
      <svg className="icon" aria-hidden="true">
        <use xlinkHref={`#${iconName}`}></use>
      </svg>
    </span>
  );
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

  const creatMenuItem = (menusData: typeof user.menuItems): MenuItems[] => {
    if (!menusData) {
      return [];
    }
    return menusData.map(menu => {
      return {
        ...menu,
        icon: <MenuIcon iconName={menu.icon} />,
        label: formatMessage({ id: `menu.${menu?.label}` }),
        children: menu.children ? creatMenuItem(menu.children) : void 0
      } as MenuItems;
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
