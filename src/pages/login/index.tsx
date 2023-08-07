import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch } from '../../store/hooks';
import { fetchUser } from '../../store/user';
import { useState } from 'react';

export default function Login() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const loginHandle = async () => {
    setLoading(true);
    await dispatch(fetchUser());
    setLoading(false);
  };
  return (
    <div>
      <Button loading={loading} onClick={loginHandle}>
        <FormattedMessage id="page.login.login" />
      </Button>
    </div>
  );
}
