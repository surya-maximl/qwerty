import { Flex, Layout, Typography } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

const editorHeaaderStyle: React.CSSProperties = {
  backgroundColor: '#FCFCFD',
  borderBottom: '1px solid hsl(208, 11.7%, 91.1%)',
  height: '48px',
  padding: 0
};

const EditorHeader: React.FC = ({ name }) => {
  return (
    <Header style={editorHeaaderStyle}>
      <Flex align="center" className="h-full p-4">
        <Text strong>{name}</Text>
      </Flex>
    </Header>
  );
};

export default EditorHeader;
