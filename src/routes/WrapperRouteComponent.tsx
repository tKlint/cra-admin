import React from 'react';
import { RouteProps } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

export interface IProps {
  auth?: boolean;
  element: JSX.Element;
}

const WrapperRouteComponent: React.FC<IProps & RouteProps> = props => {
  const { auth, element } = props;
  return auth ? <PrivateRoute {...props} /> : (element as JSX.Element);
};
export default WrapperRouteComponent;
