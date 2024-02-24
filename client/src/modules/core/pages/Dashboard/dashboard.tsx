import { useEffect, useState } from 'react';
import { Button, Dropdown, Flex, Image, Input, Layout, Typography } from 'antd';
import axios from 'axios';
import Fuse from 'fuse.js';
import { IoMdAdd } from 'react-icons/io';
import { MdDelete, MdDriveFileRenameOutline, MdOutlineChangeCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import dashboardImage from '../../../../assets/dashboard.svg';
import AppCard from '../../components/AppCard/AppCard.component';
import DashboardHeader from '../../components/Dashboard/DashboardHeader.component';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import Modal from '../../components/Modal/Modal.component';
import { appType } from '../../interfaces/dashboard.interface';
import { getCookie } from '../../utils/authUtils';
import UserInfoModal from '../../components/Modal/UserInfoModal.component';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [apps, setApps] = useState<appType[]>([]);
  const [clickedId, setClickedId] = useState();
  const [refresh, setRefresh] = useState(false);
  const [method, setMethod] = useState('');
  const [token, setToken] = useState('');
  const [filteredApps, setFilteredApps] = useState<appType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userInfoOpen, setUserInfoOpen] = useState(false);

  const navigate = useNavigate();

  const handleCreateApp = async () => {
    const data = {
      name: newAppName
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    try {
      const res = await axios.post('http://localhost:3000/apps', data, { headers });
      setNewAppName('');
      setRefresh((prev) => !prev);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllApps = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/apps',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    try {
      const res = await axios.request(config);
      setApps(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setToken(getCookie('accessToken'));
  }, []);

  useEffect(() => {
    if (token !== '') {
      fetchAllApps();
    }
  }, [refresh, token]);

  const renameApp = async (id: string) => {
    let data = { name: newAppName };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    try {
      const res = await axios.patch(`http://localhost:3000/apps/${id}`, data, { headers });
      setRefresh((prev) => !prev);
      setNewAppName('');
      setOpen(false);
      setSearchQuery('');
    } catch (err) {
      console.log(err);
    }
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
      <UserInfoModal setOpen={setUserInfoOpen} open={userInfoOpen}/>
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
      <Layout>
        <LeftPanel />
        <Layout>
        <DashboardHeader setOpen={setUserInfoOpen} open={userInfoOpen}/>
          <Content>
            <Flex className="h-full " vertical flex={4}>
              <Flex flex={1} justify="center" className="p-10">
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
              <Flex className="gap-[4%] px-[4%]" flex={5} wrap="wrap">
                {apps.length === 0 && (
                  <Flex justify="center" className="w-full h-[80%]">
                    <Flex align="flex-end" justify="center" vertical className="w-full" flex={1}>
                      <h1 className="text-primary text-4xl">Welcome to your new Workspace!</h1>
                      <p className="text-xl">You can get started by creating a new application</p>
                      <Button className="mt-10 flex items-center" type="primary" size="large">
                        <IoMdAdd className="text-xl mr-1" />
                        Create New App
                      </Button>
                    </Flex>
                    <Flex flex={1} justify="center" align="center" className="hidden lg:block">
                      <Image
                        width={500}
                        src={dashboardImage}
                        preview={false}
                        alt="Create app image"
                        className="mt-6"
                      />
                    </Flex>
                  </Flex>
                )}
                {apps.length !== 0 &&
                  apps.map((item) => {
                    return <AppCard item={item} handleDropdownClick={handleDropdownClick} />;
                  })}
              </Flex>
            </Flex>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
