import { SyntheticEvent } from 'react';
import { Avatar, Dropdown, Flex, Layout } from 'antd';
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
      </Flex>
    </Sider>
  );
};

export default LeftPanel;
