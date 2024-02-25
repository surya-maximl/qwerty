import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Card, Flex, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { useLoginMutation } from '../../../shared/apis/authApi';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const [isFormSubmittable, setIsFormSubmittable] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const values = Form.useWatch([], form);
  const [loginMutation, { isLoading, isError, error }] = useLoginMutation();

  function handleLogin(values: any) {
    loginMutation(values);
  }

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormSubmittable(true))
      .catch(() => setIsFormSubmittable(false));
  }, [form, values]);

  useEffect(() => {
    if (isError) {
      message.error(error.data.message);
    }
  }, [isError, error]);

  return (
    <Card className="mt-16 shadow-sm w-full max-w-sm border-border">
      <Flex vertical className="gap-2">
        <Flex vertical>
          <Title className="scroll-m-20 !text-3xl !font-semibold tracking-tight">Sign in</Title>
          <Paragraph className="text-secondary font-normal">
            New to InnoJet? <Link to="../signup">Create an account</Link>
          </Paragraph>
        </Flex>
        <Flex vertical>
          <Form layout="vertical" form={form} onFinish={handleLogin}>
            <Flex vertical className="w-full gap-1">
              <Form.Item
                name="email"
                label="Email"
                className="font-medium"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  {
                    type: 'email',
                    message: 'Please enter a valid email'
                  }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter your email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                className="font-medium"
                rules={[
                  { required: true, message: 'Please enter your password' },
                  {
                    min: 6,
                    message: 'Password must contain atleast 6 characters'
                  }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full"
                  loading={isLoading}
                  disabled={!isFormSubmittable}
                >
                  Login
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Login;
