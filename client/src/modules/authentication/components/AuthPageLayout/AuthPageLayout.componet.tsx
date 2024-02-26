import { Flex, Layout } from 'antd';
import { Link } from 'react-router-dom';

type AuthPageLayoutProps = {
  children: JSX.Element;
};

const { Content, Header } = Layout;

function AuthPageLayout({ children }: AuthPageLayoutProps): JSX.Element {
  return (
    <Layout className="relative min-h-screen">
      <Header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex w-full items-center justify-center border-0 border-b-[1px] border-solid border-border bg-white backdrop-blur">
        <Link to="/" className="flex items-center">
          <img
            className="h-8 w-8 rounded-md object-contain"
            src="/favicon.ico"
            alt="Tooljet Logo"
          />
        </Link>
      </Header>
      <Content className="bg-background/40 p-4">
        <Flex className="items-center justify-center">{children}</Flex>
      </Content>
    </Layout>
  );
}

export default AuthPageLayout;
