import { createSlice } from '@reduxjs/toolkit';
import { EDITOR_INITIAL_STATE } from '../constants/editor.constants';

const editorSlice = createSlice({
  reducerPath: 'editor',
  name: 'editor',
  initialState: EDITOR_INITIAL_STATE,
  reducers: {}
});
export const editorActions = editorSlice.actions;

export default editorSlice;