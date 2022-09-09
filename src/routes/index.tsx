import React, { Suspense, useEffect } from "react";
import { RouteObject, useLocation, useNavigate, useRoutes } from "react-router-dom";
import WrapperRouteComponent from './WrapperRouteComponent';
import { useAppSelector } from '../store/hooks';

const NotFound = React.lazy(() => import("../pages/404"));
const Login = React.lazy(() => import("../pages/login"));
const Layout = React.lazy(() => import("../layout"));

const defaultRouters: RouteObject[] = [
  {
    path: "/login",
    element: <WrapperRouteComponent auth={false} element={<Login />}/>,
  },
  {
    path: "/",
    element: <WrapperRouteComponent auth={true} element={<Layout />}/>,
		children: []
  },
	{
		path: "*",
		element: <WrapperRouteComponent auth={true} element={<NotFound />}/>
	}
];

export default function DynamicRouter() {
	const user = useAppSelector((state) => state.userReducer);
  const { pathname, state } = useLocation();
	const { token } = user;
	const navigate = useNavigate();

  useEffect(() => {
    if (!token && pathname !== '/login') {
      return navigate({ pathname: 'login' }, { replace: true, state: { from: pathname } });
		}
  }, [token, navigate, pathname, state]);

  return <RenderRouter routerList={defaultRouters}/>;
}


const RenderRouter: React.FC<{ routerList: RouteObject[]}> = ({ routerList }) => {
  const element = useRoutes(routerList);
  return <Suspense fallback={<div>loading</div>}>{element}</Suspense>;
};