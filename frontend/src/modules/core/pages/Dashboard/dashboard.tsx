import { useEffect, useState } from 'react';
import { Button, Dropdown, Flex, Input, Typography, Image } from 'antd';
import { BsSunFill } from 'react-icons/bs';
import { FaRegEdit } from 'react-icons/fa';
import { TbDotsVertical } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../../shared/hooks/useAppDispatch';
import { items } from '../../constants/dashboard.constants';
import { appType } from '../../interfaces/dashboard.interface';
import { coreActions } from '../../reducers/core.reducer';
import dashboardImage from "../../../../assets/dashboard.svg"
import { IoMdAdd } from "react-icons/io";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [apps, setApps] = useState<appType[]>([
    { appId: '123', title: 'demo', versions: { '1': { version: 'v1', boxes: {} } }, userId: '456' },
    // { appId: '123', title: 'demo', versions: { '1': { version: 'v1', boxes: {} } }, userId: '456' }
  ]);

  useEffect(() => {
    dispatch(coreActions.changeTitle('All Apps'));
  }, []);

  return (
    <>
      <Flex className="h-full w-full">
        <Flex vertical flex={4}>
          <Flex flex={1} justify="center" className="p-10">
            <Button type="primary" size="large" className="mr-4 flex items-center">
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
              <Flex justify="center" className='w-full h-[80%]'>
              <Flex align="flex-end" justify='center' vertical className="w-full" flex={1}>
                <h1 className="text-primary text-4xl">Welcome to your new Workspace!</h1>
                <p className='text-xl'>You can get started by creating a new application</p>
                <Button className="mt-10 flex items-center" type='primary' size='large'><IoMdAdd className="text-xl mr-1"/>Create New App</Button>
              </Flex>
              <Flex flex={1} justify='center' align='center' className='hidden lg:block'>
                <Image width={500} src={dashboardImage} preview={false} alt='Create app image' className='mt-6'/>
              </Flex>
              </Flex>
            )}
            {apps.length !== 0 &&
              apps.map((item, ind) => {
                return (
                  <Flex
                    key={ind}
                    vertical
                    justify="space-between"
                    className="border-solid border-[1px] border-borderColor h-fit w-[22%] p-4 rounded-lg"
                  >
                    <Flex justify="space-between">
                      <Flex className="w-fit p-2.5 rounded-md bg-secondary mb-4">
                        <BsSunFill className="text-3xl text-primary" />
                      </Flex>
                      <Dropdown menu={{ items }} placement="bottomLeft" arrow trigger={['click']}>
                        <TbDotsVertical className="text-xl text-primary cursor-pointer" />
                      </Dropdown>
                    </Flex>
                    <Typography.Text className="text-lg font-semibold">
                      {item.title}
                    </Typography.Text>
                    <Button
                      className="my-1 w-[50%]"
                      type="primary"
                      onClick={() => navigate(`/editor?appId=${item.appId}`)}
                    >
                      <FaRegEdit />
                      Edit
                    </Button>
                  </Flex>
                );
              })}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Dashboard;
