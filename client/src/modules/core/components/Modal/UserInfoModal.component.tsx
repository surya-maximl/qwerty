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
            className="flex h-20 w-20 items-center justify-center text-2xl font-semibold transition delay-100 ease-in-out hover:scale-110"
            style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          >
            {user.username?.substring(0, 1)}
          </Avatar>
        </Flex>
        <Flex flex={1} vertical>
          <Flex vertical className="border-0 border-b-[1px] border-solid border-border pb-2">
            <Typography.Title level={5} className="!m-0">
              Display Name
            </Typography.Title>
            <Typography.Paragraph className="!m-0">{user.username}</Typography.Paragraph>
          </Flex>
          <Flex vertical className="border-0 border-b-[1px] border-solid border-border pb-2 pt-4">
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
