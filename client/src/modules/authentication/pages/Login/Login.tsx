import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { login } from '../../reducers';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async(values: any) => {
    const data = {
      "email": values.email,
      "password": values.password
    }
    try {
      const res = await axios.post("http://localhost:3000/auth/signin", data, {
        headers: {
          // 'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGFyc2ggR3VwdGEiLCJpZCI6ImY3ZTYxYzE1LTU0NDktNDc1YS1iZjY4LTM2OGI3ZmVkNTM2YSIsImlhdCI6MTcwODY2MDkyOSwiZXhwIjoxNzA5MDIwOTI5fQ.N2gi4yZw1Xn-bMq6nvHN8KCKB7y3xa5dRHAVqzzhSic',
          'Content-Type': 'application/json'
        }
      });
      console.log(res.data.id);
      dispatch(login(res.data));
      navigate(`/app/${res.data.id}`)
    } catch (err) {
      console.log(err);
    }
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
          <Form layout="vertical" form={form} className="w-full" onFinish={handleLogin}>
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
              <Button type="primary" htmlType='submit' size="large" className="w-full">
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
