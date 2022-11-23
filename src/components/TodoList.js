import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../redux/store';
import { getTodos, deleteTodo } from '../redux/slices/todo';
import axios from 'axios';

function TodoList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { todos, isLoading } = useSelector((state) => state.todo);
  const [todo, setTodos] = useState([]);

  const newTodo = async (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      enqueueSnackbar('Enter todo title', { variant: 'error' });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/todo`,
        {
          ...todo
        }
        );
        dispatch(getTodos());
        enqueueSnackbar('Todo item created!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('oops! Something went wrong!', { variant: 'error' });
    }
  };

  const updateTodo = async (todo) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/v1/todo/${todo.id}`,
        {
          ...todo
        }
        );
      enqueueSnackbar('Todo item has been Updated!', { variant: 'success' });
      dispatch(getTodos());
    } catch (error) {
      enqueueSnackbar('oops! Something went wrong!', { variant: 'error' });
    }
  };

  const removeTodo = async (id) => {
     try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/v1/todo/${id}`)
      enqueueSnackbar('Todo item has been removed!', { variant: 'success' });
      dispatch(getTodos());
    } catch (error) {
      enqueueSnackbar('oops! Something went wrong!', { variant: 'error' });
    }
  };

  const completeTodo = id => {
    let updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={newTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;
