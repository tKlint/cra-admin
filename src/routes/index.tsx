import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
const NotFound = React.lazy(() => import("../pages/404"));
const defaultRouters = [
  {
    path: "/",
    element: <div>dwdw</div>,
  },
  {
    path: "/login",
    element: <div>登录</div>,
  },
];
export default function DynamicRouter() {
  const { pathname, state } = useLocation();

  useEffect(() => {
		// pathname
		// if (pathname === '/login') {

		// }
		console.log(process.env)
		console.log(import.meta.url, 'wwww')
	}, []);
  return <div>DynamicRouter</div>;
}
