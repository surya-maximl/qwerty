import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { login } from '../../reducers';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  function handleLogin() {
    dispatch(login());
  }

  return (
    <Flex className="min-h-screen relative flex-col" justify="center" align="center" gap="large">
      <Flex className="items-center justify-center bg-white w-full fixed top-0 p-4 z-10">
        <img
          className="object-contain h-7 w-7"
          src="https://app.tooljet.com/logo.svg"
          alt="Tooljet Logo"
        />
      </Flex>
      <Flex className="flex-col mt-16 w-full" align="center" justify="center" gap="middle">
        <Flex vertical align="center">
          <Title>Sign in</Title>
          <Paragraph>
            New to ToolJet? <Link to="../signup">Create an account</Link>
          </Paragraph>
        </Flex>
        <div className="w-full max-w-xs">
          <Form layout="vertical" form={form} className="w-full">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please enter a valid email!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input prefix={<LockOutlined />} type="password" placeholder="Enter password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleLogin} size="large" className="w-full">
                Login (development)
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Flex>
    </Flex>
  );
};

export default Login;
