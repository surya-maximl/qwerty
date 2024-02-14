import React from 'react';
import { Layout, Typography } from 'antd';

import Profile from '../Profile/Profile';

import './Header.scss';

const { Header } = Layout;
const APP_TITLE: string = import.meta.env.VITE_APP_TITLE;

const AppHeader: React.FC = () => {
  return (
    <Header className="flex flex-row h-12 px-4 bg-white justify-between items-center">
      <Typography.Text className="text-xl font-semibold text-black">{APP_TITLE}</Typography.Text>
      <Profile />
    </Header>
  );
};

export default AppHeader;
