import { createSlice } from '@reduxjs/toolkit';

import { CORE_INITIAL_STATE } from '../constants/core.constants';

const coreSlice = createSlice({
  reducerPath: 'core',
  name: 'core',
  initialState: CORE_INITIAL_STATE,
  reducers: {
    changeTitle: (state, action) => {
      state.title = action.payload;
    },
    // getCookie: (state, action) => {
    //   const cookieString = document.cookie;
    //   const cookies = cookieString.split(';');

    //   for (let cookie of cookies) {
    //     const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim());
    //     if (cookieName === action.payload) {
    //       console.log("cookie value: ", cookieValue);
    //       return decodeURIComponent(cookieValue);
    //     }
    //   }

    //   return undefined;
    // }
  }
});

export const coreActions = coreSlice.actions;
export default coreSlice;
