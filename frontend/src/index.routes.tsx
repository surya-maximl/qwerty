import { createElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthRoutes } from './modules/authentication/auth.routes';
import { CoreRoutes } from './modules/core/core.routes';
import appUrlConfigurator from './modules/core/utils/appUrlResolverHelper';

// const router = createBrowserRouter([
//   {
//     path: '',
//     element: <CoreRouter />,
//     errorElement: <RootError />
//     children: [
//       { index: true, element: <Navigate to="/dashboard" replace /> },
//       { path: 'dashboard', lazy: () => import('./dashboard') },
//       { path: 'tasks', lazy: () => import('./tasks') },
//       { path: 'messages', lazy: () => import('./messages') }
//     ]
//   }
//     {
//       path: '',
//       element: <BaseLayout />,̥
//       errorElement: <RootError />,
//       children: [
//         { index: true, element: <Navigate to="/login" replace /> },
//         { path: 'login', lazy: () => import('./login') },
//         { path: 'privacy', lazy: () => import('./privacy') },
//         { path: 'terms', lazy: () => import('./terms') }
//       ]
//     }
// ]);

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
appUrlConfigurator.setBaseHrefAndTenantCode();
console.log('After Base Href Set ', appUrlConfigurator.getBaseHref());
const router = createBrowserRouter([...CoreRoutes, ...AuthRoutes], {
  basename: appUrlConfigurator.getBaseHref()
});

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot != null) {
  import.meta.hot.dispose(() => {
    router.dispose();
  });
}
