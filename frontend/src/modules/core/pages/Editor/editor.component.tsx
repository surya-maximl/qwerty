import { Flex } from "antd";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from "../../components/Container/container.component";
import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { coreActions } from "../../reducers/core.reducer";
import { WidgetManager } from "../../components/WidgetManager/widgetManager.component";
import { componentTypes } from "../../components/WidgetManager/widgetsComponents";

type Props = {}

type ContainerPropsType = {
  canvasWidth: number
}

const Editor: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(coreActions.changeTitle("Editor"));
  }, [])

  useEffect(() => {
    setCanvasWidth(getCanvasWidth());
    window.addEventListener("resize", () => setCanvasWidth(getCanvasWidth()));
  }, [canvasWidth])

  const getCanvasWidth = () => {
    const canvasBoundingRect = document.getElementsByClassName('real-canvas')[0]?.getBoundingClientRect();

    const _canvasWidth = canvasBoundingRect?.width;
    return _canvasWidth;
  };

  const containerProps: ContainerPropsType = {
    canvasWidth: canvasWidth
  }

  
  return (
    <>
      <Flex className="h-full">
        <DndProvider backend={HTML5Backend}>
        <Flex flex={3}  id="real-canvas">
          <Container {...containerProps}/>
        </Flex>
        <Flex flex={1} id="widget-manager">
          <WidgetManager componentTypes={componentTypes}/>
        </Flex>
        </DndProvider>
      </Flex>
    </>
  )
}


export default Editor;