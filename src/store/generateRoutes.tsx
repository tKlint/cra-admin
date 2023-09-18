import React from 'react';
import { IRoutes } from '../routes/typing';
import WrapperRouteComponent from '../routes/WrapperRouteComponent';

export const generateRoutes = (menus: UserRouterWithChildren[], parentPath = '') => {
  return menus.map(menus => {
    const { path, component, name, index, children } = menus;
    const pathLinked = parentPath ? `${parentPath}/` : parentPath;
    const routeProps: IRoutes = {
      path: path,
      name,
      index: index || undefined,
      children: children ? generateRoutes(children, `${pathLinked}${path}`) : undefined,
      element: component
    };
    if (component) {
      const Element = React.lazy(() => import(`../pages${component}`));
      routeProps.element = <WrapperRouteComponent element={<Element />} auth={false} />;
    }
    return routeProps;
  });
};
export const generateMenus = (menus: UserRouterWithChildren[], parentPath = '', parentName = ''): UserMenu[] => {
  return menus
    .filter(item => item.isShown)
    .map(item => {
      const currentPath = `${parentPath}${item.path}`;
      const currentName = `${parentName}${item.name}`;
      return {
        key: currentPath,
        // icon: React.createElement(icon),
        label: currentName,
        icon: item.icon ?? void 0,
        children: item.children ? generateMenus(item.children, `${currentPath}/`, `${currentName}.`) : null
      };
    });
};
