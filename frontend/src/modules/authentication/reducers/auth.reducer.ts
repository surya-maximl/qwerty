import { createSlice } from '@reduxjs/toolkit';

import { AUTH_INITIAL_STATE } from '../constants';

// import { type AuthState } from '../interfaces';

const authSlice = createSlice({
  reducerPath: 'auth',
  name: 'auth',
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    // login: (state: AuthState, action: PayloadAction<any>) => {
    //   if (localStorage.getItem('accessToken') !== null) {
    //     state.loggedIn = true;
    //   }
    // },
    // logout: (state: AuthState, action: PayloadAction<any>) => {
    //   state.loggedIn = false;
    //   localStorage.removeItem('accessToken');
    //   localStorage.removeItem('refreshToken');
    // },
    // setUser: (state: AuthState, action: PayloadAction<any>) => {
    //   state.user = action.payload;
    // }
  }
});

// export const { login, logout, setUser } = authSlice.actions;
export default authSlice;
