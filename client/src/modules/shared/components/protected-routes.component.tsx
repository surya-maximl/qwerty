import { useEffect } from 'react';
import { App, message } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';

import AuthPageLayout from '../../authentication/components/AuthPageLayout/AuthPageLayout.componet';
import { useFetchUserDetailsQuery } from '../apis/authApi';
import { useAuth } from '../hooks/useAuth';

type ProtectedRoutesProps = {
  isAuthRoute?: boolean;
};

export function ProtectedRoutes({ isAuthRoute = false }: ProtectedRoutesProps): JSX.Element {
  const { loggedIn } = useAuth();
  const { message } = App.useApp();
  const { isError, error } = useFetchUserDetailsQuery();

  useEffect(() => {
    if (isError) {
      message.error(error.data.message);
    }
  }, [isError, error]);

  if (isAuthRoute) {
    return !loggedIn ? (
      <AuthPageLayout>
        <Outlet />
      </AuthPageLayout>
    ) : (
      <Navigate to="/app" replace />
    );
  } else {
    return loggedIn ? <Outlet /> : <Navigate to="/auth/login" replace />;
  }
}
