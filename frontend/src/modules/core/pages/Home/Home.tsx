import React from 'react';
import { Button, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../shared/hooks/useAuth';

const Home: React.FC = () => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  function navigateToLoginPage() {
    navigate('/auth/login');
  }

  function navigateToSignupPage() {
    navigate('/auth/signup');
  }

  function navigateToAppPage() {
    navigate('/app');
  }

  return (
    <Flex className="h-screen w-screen flex-col" justify="center" align="center" gap="large">
      <div className="text-xl">Landing Page</div>
      <Flex align="center" gap="middle">
        {loggedIn ? (
          <Flex className="flex-col" gap="small">
            <Typography>You are already logged in!</Typography>
            <Button type="primary" onClick={navigateToAppPage}>
              Go to App
            </Button>
          </Flex>
        ) : (
          <>
            <Button type="primary" onClick={navigateToLoginPage}>
              Login
            </Button>
            <Button type="default" onClick={navigateToSignupPage}>
              Signup
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Home;
