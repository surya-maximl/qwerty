import { SyntheticEvent } from 'react';
import { Avatar, Dropdown, Flex, Layout } from 'antd';
import { useAuth } from '../../../shared/hooks/useAuth';

const { Sider } = Layout;

const leftPanelStyle: React.CSSProperties = {
  backgroundColor: '#FCFCFD',
  borderRight: '1px solid hsl(208, 11.7%, 91.1%)'
};

const LeftPanel: React.FC = () => {
  const { user } = useAuth();

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
      </Flex>
    </Sider>
  );
};

export default LeftPanel;
