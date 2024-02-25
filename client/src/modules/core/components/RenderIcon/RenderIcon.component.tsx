import { Flex } from 'antd';

import { appIcons } from '../../constants/dashboard.constants';

const RenderIcon = ({ name }) => {
  let icon = appIcons.find((item) => item.name === name);
  return (
    <>
      <Flex className="text-3xl text-primary">{icon?.icon}</Flex>
    </>
  );
};

export default RenderIcon;
