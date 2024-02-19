import React from 'react';
import { Layout, Typography } from 'antd';

import Profile from '../Profile/Profile';

import { useAppSelector } from '../../../shared/hooks/useAppSelector';

const { Header } = Layout;
const APP_TITLE: string = import.meta.env.VITE_APP_TITLE;

const AppHeader: React.FC = () => {
  const title = useAppSelector((state) => state.core.title);
  return (
    <Header className="flex flex-row h-12 px-4 bg-white justify-between items-center border-[1px] border-t-0 border-l-0 border-r-0 border-solid border-slate-500">
      <Typography.Text className="text-xl font-semibold text-black">{title}</Typography.Text>
      <Profile />
    </Header>
  );
};

export default AppHeader;
