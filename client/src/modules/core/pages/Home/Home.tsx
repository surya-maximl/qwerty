import React from 'react';
import { Button, Flex, Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import hero from '../../../../assets/hero.png';
import LandingPageHeader from '../../components/LandingPage/LandingPageHeader.component';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  function navigateToAppPage() {
    navigate('/app');
  }

  return (
    <Layout className="min-h-screen overflow-hidden">
      <LandingPageHeader />
      <Content className="bg-background/90 flex justify-center">
        <Flex vertical className="container my-16 p-4" align="center">
          <Flex vertical align="center" className="relative w-full max-w-2xl pb-24 text-center">
            <Title className="!text-5xl !font-extrabold tracking-tight">
              <span className="whitespace-nowrap bg-gradient-to-r from-[#ff80b5] to-[#9089fc] bg-clip-text text-transparent transition duration-500 ease-in-out">
                Rapid
              </span>{' '}
              internal tool development platform
            </Title>
            <Paragraph className="text-mutedForeground text-base font-normal leading-7 tracking-wide">
              Create custom internal tools quickly and easily, with less code and fewer resources.
              Boost productivity, cut costs, and deploy your tools faster, all while ensuring
              enterprise-grade security.
            </Paragraph>
            <Button size="large" type="primary" onClick={navigateToAppPage}>
              Get Started
            </Button>
            <img src={hero} className="absolute -bottom-72 w-full rounded-xl object-contain" />
          </Flex>
        </Flex>
      </Content>
    </Layout>
  );
};

export default Home;
