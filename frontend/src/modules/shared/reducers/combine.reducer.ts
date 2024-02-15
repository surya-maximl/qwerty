import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../../authentication/reducers/auth.reducer';
import editorSlice from '../../core/reducers/editor.reducer';
import baseApi from '../apis/baseApi';
import coreSlice from '../../core/reducers/core.reducer';

const reducers = combineReducers({
  [editorSlice.reducerPath]: editorSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [authReducer.reducerPath]: authReducer.reducer,
  [coreSlice.reducerPath]: coreSlice.reducer
});

export default reducers;
