import React, { useEffect, useState } from 'react';
import { Button, Flex, Input, Modal } from 'antd';
import { appIcons } from '../../constants/dashboard.constants';

const App: React.FC = ({
  open,
  setOpen,
  renameApp,
  newAppName,
  setNewAppName,
  id,
  method,
  handleCreateApp,
  changeIcon
}) => {
  const [selectedIcon, setSelectedIcon] = useState('email');

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(method === 'changeIcon') {
      changeIcon(id);
    }
  }, [newAppName]);

  let footer = null;
  if (method === 'renameApp')
    footer = [
      <Button key="back" type="primary" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button onClick={() => renameApp(id)}>Rename</Button>
    ];
  else if (method === 'createApp')
    footer = [
      <Button key="back" type="primary" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button onClick={() => handleCreateApp()}>Create App</Button>
    ];
  else
    footer = [
      <Button key="back" type="primary" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button onClick={() => setNewAppName(selectedIcon)}>
        Change</Button>
    ];

  let title = '';
  if (method === 'createApp') title = 'Create App';
  if (method === 'renameApp') title = 'Rename App';
  if (method === 'changeIcon') title = 'Change Icon';

  

  return (
    <Modal open={open} title={title} onCancel={handleCancel} footer={footer}>
      {method === 'createApp' && (
        <Input placeholder="Enter new name" onChange={(e) => setNewAppName(e.target.value)} />
      )}
      {method === 'renameApp' && (
        <Input placeholder="Enter name" onChange={(e) => setNewAppName(e.target.value)} />
      )}
      {method === 'changeIcon' && (
        <>
          <Flex className="w-full gap-y-3" justify="space-between" wrap="wrap">
            {appIcons.map((item, ind) => {
              return (
                <Flex
                  className={`w-[30%] text-5xl border-solid border-border border-[1px] py-8 hover:bg-secondary text-primary ${
                    selectedIcon === item.name && 'bg-secondary'
                  }`}
                  justify="center"
                  align="center"
                  key={ind}
                  onClick={() => setSelectedIcon(item.name)}
                >
                  {item.icon}
                </Flex>
              );
            })}
          </Flex>
        </>
      )}
    </Modal>
  );
};

export default App;
