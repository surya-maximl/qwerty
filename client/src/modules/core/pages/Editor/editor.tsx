import { useEffect, useState } from 'react';
import { Flex, Layout } from 'antd';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import Container from '../../components/Container/container.component';
import EditorHeader from '../../components/Editor/EditorHeader.component';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import QueryPanel from '../../components/Editor/QueryPanel.components';
import RightPanel from '../../components/Editor/RightPanel.component';
import { coreActions } from '../../reducers/core.reducer';

const Editor: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(coreActions.changeTitle('Editor'));
  }, []);

  useEffect(() => {
    setCanvasWidth(getCanvasWidth());
    window.addEventListener('resize', () => setCanvasWidth(getCanvasWidth()));
  }, [canvasWidth]);

  const getCanvasWidth = () => {
    const canvasBoundingRect = document
      .getElementsByClassName('real-canvas')[0]
      ?.getBoundingClientRect();

    const _canvasWidth = canvasBoundingRect?.width;
    return _canvasWidth;
  };

  const containerProps: { canvasWidth: number } = {
    canvasWidth: canvasWidth
  };

  const { Content } = Layout;

  return (
    <>
      <Layout className="min-h-screen">
        <DndProvider backend={HTML5Backend}>
          <LeftPanel showProfile />
          <Layout>
            <EditorHeader />
            <Content>
              <Flex className="w-full h-full" id="real-canvas">
                <Container {...containerProps} />
              </Flex>
            </Content>
            <QueryPanel />
          </Layout>
          <RightPanel />
        </DndProvider>
      </Layout>
    </>
  );
};

export default Editor;
