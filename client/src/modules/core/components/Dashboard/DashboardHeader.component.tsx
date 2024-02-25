import { SyntheticEvent } from 'react';
import { Avatar, Dropdown, Flex, Layout, MenuProps } from 'antd';

import { logout } from '../../../authentication/reducers';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAuth } from '../../../shared/hooks/useAuth';

const { Header } = Layout;

const DashboardHeader: React.FC<{ setOpen: (state: boolean) => void }> =  ({ setOpen }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const items: MenuProps['items'] = [
    {
      key: 'profile-menu-name',
      label: (
        <span className="flex flex-col">
          <span className="font-semibold">{user.username}</span>
          {user.email}
        </span>
      ),
    },
    {
      type: 'divider'
    },
    {
      key: 'profile-settings',
      label: (
        <Flex>
          Profile Settings
        </Flex>
      )
    },
    {
      type: 'divider'
    },
    {
      label: <span className="text-red-400">Log Out</span>,
      key: 'logout'
    }
  ];

  const onClick = ({ key }) => {
    if(key === 'profile-settings') {
      setOpen(true);
    }
    if (key === 'logout') {
      dispatch(logout());
    }
  };

  return (
    <Header className="flex items-center w-full h-12 bg-white border-solid border-0 border-b-[1px] border-border">
      <Flex className="w-full" align="center">
        <Flex flex={1} align='center'>
          <div className='text-base font-semibold text-primary'>All Apps</div>
        </Flex>
        <Flex justify="flex-end" flex={1}>
          <Dropdown menu={{ items, onClick }} trigger={['click']}>
            <div
              onClick={(event: SyntheticEvent) => {
                event.preventDefault();
              }}
              className="flex items-center cursor-pointer"
            >
              <Avatar
                className="hover:scale-110 transition ease-in-out delay-100"
                style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
              >
                {user.username?.substring(0, 1)}
              </Avatar>
            </div>
          </Dropdown>
        </Flex>
      </Flex>
    </Header>
  );
};

export default DashboardHeader;
