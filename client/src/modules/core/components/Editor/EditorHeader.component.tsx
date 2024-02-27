import { Flex, Layout, Skeleton, Typography } from 'antd';
// import moment from 'moment';
import { useParams } from 'react-router-dom';

import { useGetAppQuery } from '../../../shared/apis/appApi';

const { Header } = Layout;
const { Text } = Typography;

const EditorHeader: React.FC = () => {
  const { id } = useParams();

  const { data: app, isLoading } = useGetAppQuery(id || '');

  return (
    <Header className="flex max-h-12 items-center border-0 border-b-[1px] border-solid border-border !bg-background p-0 px-4">
      <Flex align="center" justify="space-between" className="h-full w-full p-4">
        {isLoading ? (
          <Skeleton.Input size="small" active className="!m-0 !leading-none" />
        ) : (
          <Text className="!m-0 !p-0 !text-base font-semibold text-foreground/80">{app?.name}</Text>
        )}

        {/* {isLoading ? (
          <Skeleton.Input size="small" active className="!m-0 !leading-none" />
        ) : (
          <Text className="!m-0 !p-0 !text-xs font-medium text-mutedForeground">
            Last updated {moment(app?.updatedAt).fromNow()}
          </Text>
        )} */}
      </Flex>
    </Header>
  );
};

export default EditorHeader;
