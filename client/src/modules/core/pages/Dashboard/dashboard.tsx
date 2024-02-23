import { useEffect, useState } from 'react';
import { Button, Dropdown, Flex, Image, Input, Layout, Typography } from 'antd';
import axios from 'axios';
import { BsSunFill } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { TbDotsVertical } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import dashboardImage from '../../../../assets/dashboard.svg';
import LeftPanel from '../../components/Editor/LeftPanel.component';
import { items } from '../../constants/dashboard.constants';
import { appType } from '../../interfaces/dashboard.interface';
import Modal from "../../components/Modal/Modal.component"



const Dashboard = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [apps, setApps] = useState<appType[]>([]);
  const [clickedId, setClickedId] = useState();
  const [refresh, setRefresh] = useState(false);
  const [createApp, setCreateApp] = useState(false);
  const token = localStorage.getItem('accessToken');

  const handleCreateApp = async () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/apps',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      data: { name: newAppName }
    };
    setEdit(false);
    setNewAppName("");
    axios
      .request(config)
      .then((response) => {
        setRefresh(prev => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
};

  useEffect(() => {
    const fetchAllApps = async () => {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/apps',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        try {
          const res = await axios.request(config);
          setApps(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    fetchAllApps();
  }, [refresh]);

  const renameApp = async (id: string) => {
    let data = { name: newAppName };

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `http://localhost:3000/apps/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGFyc2ggR3VwdGEiLCJpZCI6IjdhNWFmOGUxLTBjZjktNGQzMi05NTM0LWE2ZDg1ZjFjZDIxOSIsImlhdCI6MTcwODYzMDg3MiwiZXhwIjoxNzA4OTkwODcyfQ.Q4WRVzsw1b67pBq-JMJ-0ErCWo09M0UYFS8ID_OAvBc'
      },
      data: data
    };

    setEdit(false);
    setNewAppName("");
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setRefresh(prev => !prev)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeIcon = (id: string) => {
    let data = {
      icon: "icon2",
      id
    };

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `http://localhost:3000/apps/icon`,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGFyc2ggR3VwdGEiLCJpZCI6IjdhNWFmOGUxLTBjZjktNGQzMi05NTM0LWE2ZDg1ZjFjZDIxOSIsImlhdCI6MTcwODYzMDg3MiwiZXhwIjoxNzA4OTkwODcyfQ.Q4WRVzsw1b67pBq-JMJ-0ErCWo09M0UYFS8ID_OAvBc'
      },
      data: data
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setRefresh(prev => !prev)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const deleteApp = async (id: string) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://localhost:3000/apps/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${token}`
      }
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setRefresh(prev => !prev)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleDropdownClick = (e, id) => {
    if(e.key==='1') {
      setCreateApp(false);
      setClickedId(id)
      setEdit(true);
    } else if(e.key==='2') {

    } else if(e.key==='3') {
      deleteApp(id);
    }
  }

  const { Content } = Layout;

  return (
    <Layout className="min-h-screen">
      <LeftPanel />
      <Modal renameApp={renameApp} handleCreateApp={handleCreateApp} setNewAppName={setNewAppName} open={edit} setOpen={setEdit} id={clickedId} createApp={createApp}/>
      <Content>
        <Flex className="h-full " vertical flex={4}>
          <Flex flex={1} justify="center" className="p-10">
            <Button
              type="primary"
              size="large"
              className="mr-4 flex items-center"
              onClick={() => {
                setCreateApp(true);
                setEdit(true)}}
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
                      <Flex className="w-fit p-2.5 rounded-md bg-secondary mb-4" onClick={() => changeIcon(item?.id)}>
                        <BsSunFill className="text-3xl text-primary" />
                      </Flex>
                      <Dropdown menu={{ onClick: (e) => handleDropdownClick(e, item?.id), items }} placement="bottomLeft" arrow trigger={['click']}>
                        <TbDotsVertical className="text-xl text-primary cursor-pointer" />
                      </Dropdown>
                      
                    </Flex>
                    <Typography.Text
                      className="text-lg font-semibold"
                    >
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
