import { useEffect, useState } from 'react';
import { App, Button, Card, Dropdown, Flex, Input, Layout, Skeleton, Typography } from 'antd';
import axios from 'axios';
import Fuse from 'fuse.js';
import { FaRegEdit } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdDriveFileRenameOutline, MdOutlineChangeCircle } from 'react-icons/md';
import { TbDotsVertical } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import {
  useCreateAppMutation,
  useGetAllAppsQuery,
  useRenameAppMutation
} from '../../../shared/apis/appApi';
import { useAuth } from '../../../shared/hooks/useAuth';
import DashboardHeader from '../../components/Dashboard/DashboardHeader.component';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import Modal from '../../components/Modal/Modal.component';
import UserInfoModal from '../../components/Modal/UserInfoModal.component';
import RenderIcon from '../../components/RenderIcon/RenderIcon.component';
import { appEvents } from '../../constants/dashboard.constants';
import AppCard from '../../components/AppCard/AppCard.component';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [clickedId, setClickedId] = useState();
  const [refresh, setRefresh] = useState(false);
  const [method, setMethod] = useState('');
  const [token, setToken] = useState('');
  const { message } = App.useApp();
  const [createNewApp] = useCreateAppMutation();
  const [renameAppMutation] = useRenameAppMutation();
  const [filteredApps, setFilteredApps] = useState<appType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userInfoOpen, setUserInfoOpen] = useState(false);

  const navigate = useNavigate();

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

    try {
      const res = await axios.put('http://localhost:3000/apps/icon', data, { headers });
      setRefresh((prev) => !prev);
      setOpen(false);
      setSearchQuery('');
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
      setSearchQuery('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleAppEvents = (method: string, id: string) => {
    console.log('handleappeventd');
    setMethod(method);
    setClickedId(id);
    setSearchQuery('');
    setOpen(true);
  };

  const handleDropdownClick = (e: any, id: string) => {
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

  const handleSearchQueryChange = (e: any) => {
    const { value } = e.target;
    setSearchQuery(value);
    filterComponents(value);
  };

  const filterComponents = (value: string) => {
    if (value !== '') {
      const fuse = new Fuse(apps, { keys: ['name'] });
      const results = fuse.search(value);
      setFilteredApps(results.map((result) => result.item));
    } else {
      setFilteredApps([]);
    }
  };

  const { Content } = Layout;

  let items =
    filteredApps.length > 0
      ? filteredApps.map((item) => {
          return {
            key: item.id,
            label: (
              <Flex align="center" className="cursor-default">
                <Flex flex={10} onClick={() => navigate(`/app/editor/${item.id}`)}>
                  <Typography className="text-md font-semibold text-primary">
                    {item?.name}
                  </Typography>
                </Flex>
                <Flex gap={10} flex={1}>
                  <Typography
                    className="p-0 text-xl font-semibold text-primary cursor-pointer hover:text-black"
                    onClick={() => handleAppEvents('renameApp', item.id)}
                  >
                    <MdDriveFileRenameOutline />
                  </Typography>
                  <Typography
                    className="p-0 text-xl font-semibold text-primary cursor-pointer hover:text-black"
                    onClick={() => handleAppEvents('changeIcon', item.id)}
                  >
                    <MdOutlineChangeCircle />
                  </Typography>
                  <Typography
                    className="p-0 text-xl font-semibold text-[#ff7875] cursor-pointer hover:text-[#f5222d]"
                    onClick={() => deleteApp(item.id)}
                  >
                    <MdDelete />
                  </Typography>
                </Flex>
              </Flex>
            )
          };
        })
      : [
          {
            key: '1',
            label: (
              <Typography className="text-md text-primary">No apps match your search!</Typography>
            ),
            disabled: true
          }
        ];

  return (
    <Layout className="min-h-screen">
      <UserInfoModal setOpen={setUserInfoOpen} open={userInfoOpen} />
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
        <LeftPanel />
      <Layout>
      <DashboardHeader setOpen={setUserInfoOpen} open={userInfoOpen} />
        <Content>
          <Flex vertical className="h-full" gap="large">
            <Flex justify="center" className="p-4 py-8 gap-4">
                  <Button
                    type="primary"
                    size="large"
                    className="mr-4 flex items-center"
                    onClick={() => {
                      setMethod('createApp');
                      setOpen(true);
                    }}
                  >
                    <IoMdAdd className="text-xl mr-1" />
                    Create App
                  </Button>
                  <Dropdown menu={{ items }} open={searchQuery !== ''}>
                    <Input.Search
                      placeholder="search apps"
                      allowClear
                      className="h-fit"
                      style={{ width: '50%' }}
                      size="large"
                      value={searchQuery}
                      onChange={(e) => handleSearchQueryChange(e)}
                    />
                  </Dropdown>
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
                    <Button
                      type="primary"
                      icon={<IoMdAdd />}
                      className="mt-4"
                      onClick={() => {
                        setMethod('createApp');
                        setOpen(true);
                      }}
                    >
                      Create New App
                    </Button>
                  </Flex>
                </Card>
              ) : (
                <Flex className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                  {apps.map((item) => (
                    <AppCard item={item} handleDropdownClick={handleDropdownClick}/>
                  ))}
                </Flex>
              )}
            </Flex>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
