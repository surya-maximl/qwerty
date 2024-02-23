import { configureStore } from '@reduxjs/toolkit';

import apiSlice from '../apis/baseApi';
import reducers from '../reducers/combine.reducer';

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
