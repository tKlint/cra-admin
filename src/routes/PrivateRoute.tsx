import React, { useEffect } from 'react';
import { IProps } from './WrapperRouteComponent';
import { useAppSelector } from '../store/hooks';
import { Button, Result } from 'antd';
import { useLocale } from '../locales';
import { useNavigate } from 'react-router-dom';

const PrivateRoute: React.FC<IProps> = props => {
  const user = useAppSelector(state => state.userReducer);
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const toLogin = () => {
    navigate('/login');
  };
  return user.token ? (
    (props.element as JSX.Element)
  ) : (
    <Result
      status="error"
      title={formatMessage({ id: 'app.no-login' })}
      subTitle={formatMessage({ id: 'app.no-access' })}
    >
      <Button onClick={toLogin}>{formatMessage({ id: 'app.login-tip' })}</Button>
    </Result>
  );
};

export default PrivateRoute;
