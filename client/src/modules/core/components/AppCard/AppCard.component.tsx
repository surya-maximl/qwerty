import { Flex, Dropdown, Typography, Button } from "antd";
import RenderIcon from "../RenderIcon/RenderIcon.component";
import { FaRegEdit } from 'react-icons/fa';
import { TbDotsVertical } from 'react-icons/tb';
import { appEvents as items } from '../../constants/dashboard.constants';
import { useNavigate } from "react-router-dom";

type Props = {
  item: any,
  handleDropdownClick: (e: any, id: string) => void,
}

const AppCard: React.FC<Props> = ({ item, handleDropdownClick }) => {
  const navigate = useNavigate();
  return (
    <Flex
      key={item?.id}
      vertical
      justify="space-between"
      className="border-solid border-[1px] border-borderColor h-fit w-[22%] p-4 rounded-lg"
    >
      <Flex justify="space-between">
        <Flex className="w-fit p-2.5 rounded-md bg-secondary mb-4">
          <RenderIcon name={item.icon} />
        </Flex>
        <Dropdown
          menu={{ onClick: (e) => handleDropdownClick(e, item?.id), items }}
          placement="bottomLeft"
          arrow
          trigger={['click']}
        >
          <TbDotsVertical className="text-xl text-primary cursor-pointer" />
        </Dropdown>
      </Flex>
      <Typography.Text className="text-lg font-semibold">{item?.name}</Typography.Text>
      <Button
        className="my-1 w-[50%]"
        type="primary"
        onClick={() => navigate(`/app/editor/${item?.id}`)}
      >
        <FaRegEdit />
        Edit
      </Button>
    </Flex>
  );
};

export default AppCard;
