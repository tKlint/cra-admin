import React from 'react';
import { RouteProps } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

export interface IProps extends RouteProps {
  auth?: boolean;
}

const WrapperRouteComponent: React.FC<IProps> = props => {
  const { auth, element } = props;
  return auth ? <PrivateRoute {...props} /> : (element as JSX.Element);
};
export default WrapperRouteComponent;
