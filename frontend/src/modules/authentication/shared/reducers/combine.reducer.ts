import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../../../authentication/reducers/auth.reducer';
import baseApi from '../apis/baseApi';
import editorReducer from "../../../core/reducers/editor.reducer";

const reducers = combineReducers({
  [editorReducer.reducerPath]: editorReducer.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [authReducer.reducerPath]: authReducer.reducer,
});

export default reducers;
