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
    <Header className="flex items-center w-full">
      <Flex className="w-full" justify="space-between" align="center">
        <Flex justify="center" align="center">
          <img src="https://assets-global.website-files.com/6266634263b9179f76b2236e/642ea2f14ccdf8b44f4454dd_ToolJet%20logo.svg" />
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
    </Header>
  );
};

export default LandingPageHeader;
