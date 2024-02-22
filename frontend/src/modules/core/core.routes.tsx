import { RouteObject } from 'react-router-dom';

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
      { index: true, element: <Dashboard /> },
      { path: 'editor', element: <Editor /> }
    ]
  }
];
