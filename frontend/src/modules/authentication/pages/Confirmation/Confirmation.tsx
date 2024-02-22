import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { login } from '../../reducers';

import axios from 'axios';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';

const { Title } = Typography;

const Confirmation: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { invitationId } = useParams();
  const dispatch = useAppDispatch()
  console.log("invitation id: ", invitationId);


  const handleRedirect = async (values: any) => {
    //form submit
    console.log(values);
    const data = {
      "companyName": values.companyName,
      "companySize": values.companySize,
      "phoneNumber": values.phoneNumber,
      "token": invitationId
    }
    try{ 
      const res = await axios.post("http://localhost:3000/setup-account-from-token", data);
      console.log(res);
      dispatch(login()).unwrap().then(() => navigate(`/app?id=${res.id}`));
  
    } catch(e){
      console.log(e);
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
          <Title>Add Details</Title>
          {/* <Paragraph>
            Already have an account? <Link to="../login">Sign in</Link>
          </Paragraph> */}
        </Flex>
        <div className="w-full max-w-xs">
          <Form layout="vertical" form={form} className="w-full" onFinish={handleRedirect}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: '' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your full name"/>
            </Form.Item>
            <Form.Item
              name="companySize"
              label="Company Size"
              rules={[{ required: true, message: 'Enter your company size!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your company size"/>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter your phone number!' }]}
            >
              <Input prefix={<LockOutlined />} type="tel" placeholder="Enter phone number"/>
            </Form.Item>
            <Form.Item>
              <Button
              htmlType='submit'
                type="primary"
                // onClick={handleRedirect}
                size="large"
                className="w-full"
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Flex>
    </Flex>
  );
};

export default Confirmation;
