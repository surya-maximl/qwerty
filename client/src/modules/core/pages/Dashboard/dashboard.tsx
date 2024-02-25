import { useEffect, useState } from 'react';
import { App, Button, Card, Dropdown, Flex, Input, Layout, Skeleton, Typography } from 'antd';
import axios from 'axios';
import { FaRegEdit } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { TbDotsVertical } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import {
  useCreateAppMutation,
  useGetAllAppsQuery,
  useRenameAppMutation
} from '../../../shared/apis/appApi';
import { useAuth } from '../../../shared/hooks/useAuth';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import Modal from '../../components/Modal/Modal.component';
import RenderIcon from '../../components/RenderIcon/RenderIcon.component';
import { items } from '../../constants/dashboard.constants';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [clickedId, setClickedId] = useState();
  const [refresh, setRefresh] = useState(false);
  const [method, setMethod] = useState('');
  const [token, setToken] = useState('');
  const { message } = App.useApp();
  const [createNewApp] = useCreateAppMutation();
  const [renameAppMutation] = useRenameAppMutation();

  const handleCreateApp = async () => {
    createNewApp(newAppName);
    setNewAppName('');
    setOpen(false);
  };

  const { user } = useAuth();

  const renameApp = (id: string) => {
    renameAppMutation({
      appId: id,
      appName: newAppName
    });
    setOpen(false);
    setNewAppName('');
  };

  const changeIcon = async (id: string) => {
    let data = {
      icon: newAppName,
      id
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    setOpen(false);

    try {
      const res = await axios.put('http://localhost:3000/apps/icon', data, { headers });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteApp = async (id: string) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    try {
      const res = await axios.delete(`http://localhost:3000/apps/${id}`, { headers });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAppEvents = (method: string, id: string) => {
    setMethod(method);
    setClickedId(id);
    setOpen(true);
  };

  const handleDropdownClick = (e, id) => {
    if (e.key === '1') {
      handleAppEvents('renameApp', id);
    } else if (e.key === '2') {
      handleAppEvents('changeIcon', id);
    } else if (e.key === '3') {
      deleteApp(id);
    }
  };

  const { data: apps = [], isLoading, isFetching, isError, error } = useGetAllAppsQuery();

  useEffect(() => {
    if (isError) {
      message.error(error.data.message);
    }
  }, [isError, error]);

  return (
    <Layout className="min-h-screen">
      <LeftPanel />
      <Modal
        renameApp={renameApp}
        handleCreateApp={handleCreateApp}
        changeIcon={changeIcon}
        setNewAppName={setNewAppName}
        newAppName={newAppName}
        open={open}
        setOpen={setOpen}
        id={clickedId}
        method={method}
      />
      <Content>
        <Flex vertical className="h-full" gap="large">
          <Flex justify="center" className="p-4 py-8 gap-4">
            <Card className="border-border shadow-sm">
              <Flex align="center" justify="center" gap="middle">
                <Button type="primary" icon={<IoMdAdd />} onClick={() => setOpen(true)}>
                  Create App
                </Button>
                <Input.Search placeholder="Search apps" allowClear className="w-full max-w-md" />
              </Flex>
            </Card>
          </Flex>

          <Flex vertical className="p-4 md:px-20 w-full">
            {isLoading && isFetching ? (
              <Flex className="w-full grid grid-cols-2 sm:grid-cols-4 gap-10">
                <Skeleton.Button active className="!w-full !h-32" />
                <Skeleton.Button active className="!w-full !h-32" />
                <Skeleton.Button active className="!w-full !h-32" />
                <Skeleton.Button active className="!w-full !h-32" />
                <Skeleton.Button active className="!w-full !h-32" />
              </Flex>
            ) : apps.length === 0 ? (
              <Card className="shadow-sm border-border py-10">
                <Flex vertical align="center" justify="center" className="w-full">
                  <Title className="!font-extrabold tracking-tight">
                    Welcome to your new Workspace!
                  </Title>
                  <Paragraph className="text-xl text-secondary">
                    You can get started by creating a new application
                  </Paragraph>
                  <Button type="primary" icon={<IoMdAdd />} className="mt-4">
                    Create New App
                  </Button>
                </Flex>
              </Card>
            ) : (
              <Flex className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {apps.map((item) => (
                  <Card key={item?.id} className="border-border shadow-sm shrink-0">
                    <Flex vertical className="gap-8">
                      <Flex justify="space-between" align="center" className="w-full">
                        <Flex className="h-6 w-6 rounded-md bg-secondary/40">
                          {/* TODO: Some error in this component */}
                          <RenderIcon name={item.icon} />
                        </Flex>
                        <Dropdown
                          menu={{ onClick: (e) => handleDropdownClick(e, item?.id), items }}
                          placement="bottomLeft"
                          arrow
                          trigger={['click']}
                        >
                          <Button
                            icon={<TbDotsVertical className="text-lg mt-[1.5px] ml-[0.5px]" />}
                          />
                        </Dropdown>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Typography.Text className="text-lg font-semibold">
                          {item?.name}
                        </Typography.Text>
                        <Button
                          type="primary"
                          className="px-6"
                          icon={<FaRegEdit />}
                          onClick={() => navigate(`/app/editor/${item?.id}`)}
                        >
                          Edit
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
};

export default Dashboard;
