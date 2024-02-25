import { createSlice } from '@reduxjs/toolkit';

import { setCookie, unsetCookie } from '../../core/utils/authUtils';
import { authApi } from '../../shared/apis/authApi';
import { AUTH_INITIAL_STATE } from '../constants';
import { type AuthState } from '../interfaces';
import { RootState } from '../shared/state';

const authSlice = createSlice({
  reducerPath: 'auth',
  name: 'auth',
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    login: (state: AuthState, action: any) => {
      state.loggedIn = true;
      state.user = action.payload;
      setCookie('accessToken', action.payload.token);
    },
    logout: (state: AuthState) => {
      state.loggedIn = false;
      unsetCookie('accessToken');
    },
    setUser: (state: AuthState, action: any) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload;
        setCookie('accessToken', action.payload.token);
        state.loggedIn = true;
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
        state.user = action.payload;
        setCookie('accessToken', action.payload.token);
        state.loggedIn = true;
      })
      .addMatcher(authApi.endpoints.handleInvitation.matchFulfilled, (state, action) => {
        state.user = action.payload;
        setCookie('accessToken', action.payload.token);
        state.loggedIn = true;
      });
  }
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice;
