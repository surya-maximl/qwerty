import { useEffect, useState } from 'react';
import { App, Button, Card, Dropdown, Flex, Input, Layout, Skeleton, Typography } from 'antd';
import Fuse from 'fuse.js';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdDriveFileRenameOutline, MdOutlineChangeCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import {
  useChangeIconMutation,
  useCreateAppMutation,
  useDeleteAppMutation,
  useGetAllAppsQuery,
  useRenameAppMutation
} from '../../../shared/apis/appApi';
import AppCard from '../../components/AppCard/AppCard.component';
import DashboardHeader from '../../components/Dashboard/DashboardHeader.component';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import Modal from '../../components/Modal/Modal.component';
import UserInfoModal from '../../components/Modal/UserInfoModal.component';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [selectedApp, setSelectedApp] = useState('');
  const [clickedId, setClickedId] = useState();
  const [method, setMethod] = useState('');
  const { message } = App.useApp();
  const [createNewApp, { isLoading: isAppCreating }] = useCreateAppMutation();
  const [renameAppMutation, { isLoading: isAppRenaming }] = useRenameAppMutation();
  const [deleteAppMutation] = useDeleteAppMutation();
  const [changeIconMutation, { isLoading: isIconLoading }] = useChangeIconMutation();
  const [filteredApps, setFilteredApps] = useState<appType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userInfoOpen, setUserInfoOpen] = useState(false);

  const navigate = useNavigate();

  const handleCreateApp = async () => {
    createNewApp(newAppName)
      .unwrap()
      .then(() => {
        setNewAppName('');
        setOpen(false);
      }).catch((err) => {
        message.error(err.data.message);
      })
  };

  const renameApp = (id: string) => {
    if(newAppName==="") {
      message.error("Please enter a valid name!");
      return;
    }
    renameAppMutation({
      appId: id,
      appName: newAppName
    })
      .unwrap()
      .then(() => {
        setNewAppName('');
        setOpen(false);
      });
  };

  const changeIcon = async (id: string) => {
    setSelectedApp(id);
    changeIconMutation({ icon: newAppName, id })
      .unwrap()
      .then(() => {
        setSelectedApp('');
        setOpen(false);
      });
  };

  const deleteApp = async (id: string) => {
    setSelectedApp(id);
    deleteAppMutation(id)
      .unwrap()
      .then(() => {
        setSelectedApp('');
      });
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
              <Flex align="center" justify="space-between" className="cursor-default">
                <Flex className="cursor-pointer" onClick={() => navigate(`/app/editor/${item.id}`)}>
                  <Paragraph className="text-md !m-0 font-semibold text-foreground/80">
                    {item?.name}
                  </Paragraph>
                </Flex>
                <Flex align="center" className="gap-3">
                  <Flex
                    className="cursor-pointer p-0 text-xl font-semibold text-mutedForeground hover:text-foreground"
                    onClick={() => handleAppEvents('renameApp', item.id)}
                  >
                    <MdDriveFileRenameOutline />
                  </Flex>
                  <Flex
                    className="cursor-pointer p-0 text-xl font-semibold text-mutedForeground hover:text-foreground"
                    onClick={() => handleAppEvents('changeIcon', item.id)}
                  >
                    <MdOutlineChangeCircle />
                  </Flex>
                  <Flex
                    className="cursor-pointer p-0 text-xl font-semibold text-[#ff7875] hover:text-[#f5222d]"
                    onClick={() => deleteApp(item.id)}
                  >
                    <MdDelete />
                  </Flex>
                </Flex>
              </Flex>
            )
          };
        })
      : [
          {
            key: '1',
            label: (
              <Paragraph className="text-md text-md !m-0 font-semibold text-mutedForeground">
                No apps match your search!
              </Paragraph>
            ),
            disabled: true
          }
        ];

  return (
    <Layout className="min-h-screen">
      <UserInfoModal setOpen={setUserInfoOpen} open={userInfoOpen} />
      <Modal
        isAppCreating={isAppCreating}
        isAppRenaming={isAppRenaming}
        isIconLoading={isIconLoading}
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
        <DashboardHeader setOpen={setUserInfoOpen} />
        <Content className="bg-background/5">
          <Flex vertical className="h-full" gap="large">
            <Flex align="center" justify="center" className="gap-5 p-4 py-8">
              <Button
                type="primary"
                className="flex items-center gap-1"
                size="large"
                onClick={() => {
                  setMethod('createApp');
                  setOpen(true);
                }}
              >
                <IoMdAdd className="mb-[1px] text-xl" />
                Create App
              </Button>
              <Dropdown menu={{ items }} open={searchQuery !== ''}>
                <Input.Search
                  placeholder="Search Apps"
                  allowClear
                  className="w-full max-w-md"
                  value={searchQuery}
                  size="large"
                  onChange={(e) => handleSearchQueryChange(e)}
                />
              </Dropdown>
            </Flex>

            <Flex vertical className="w-full p-4 md:px-20">
              {isLoading && isFetching ? (
                <Flex className="grid w-full grid-cols-2 gap-10 sm:grid-cols-4">
                  <Skeleton.Button active className="!h-32 !w-full" />
                  <Skeleton.Button active className="!h-32 !w-full" />
                  <Skeleton.Button active className="!h-32 !w-full" />
                  <Skeleton.Button active className="!h-32 !w-full" />
                  <Skeleton.Button active className="!h-32 !w-full" />
                </Flex>
              ) : apps.length === 0 ? (
                <Card className="border-border py-10 shadow-sm">
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
                <Flex className="grid w-full grid-cols-1 gap-10 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {apps.map((item) => (
                    <AppCard
                      key={item.id}
                      item={item}
                      handleDropdownClick={handleDropdownClick}
                      selectedApp={selectedApp}
                    />
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
