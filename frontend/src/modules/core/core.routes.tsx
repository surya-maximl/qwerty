// import { Navigate } from 'react-router-dom';

import { RootError } from '../shared/components/route-error';
import Dashboard from './pages/Dashboard/dashboard';
import Editor from './pages/Editor/editor';
import Home from './pages/Home/Home';
import ProfilePage from './pages/ProfileSettings/ProfileSettings';

export const CoreRoutes = [
  {
    path: '',
    element: <Home />,
    errorElement: <RootError />,
    children: [
      // { index: true, element: <Navigate to="/profile" replace /> },
      // { path: 'dashboard', lazy: () => import('./dashboard') },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'editor', element: <Editor/>},
      { path: 'app', element: <Dashboard/>}
    ]
  }
];
