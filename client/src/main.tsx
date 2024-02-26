import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';

import { App, ConfigProvider } from 'antd';
import { Provider } from 'react-redux';

import { Router } from './index.routes.tsx';
import appUrlConfigurator from './modules/core/utils/appUrlResolverHelper.ts';
import { store } from './modules/shared/state/store.ts';
import { themeConfig } from './modules/shared/theme/theme.ts';

appUrlConfigurator.setBaseHrefAndTenantCode();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={themeConfig}>
        <App>
          <Router />
        </App>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
