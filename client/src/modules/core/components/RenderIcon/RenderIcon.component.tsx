import { appIcons } from "../../constants/dashboard.constants";
import { MdEmail } from "react-icons/md";
import { Flex } from "antd";

type Props = {
  name: string
}

const RenderIcon: React.FC<Props> = ({ name }) => {
  let icon = appIcons.find(item => item.name === name);
  return (
    <>  
      <Flex className="text-3xl text-primary">
        {!name && <MdEmail/>}
        {name && icon?.icon}
      </Flex>
    </>
  )
}

export default RenderIcon;