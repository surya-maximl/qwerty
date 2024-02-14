import { RootError } from '../shared/components/route-error';
import Login from './pages/Login/Login';

export const AuthRoutes = [
  {
    path: 'login',
    element: <Login />,
    errorElement: <RootError />
    //     children: [
    //       { index: true, element: <Navigate to="/login" replace /> },
    //       { path: 'login', lazy: () => import('./login') },
    //       { path: 'privacy', lazy: () => import('./privacy') },
    //       { path: 'terms', lazy: () => import('./terms') }
    //     ]
  }
];
