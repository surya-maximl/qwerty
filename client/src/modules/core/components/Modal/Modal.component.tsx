import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';

const App: React.FC = ({ open, setOpen, renameApp, setNewAppName, id, createApp, handleCreateApp }) => {
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  let footer = null;
  if(!createApp) footer = [
    <Button key="back" type="primary" onClick={handleCancel}>Cancel</Button>,
    <Button onClick={() => renameApp(id)}>Rename</Button>
  ]
  else footer = [
    <Button key="back" type="primary" onClick={handleCancel}>Cancel</Button>,
    <Button onClick={() => handleCreateApp()}>Create App</Button>
  ]

  let title = "Rename App";
  if(createApp) title = "Create App";
  return (
    <Modal
        open={open}
        title={title}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={footer}
      >
        {!createApp && <Input placeholder="Enter new name" onChange={(e) => setNewAppName(e.target.value)} />}
        {createApp && <Input placeholder="Enter name" onChange={(e) => setNewAppName(e.target.value)} />}
      </Modal>
  );
};

export default App;
