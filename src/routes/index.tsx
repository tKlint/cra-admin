import React, { Suspense, useEffect, useMemo } from 'react';
import { RouteObject, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import WrapperRouteComponent from './WrapperRouteComponent';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { afterLogin } from '../store/user';
import { cloneDeep } from 'lodash';
import { generateRoutes } from '../store/generateRoutes';
import SuspendFallbackLoading from '../layout/SuspendFallbackLoading';

const NotFound = React.lazy(() => import('../pages/404'));
const Login = React.lazy(() => import('../pages/login'));
const Layout = React.lazy(() => import('../layout'));

const defaultRouters: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent auth={false} element={<Login />} />
  },
  {
    path: '/',
    element: <WrapperRouteComponent auth={true} element={<Layout />} />,
    children: []
  }
];

const notFoundPage = [
  {
    path: '*',
    element: <WrapperRouteComponent auth={true} element={<NotFound />} />
  }
];

export default function DynamicRouter() {
  const user = useAppSelector(state => state.userReducer);
  const dispatch = useAppDispatch();
  const { pathname, state } = useLocation();
  const { token, routes, menuItems } = user;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && pathname !== '/login') {
      return navigate({ pathname: 'login' }, { replace: true, state: { from: pathname } });
    }
    if (token && pathname === '/login') {
      return navigate({ pathname: '/' });
    }
    if (token && !routes?.length) {
      dispatch(afterLogin());
    }
  }, [token, pathname, state]);

  const newRoutes = useMemo(() => {
    const routesInstance = cloneDeep(defaultRouters);
    const routesWithComponent = generateRoutes(routes);
    const layoutRoute = routesInstance.find(item => item.path === '/')?.children;
    layoutRoute?.push(...cloneDeep([...routesWithComponent]), ...notFoundPage);
    return routesInstance;
  }, [routes]);

  return <RenderRouter routerList={newRoutes} />;
}

const RenderRouter: React.FC<{ routerList: RouteObject[] }> = ({ routerList }) => {
  const element = useRoutes(routerList);
  return <Suspense fallback={<SuspendFallbackLoading message="文件加载失败" />}>{element}</Suspense>;
};
