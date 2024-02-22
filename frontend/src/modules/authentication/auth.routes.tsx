import { RouteObject } from 'react-router-dom';

import { ProtectedRoutes } from '../shared/components/protected-routes.component';
import { RootError } from '../shared/components/route-error';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

export const AuthRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: <ProtectedRoutes />,
    errorElement: <RootError />,
    children: [
      {
        path: 'login',
        element: <Login />,
        errorElement: <RootError />
      },
      {
        path: 'signup',
        element: <Signup />,
        errorElement: <RootError />
      }
    ]
  }
];
