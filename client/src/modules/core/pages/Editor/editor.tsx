import { useEffect, useState } from 'react';
import { Flex, Layout } from 'antd';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

import Container from '../../components/Container/container.component';
import EditorHeader from '../../components/Editor/EditorHeader.component';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import RightPanel from '../../components/Editor/RightPanel.component';
import { getCookie } from '../../utils/authUtils';

const Editor: React.FC = () => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const { id } = useParams();
  const [app, setApp] = useState([]);

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
  const token = getCookie('accessToken');

  const fetchApp = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    try {
      const res = await axios.get(`http://localhost:3000/apps/${id}`, { headers });
      setApp(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApp();
  }, []);

  const { Content } = Layout;

  return (
    <>
      <Layout className="min-h-screen">
        <DndProvider backend={HTML5Backend}>
          <LeftPanel showMenu />
          <Layout>
            <EditorHeader name={app.name} />
            <Content>
              <Flex className="h-full w-full" id="real-canvas">
                <Container {...containerProps} />
              </Flex>
            </Content>
            {/* <QueryPanel /> */}
          </Layout>
          <RightPanel />
        </DndProvider>
      </Layout>
    </>
  );
};

export default Editor;
