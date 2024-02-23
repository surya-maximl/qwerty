import { Button, Flex, Layout } from 'antd';

import { WidgetManager } from './WidgetManager/widgetManager.component';
import { componentTypes } from './WidgetManager/widgetsComponents';

const rightPanelStyle: React.CSSProperties = {
  backgroundColor: '#FCFCFD',
  borderLeft: '1px solid hsl(208, 11.7%, 91.1%)'
};

const { Sider } = Layout;

const RightPanel: React.FC = () => {
  return (
    <Sider style={rightPanelStyle} width={300}>
      <Flex className="h-12 items-center border-solid border-0 border-border border-b-[1px] px-4 justify-end">
        <Button type="primary">Release</Button>
      </Flex>
      <WidgetManager componentTypes={componentTypes} />
    </Sider>
  );
};

export default RightPanel;
