import { createSlice } from '@reduxjs/toolkit';

import { AUTH_INITIAL_STATE } from '../constants';
import { RootState } from '../shared/state';


import { type AuthState } from '../interfaces';

const authSlice = createSlice({
  reducerPath: 'auth',
  name: 'auth',
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    login: (state: AuthState) => {
      // if (localStorage.getItem('accessToken') !== null) {
      //   state.loggedIn = true;
      // }
      state.loggedIn = true;
      localStorage.setItem('accessToken', '<access-token>')
    },
    logout: (state: AuthState) => {
      state.loggedIn = false;
      localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
    },
    // setUser: (state: AuthState, action: PayloadAction<any>) => {
    //   state.user = action.payload;
    // }
  }
});

export const { login, logout } = authSlice.actions;
export const selectAuth = (state:RootState) => state.auth;
export default authSlice;
