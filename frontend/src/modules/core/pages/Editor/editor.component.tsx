import { Flex } from "antd";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from "../../components/Container/container.component";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { coreActions } from "../../reducers/core.reducer";

type Props = {}

type ContainerPropsType = {
  canvasWidth: () => number
}

const Editor: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(coreActions.changeTitle("Editor"));
  })

  const getCanvasWidth = () => {
    const canvasBoundingRect = document.getElementsByClassName('real-canvas')[0]?.getBoundingClientRect();

    const _canvasWidth = canvasBoundingRect?.width;
    return _canvasWidth;
  };

  const containerProps: ContainerPropsType = {
    canvasWidth: getCanvasWidth
  }

  
  return (
    <>
      <Flex className="h-full">
        <DndProvider backend={HTML5Backend}>
        <Flex flex={3} className="real-canvas" id="real-canvas">
          <Container {...containerProps}/>
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