import { MdDelete } from "react-icons/md";
import { Flex, Typography } from "antd"

const BoxOptions: React.FC<{ name: string, deleteComponent: (id: string) => void, id: string }> = ({name, deleteComponent, id}) => {
  return (
    <Flex justify="space-between" align="center" className="bg-white rounded-md h-6 mb-1 px-1 min-w-24">
      <Typography.Text className="font-semibold text-xs">{name}</Typography.Text>
      <Flex onClick={()=>deleteComponent(id)}><MdDelete className="text-primary cursor-pointer"/></Flex>
    </Flex>
  )
}

export default BoxOptions;