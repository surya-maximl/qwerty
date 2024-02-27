import { Button, Flex, Layout } from 'antd';

import { WidgetManager } from './WidgetManager/widgetManager.component';

const { Sider } = Layout;

const RightPanel: React.FC = () => {
  return (
    <Sider
      className="border-0 border-l-[1px] border-solid border-border !bg-background"
      width={300}
    >
      <Flex className="h-12 items-center justify-end border-0 border-b-[1px] border-solid border-border px-4">
        <Button type="primary" disabled>
          Release
        </Button>
      </Flex>
      <WidgetManager />
    </Sider>
  );
};

export default RightPanel;
