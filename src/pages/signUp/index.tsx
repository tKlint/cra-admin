import api from '@/service';
import { Button, Form, Input } from 'antd';
import { RuleRender } from 'antd/lib/form';
import React from 'react';

const SignUp: React.FC = () => {
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
  const alidatorConfirmPassword: RuleRender = ({ getFieldValue }) => {
    return {
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('The two passwords do not match!');
      }
    };
  };
  const submitHandle = async (values: Record<string, string>) => {
    await api.SIGN_UP(values);
  };
  return (
    <div className="w-screen h-screen place-content-center grid">
      <div className="p-[16px] rounded-lg bg-slate-300 h-auto">
        <Form<Record<string, string>> className="w-96" {...formItemLayout} onFinish={submitHandle}>
          <Form.Item label="email" name="email" rules={[{ type: 'email', required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            dependencies={['password']}
            label="确认密码"
            name="confirmPassword"
            rules={[
              {
                // required: true,
                message: 'Please confirm your password!'
              },
              alidatorConfirmPassword
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
