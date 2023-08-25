import { Button, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch } from '../../store/hooks';
import { fetchUser } from '../../store/user';
import { useState } from 'react';

export default function Login() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };
  const loginHandle = async (values: Record<string, string>) => {
    setLoading(true);
    await dispatch(fetchUser(values));
    setLoading(false);
  };
  return (
    <div className="w-screen h-screen place-content-center grid">
      <div className="p-[16px] rounded-lg bg-slate-300 h-auto">
        <Form<Record<string, string>> className="w-96" {...formItemLayout} onFinish={loginHandle}>
          <Form.Item label="账号" name="loginId" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              <FormattedMessage id="page.login.login" />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
