import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
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
      state.error = action.payload;
    },

    // GET MANAGE TRANSACTIONS
    getTodoListSuccess(state, action) {
      state.isLoading = false;
      state.todos = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

export function getTodos() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log('ffff');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/v1/todo`);
      console.log(response.data.result.todos)
      dispatch(slice.actions.getTodoListSuccess(response.data.result.todos));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteTodo(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/v1/todo/${id}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
