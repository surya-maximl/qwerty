import { createSlice } from '@reduxjs/toolkit';
import { CORE_INITIAL_STATE } from '../constants/core.constants';

const coreSlice = createSlice({
  reducerPath: 'core',
  name: 'core',
  initialState: CORE_INITIAL_STATE,
  reducers: {
    changeTitle: (state, action) => {
      state.title = action.payload
    }
  }
});

export const coreActions = coreSlice.actions;
export default coreSlice;