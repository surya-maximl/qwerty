import { Flex } from "antd";
import { useEffect } from "react";

type Props = {}

const Editor: React.FC = () => {
  useEffect(() => {
    document.title = "Editor";
  })
  
  return (
    <>
      <Flex className="h-full">
        <Flex flex={3} className="bg-black">
          1
        </Flex>
        <Flex flex={1} className="bg-slate-500">
          2
        </Flex>
      </Flex>
    </>
  )
}


export default Editor;