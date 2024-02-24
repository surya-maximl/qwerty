import { useEffect, useState } from 'react';
import { Button, Dropdown, Flex, Image, Input, Layout, Typography } from 'antd';
import axios from 'axios';
import { FaRegEdit } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { TbDotsVertical } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import dashboardImage from '../../../../assets/dashboard.svg';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import Modal from '../../components/Modal/Modal.component';
import RenderIcon from '../../components/RenderIcon/RenderIcon.component';
import { items } from '../../constants/dashboard.constants';
import { appType } from '../../interfaces/dashboard.interface';
import { getCookie } from '../../utils/authUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [apps, setApps] = useState<appType[]>([]);
  const [clickedId, setClickedId] = useState();
  const [refresh, setRefresh] = useState(false);
  const [method, setMethod] = useState('');
  const [token, setToken] = useState('');

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
    fetchAllApps();
  }, [refresh, token]);

  const renameApp = async (id: string) => {
    let data = { name: newAppName };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    setOpen(false);
    setNewAppName('');
    try {
      const res = await axios.patch(`http://localhost:3000/apps/${id}`, data, { headers });
      setRefresh((prev) => !prev);
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
  }
  const handleDropdownClick = (e, id) => {
    if (e.key === '1') {
      handleAppEvents('renameApp', id);
    } else if (e.key === '2') {
      handleAppEvents('changeIcon', id);
    } else if (e.key === '3') {
      deleteApp(id);
    }
  };

  const { Content } = Layout;

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
            <Input.Search
              placeholder="search apps"
              allowClear
              style={{ width: '50%' }}
              size="large"
            />
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
              apps.map((item, ind) => {
                return (
                  <Flex
                    key={item?.id}
                    vertical
                    justify="space-between"
                    className="border-solid border-[1px] border-borderColor h-fit w-[22%] p-4 rounded-lg"
                  >
                    <Flex justify="space-between">
                      <Flex className="w-fit p-2.5 rounded-md bg-secondary mb-4">
                        <RenderIcon name={item.icon} />
                      </Flex>
                      <Dropdown
                        menu={{ onClick: (e) => handleDropdownClick(e, item?.id), items }}
                        placement="bottomLeft"
                        arrow
                        trigger={['click']}
                      >
                        <TbDotsVertical className="text-xl text-primary cursor-pointer" />
                      </Dropdown>
                    </Flex>
                    <Typography.Text className="text-lg font-semibold">
                      {item?.name}
                    </Typography.Text>
                    <Button
                      className="my-1 w-[50%]"
                      type="primary"
                      onClick={() => navigate(`/app/editor/${item?.id}`)}
                    >
                      <FaRegEdit />
                      Edit
                    </Button>
                  </Flex>
                );
              })}
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
};

export default Dashboard;
