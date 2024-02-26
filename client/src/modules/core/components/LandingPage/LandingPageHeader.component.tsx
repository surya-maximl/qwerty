import { Button, Flex, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../shared/hooks/useAuth';

const { Header } = Layout;

const LandingPageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { loggedIn } = useAuth();

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
    <Header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex w-full items-center justify-center border-0 border-b-[1px] border-solid border-border backdrop-blur">
      <Flex className="container w-full" justify="space-between" align="center">
        <Flex justify="center" align="center">
          <img src="/favicon.ico" className="h-9 w-9 rounded-lg" alt="logo" />
        </Flex>
        <Flex className="items-center gap-4">
          {loggedIn ? (
            <>
              <Button type="primary" onClick={navigateToAppPage}>
                Go to App
              </Button>
            </>
          ) : (
            <>
              <Button type="dashed" onClick={navigateToSignupPage}>
                Signup
              </Button>
              <Button type="primary" onClick={navigateToLoginPage}>
                Login
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Header>
  );
};

export default LandingPageHeader;
