import { SyntheticEvent } from 'react';
import { Avatar, Dropdown, Flex, Layout, MenuProps } from 'antd';

import { logout } from '../../../authentication/reducers';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAuth } from '../../../shared/hooks/useAuth';

const { Sider } = Layout;

const leftPanelStyle: React.CSSProperties = {
  backgroundColor: '#FCFCFD',
  borderRight: '1px solid hsl(208, 11.7%, 91.1%)'
};

const LeftPanel: React.FC = () => {
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
      )
    },
    {
      type: 'divider'
    },
    {
      label: <span className="text-red-400">Log Out</span>,
      key: '2'
    }
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '2') {
      dispatch(logout());
    }
  };

  return (
    <Sider collapsed collapsedWidth={48} style={leftPanelStyle}>
      <Flex vertical className="h-full">
        <Flex className="h-12 items-center justify-center border-solid border-0 border-b-[1px] border-border">
          <img
            className="object-contain h-7 w-7"
            src="https://app.tooljet.com/logo.svg"
            alt="Tooljet Logo"
          />
        </Flex>
        <Flex align="center" justify="flex-end" className="flex-col p-1 py-4 flex-1">
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
    </Sider>
  );
};

export default LeftPanel;
