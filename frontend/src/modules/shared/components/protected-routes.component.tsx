import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export function ProtectedRoutes(): JSX.Element {
  const { loggedIn } = useAuth();
  const { pathname } = useLocation();

  const isAuthRoute = pathname.split('/')[1] === 'auth';

  if (isAuthRoute) {
    return !loggedIn ? <Outlet /> : <Navigate to="/app" replace />;
  } else {
    return loggedIn ? <Outlet /> : <Navigate to="/auth/login" replace />;
  }
}
