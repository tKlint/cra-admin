import { Button } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUser } from '../../store/user';

export default function Login() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.userReducer);
  console.log('www', user);
  return (
    <div>
      <Button
        onClick={() => {
          dispatch(fetchUser());
        }}
      >
        <FormattedMessage id="page.login.login" />
      </Button>
    </div>
  );
}
