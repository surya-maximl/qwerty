import { combineReducers } from '@reduxjs/toolkit';

import editorReducer from '../../../core/reducers/editor.reducer';
import authReducer from '../../reducers/auth.reducer';
import baseApi from '../apis/baseApi';

const reducers = combineReducers({
  [editorReducer.reducerPath]: editorReducer.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [authReducer.reducerPath]: authReducer.reducer
});

export default reducers;
