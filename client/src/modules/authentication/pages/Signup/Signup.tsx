import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';
import { login } from '../../reducers';

const { Title, Paragraph } = Typography;

const Signup: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignup = async (values: any) => {
    let data = {
      "email": values.email,
      "password": values.password,
      "name": values.name,
      "phone": "8862925042"
    };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/auth/signup',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    try {
      const res = await axios.request(config);
      console.log(res.data);
      dispatch(login(res.data));
      navigate("/app");
    } catch (err) {
      console.log("error: ", err);
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
          <Title>Join Tooljet</Title>
          <Paragraph>
            Already have an account? <Link to="../login">Sign in</Link>
          </Paragraph>
        </Flex>
        <div className="w-full max-w-xs">
          <Form layout="vertical" form={form} className="w-full" onFinish={handleSignup}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a valid name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
            </Form.Item>
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
              <Button
                htmlType="submit"
                type="primary"
                onClick={handleSignup}
                size="large"
                className="w-full"
              >
                Signup (development)
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSignup} size="large" className="w-full">
                Back
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Flex>
    </Flex>
  );
};

export default Signup;
