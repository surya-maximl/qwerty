// import { useEffect } from 'react';
import { useEffect } from 'react';
import { Flex, Layout } from 'antd';
// import axios from 'axios';
import { Outlet } from 'react-router-dom';

import AppHeader from '../../components/Header/Header';
import LeftPane from '../../components/LeftPane/LeftPane';
import appUrlConfigurator from '../../utils/appUrlResolverHelper';

const { Content } = Layout;
const Home: React.FC = () => {
  // useEffect(() => {
  //   const accessToken: string = localStorage.getItem('accessToken') ?? '';
  //   if (!accessToken?.length) {
  //     window.location.replace(
  //       `${appUrlConfigurator.getAuthUrl()}/login?tenantCode=${appUrlConfigurator.getTenantCode()}`
  //     );
  //   }
  // }, []);
  return (
    <Flex className="h-screen w-screen">
      <Layout>
        <LeftPane items={[]} />
        <Layout className="bg-slate-100">
          <AppHeader />
          <Content className="bg-white m-1">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Flex>
  );
};

export default Home;
