import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  storageUrl: '',
  errorMessage: '',
  todos: [],
};

const slice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = true;
      state.errorMessage = action.payload.message;
    },

    getTodoListSuccess(state, action) {
      state.isLoading = false;
      state.todos = action.payload;
    },

    getServerUrlSuccess(state, action) {
      state.isLoading = false;
      state.storageUrl = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

export function getTodos() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/todo`);
      dispatch(slice.actions.getTodoListSuccess(response.data.result.todos));
      dispatch(slice.actions.getServerUrlSuccess(response.data.meta.storage_url));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}