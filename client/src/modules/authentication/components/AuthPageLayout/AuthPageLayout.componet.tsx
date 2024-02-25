import { Flex } from 'antd';
import { Link } from 'react-router-dom';

type AuthPageLayoutProps = {
  children: JSX.Element;
};

function AuthPageLayout({ children }: AuthPageLayoutProps): JSX.Element {
  return (
    <Flex className="min-h-screen relative flex-col p-4" justify="center" align="center">
      <Flex className="items-center justify-center bg-white w-full fixed top-0 p-4 z-10">
        <Link to="/">
          <img
            className="object-contain h-7 w-7"
            src="https://app.tooljet.com/logo.svg"
            alt="Tooljet Logo"
          />
        </Link>
      </Flex>
      {children}
    </Flex>
  );
}

export default AuthPageLayout;
