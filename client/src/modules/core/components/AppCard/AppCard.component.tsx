import { Button, Dropdown, Flex, Typography, Card } from 'antd';
import { FaRegEdit } from 'react-icons/fa';
import { TbDotsVertical } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { appEvents as items } from '../../constants/dashboard.constants';
import RenderIcon from '../RenderIcon/RenderIcon.component';

type Props = {
  item: any;
  handleDropdownClick: (e: any, id: string) => void;
};

const AppCard: React.FC<Props> = ({ item, handleDropdownClick }) => {
  const navigate = useNavigate();
  return (
    <Card key={item?.id} className="border-border shadow-sm shrink-0">
      <Flex vertical className="gap-8">
        <Flex justify="space-between" className="w-full">
          <Flex className="rounded-md bg-secondary">
            <RenderIcon name={item.icon} />
          </Flex>
          <Dropdown
            menu={{
              onClick: (e) => handleDropdownClick(e, item?.id),
              items
            }}
            placement="bottomLeft"
            arrow
            trigger={['click']}
          >
            <TbDotsVertical className="text-xl cursor-pointer" />
          </Dropdown>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text className="text-xl font-semibold">{item?.name}</Typography.Text>
          <Button
            type="primary"
            className="ext-lg px-6 flex justify-center items-center"
            onClick={() => navigate(`/app/editor/${item?.id}`)}
          >
            <FaRegEdit className='t mr-1'/>
            Edit
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default AppCard;
