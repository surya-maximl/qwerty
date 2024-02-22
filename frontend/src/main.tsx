import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';

import { Provider } from 'react-redux';

import { Router } from './index.routes.tsx';
import appUrlConfigurator from './modules/core/utils/appUrlResolverHelper.ts';
import { store } from './modules/shared/state/store.ts';

appUrlConfigurator.setBaseHrefAndTenantCode();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
);
