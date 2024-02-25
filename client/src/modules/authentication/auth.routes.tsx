import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import { ProtectedRoutes } from '../shared/components/protected-routes.component';
import { RootError } from '../shared/components/route-error';
import SuspenseLoader from './components/SuspenseLoader/SuspenseLoader.component';

const Login = lazy(() => import('./pages/Login/Login'));
const Signup = lazy(() => import('./pages/Signup/Signup'));
const Invitations = lazy(() => import('./pages/Invitations/Invitations'));

export const AuthRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: <ProtectedRoutes isAuthRoute={true} />,
    errorElement: <RootError />,
    children: [
      {
        index: true,
        element: <Navigate to="login" />
      },
      {
        path: 'login',
        element: (
          <SuspenseLoader>
            <Login />
          </SuspenseLoader>
        )
      },
      {
        path: 'signup',
        element: (
          <SuspenseLoader>
            <Signup />
          </SuspenseLoader>
        )
      },
      {
        path: 'invitations/:invitationId',
        element: (
          <SuspenseLoader>
            <Invitations />
          </SuspenseLoader>
        )
      }
    ]
  }
];
