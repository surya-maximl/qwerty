import { RouteObject } from 'react-router-dom';

import SuspenseLoader from '../authentication/components/SuspenseLoader/SuspenseLoader.component';
import { ProtectedRoutes } from '../shared/components/protected-routes.component';
import { RootError } from '../shared/components/route-error';
import Dashboard from './pages/Dashboard/dashboard';
import Editor from './pages/Editor/editor';
import Home from './pages/Home/Home';

export const CoreRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    errorElement: <RootError />
  },
  {
    path: 'app',
    element: <ProtectedRoutes />,
    errorElement: <RootError />,
    children: [
      {
        path: '',
        element: (
          <SuspenseLoader>
            <Dashboard />
          </SuspenseLoader>
        )
      },
      {
        path: ':id',
        element: (
          <SuspenseLoader>
            <Dashboard />
          </SuspenseLoader>
        )
      },
      {
        path: 'editor/:id',
        element: (
          <SuspenseLoader>
            <Editor />
          </SuspenseLoader>
        )
      }
    ]
  }
];
