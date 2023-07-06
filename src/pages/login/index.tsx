import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch } from '../../store/hooks';
import { fetchUser } from '../../store/user';

export default function Login() {
  const dispatch = useAppDispatch();
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
