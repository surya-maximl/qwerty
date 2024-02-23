import React from 'react';
import { Button, Flex, Layout, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import hero from '../../../../assets/hero.png';
import LandingPageHeader from '../../components/LandingPage/LandingPageHeader.component';

const Home: React.FC = () => {
  const navigate = useNavigate();

  function navigateToAppPage() {
    navigate('/app');
  }

  const { Content } = Layout;
  const { Title, Paragraph } = Typography;

  return (
    <Flex className="min-h-screen flex-col relative overflow-hidden bg-blue-200">
      <LandingPageHeader />
      <Content>
        <Flex vertical className="w-full p-4 py-16" align="center">
          <Flex vertical align="center" className="w-full max-w-xl text-center">
            <Title className="!font-extrabold !text-5xl">
              Rapid internal tool development platform
            </Title>
            <Paragraph className="leading-7 font-normal tracking-wide">
              Create custom internal tools quickly and easily, with less code and fewer resources.
              Boost productivity, cut costs, and deploy your tools faster, all while ensuring
              enterprise-grade security.
            </Paragraph>
            <Button size="large" type="primary" onClick={navigateToAppPage}>
              Get Started
            </Button>
          </Flex>
          <img src={hero} className="object-contain w-3/4 rounded-xl absolute -bottom-64" />
        </Flex>
      </Content>
    </Flex>
  );
};

export default Home;
