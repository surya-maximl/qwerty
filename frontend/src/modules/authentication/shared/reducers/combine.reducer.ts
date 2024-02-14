import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../../../authentication/reducers/auth.reducer';
import baseApi from '../apis/baseApi';

const reducers = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [authReducer.reducerPath]: authReducer.reducer
});

export default reducers;
