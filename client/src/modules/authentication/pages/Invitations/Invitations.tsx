import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Card, Flex, Form, Input, Typography } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { login } from '../../reducers';
import { useAppDispatch } from '../../shared/hooks/useAppDispatch';

const { Title, Paragraph } = Typography;

const Invitations: React.FC = () => {
  const { invitationId } = useParams();
  const [isFormSubmittable, setIsFormSubmittable] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const values = Form.useWatch([], form);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRedirect = async (values: any) => {
    //form submit
    console.log(values);
    const data = {
      companyName: values.companyName,
      companySize: values.companySize,
      phoneNumber: values.phoneNumber,
      token: invitationId
    };
    try {
      const res = await axios.post('http://localhost:3000/setup-account-from-token', data);
      console.log(res);
      dispatch(login())
        .unwrap()
        .then(() => navigate(`/app?id=${res.id}`));
    } catch (e) {
      console.log(e);
    }
  };

  // TODO

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsFormSubmittable(true))
      .catch(() => setIsFormSubmittable(false));
  }, [form, values]);

  return (
    <Card className="mt-16 shadow-sm w-full max-w-sm border-border">
      <Flex vertical className="gap-2">
        <Flex vertical>
          <Title className="scroll-m-20 !text-3xl !font-semibold tracking-tight">Add Details</Title>
          {/* <Paragraph className="text-secondary font-normal">
            Add Details <Link to="../signup">Create an account</Link>
          </Paragraph> */}
        </Flex>
        <Flex vertical>
          <Form layout="vertical" form={form} onFinish={handleRedirect}>
            <Form.Item
              name="companyName"
              label="Company Name"
              className="font-medium"
              rules={[{ required: true, message: '' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
            </Form.Item>
            <Form.Item
              name="companySize"
              label="Company Size"
              className="font-medium"
              rules={[{ required: true, message: 'Enter your company size!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your company size" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              className="font-medium"
              rules={[{ required: true, message: 'Please enter your phone number!' }]}
            >
              <Input prefix={<LockOutlined />} type="tel" placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                className="w-full"
                disabled={!isFormSubmittable}
              >
                Continue
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Invitations;