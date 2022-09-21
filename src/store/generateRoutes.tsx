import { MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React from 'react';
import { IRoutes } from '../routes/typing';
import WrapperRouteComponent from '../routes/WrapperRouteComponent';

export const generateRoutes = (menus: API.RoutesResponse[], parentPath = '') => {
  return menus.map(menus => {
    const { router, component, name, index, children } = menus;
    const pathLinked = parentPath ? `${parentPath}/` : parentPath;
    const routeProps: IRoutes = {
      path: router,
      name,
      index: index || undefined,
      children: children ? generateRoutes(children, `${pathLinked}${router}`) : undefined,
      element: component
    };
    if (component) {
      const Element = React.lazy(() => import(`../pages${router}`));
      routeProps.element = <WrapperRouteComponent element={<Element />} auth={false} />;
    }
    return routeProps;
  });
};
export const generateMenus = (menus: API.RoutesResponse[], parentPath = '', parentName = ''): MenuProps['items'] => {
  return menus
    .filter(item => item.isShown)
    .map(item => {
      const currentPath = `${parentPath}${item.router}`;
      const currentName = `${parentName}${item.name}`;
      return {
        key: currentPath,
        // icon: React.createElement(icon),
        label: currentName,
        children: item.children ? generateMenus(item.children, `${currentPath}/`, `${currentName}.`) : null
      };
    });
};
