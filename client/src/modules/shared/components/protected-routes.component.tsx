import { Navigate, Outlet } from 'react-router-dom';

import AuthPageLayout from '../../authentication/components/AuthPageLayout/AuthPageLayout.componet';
import { useAuth } from '../hooks/useAuth';

type ProtectedRoutesProps = {
  isAuthRoute?: boolean;
};

export function ProtectedRoutes({ isAuthRoute = false }: ProtectedRoutesProps): JSX.Element {
  const { loggedIn } = useAuth();

  console.log('isLofasdfadf', loggedIn);

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
