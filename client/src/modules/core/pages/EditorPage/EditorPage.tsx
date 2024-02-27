import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import EditorCanvas from '../../components/Editor/EditorCanvas/EditorCanvas.component';
import EditorHeader from '../../components/Editor/EditorHeader.component';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import RightPanel from '../../components/Editor/RightPanel.component';

const EditorPage: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState(0);

  function getCanvasWidth() {
    const canvasBoundingRect = document
      .getElementsByClassName('real-canvas')[0]
      ?.getBoundingClientRect();

    const _canvasWidth = canvasBoundingRect?.width;
    return _canvasWidth;
  }

  useEffect(() => {
    setCanvasWidth(getCanvasWidth());
    window.addEventListener('resize', () => setCanvasWidth(getCanvasWidth()));
  }, [canvasWidth]);

  return (
    <Layout className="min-h-screen">
      <DndProvider backend={HTML5Backend}>
        <LeftPanel showMenu />
        <Layout>
          <EditorHeader />
          <EditorCanvas canvasWidth={canvasWidth} />
        </Layout>
        <RightPanel />
      </DndProvider>
    </Layout>
  );
};

export default EditorPage;
