import React from 'react';
import { Avatar, Flex, Modal, Typography } from 'antd';

import { useAuth } from '../../../shared/hooks/useAuth';

const UserInfoModal: React.FC<{ open: boolean; setOpen: (state: boolean) => void }> = ({
  open,
  setOpen
}) => {
  const { user } = useAuth();
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} title="Profile Settings" onCancel={handleCancel} footer={<></>}>
      <Flex>
        <Flex flex={1} justify="center" align="center">
          <Avatar
            className="hover:scale-110 transition ease-in-out delay-100 h-20 w-20 flex justify-center items-center text-2xl font-semibold"
            style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          >
            {user.username?.substring(0, 1)}
          </Avatar>
        </Flex>
        <Flex flex={1} vertical>
          <Flex vertical className="border-border border-solid border-0 border-b-[1px] pb-2">
            <Typography.Title level={5} className="!m-0">
              Display Name
            </Typography.Title>
            <Typography.Paragraph className="!m-0">{user.username}</Typography.Paragraph>
          </Flex>
          <Flex vertical className="border-border border-solid border-0 border-b-[1px] pt-4 pb-2">
            <Typography.Title level={5} className="!m-0">
              Email Address
            </Typography.Title>
            <Typography.Paragraph className="!m-0">{user.email}</Typography.Paragraph>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default UserInfoModal;
