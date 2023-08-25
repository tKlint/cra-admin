import React, { Suspense, useEffect, useMemo } from 'react';
import { Navigate, RouteObject, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import WrapperRouteComponent from './WrapperRouteComponent';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { afterLogin } from '../store/user';
import { cloneDeep } from 'lodash';
import { generateRoutes } from '../store/generateRoutes';
import SuspendFallbackLoading from '../layout/SuspendFallbackLoading';
import SignUp from '@/pages/signUp';

export enum FREE_ROUTER_PATH {
  LOGIN = '/login',
  SIGN_UP = '/singUp'
}

const NotFound = React.lazy(() => import('../pages/404'));
const Login = React.lazy(() => import('../pages/login'));
const Layout = React.lazy(() => import('../layout'));

const defaultRouters: RouteObject[] = [
  {
    path: FREE_ROUTER_PATH.LOGIN,
    element: <WrapperRouteComponent auth={false} element={<Login />} />
  },
  {
    path: FREE_ROUTER_PATH.SIGN_UP,
    element: <WrapperRouteComponent auth={false} element={<SignUp />} />
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

const ROUTER_PATH_WHITE_LIST = [FREE_ROUTER_PATH.LOGIN, FREE_ROUTER_PATH.SIGN_UP];

export default function DynamicRouter() {
  const user = useAppSelector(state => state.userReducer);
  const dispatch = useAppDispatch();
  const { pathname, state } = useLocation();
  const { token, routes } = user;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !ROUTER_PATH_WHITE_LIST.includes(pathname as FREE_ROUTER_PATH)) {
      return navigate({ pathname: FREE_ROUTER_PATH.LOGIN }, { replace: true, state: { from: pathname } });
    }
    if (token && ROUTER_PATH_WHITE_LIST.includes(pathname as FREE_ROUTER_PATH)) {
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
    const defaultPage = routesWithComponent[0]?.path || '';
    const defaultRouter = {
      path: '/',
      element: <Navigate to={defaultPage} />
    };
    if (defaultPage) {
      layoutRoute?.push(defaultRouter);
    }
    layoutRoute?.push(...(cloneDeep([...routesWithComponent]) as RouteObject[]), ...notFoundPage);
    return routesInstance;
  }, [routes]);

  return <RenderRouter routerList={newRoutes} />;
}

const RenderRouter: React.FC<{ routerList: RouteObject[] }> = ({ routerList }) => {
  const element = useRoutes(routerList);
  return <Suspense fallback={<SuspendFallbackLoading message="文件加载失败" />}>{element}</Suspense>;
};
