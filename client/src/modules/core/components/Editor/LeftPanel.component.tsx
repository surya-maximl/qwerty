import { SyntheticEvent } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Flex, Layout, Menu, MenuProps } from 'antd';
import { Link } from 'react-router-dom';

import { logout } from '../../../authentication/reducers';
import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { useAuth } from '../../../shared/hooks/useAuth';

const { Sider } = Layout;

type LeftPanelProps = {
  showProfile?: boolean;
};

const leftPanelStyle: React.CSSProperties = {
  backgroundColor: '#FCFCFD',
  borderRight: '1px solid hsl(208, 11.7%, 91.1%)'
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    'Dashboard',
    '1',
    <Link to="/app/dashboard">
      <HomeOutlined />
    </Link>
  )
];

const LeftPanel: React.FC<LeftPanelProps> = ({ showProfile = false }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const dropdownItems: MenuProps['items'] = [
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
      <Flex vertical className="h-full gap-2">
        <Flex className="h-12 items-center justify-center border-solid border-0 border-b-[1px] border-border">
          <Link to="/app">
            <img
              className="object-contain h-7 w-7 hover:scale-105 transition ease-in-out"
              src="https://app.tooljet.com/logo.svg"
              alt="Tooljet Logo"
            />
          </Link>
        </Flex>
        <Menu mode="inline" inlineCollapsed={true} items={items} />
        {showProfile && (
          <Flex align="center" justify="flex-end" className="flex-col p-1 py-4 flex-1">
            <Dropdown menu={{ items: dropdownItems, onClick }} trigger={['click']}>
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
        )}
      </Flex>
    </Sider>
  );
};

export default LeftPanel;
