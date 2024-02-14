import { Flex } from "antd";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from "../../components/Container/container.component";

type Props = {}

const Editor: React.FC = () => {
  const canvasWidth = 100;
  useEffect(() => {
    document.title = "Editor";
  })
  
  return (
    <>
      <Flex className="h-full">
        <DndProvider backend={HTML5Backend}>
        <Flex flex={3} className="" id="real-canvas">
          <Container canvasWidth={canvasWidth}/>
        </Flex>
        <Flex flex={1} className="bg-slate-500" id="widget-manager">
          2
        </Flex>
        </DndProvider>
      </Flex>
    </>
  )
}


export default Editor;