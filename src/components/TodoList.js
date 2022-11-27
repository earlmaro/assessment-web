import React, { useState, useEffect, useRef } from 'react';
import Popup from './Popup';
import Todo from './Todo';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../redux/store';
import { getTodos, deleteTodo } from '../redux/slices/todo';
import axios from 'axios';
import swal from 'sweetalert';
import Modal from 'react-modal';

function TodoList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { todos, storageUrl, errorMessage } = useSelector((state) => state.todo);
  const [todo, setTodos] = useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const childRef = useRef(null);

  const handleClick = () => {
    childRef.current.openModal();
  };
  const resetEdit = () => {
    setTodos({});
  };

  const newTodo = async (todo) => {
    const formData = new FormData();
    for (var key in todo) {
      formData.append(key, todo[key]);
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/todo`, formData);
      dispatch(getTodos());
      childRef.current.removeModal();
      childRef.current.resetModal();
      enqueueSnackbar('Todo item created!', { variant: 'success' });
    } catch (error) {
      if (error.response.data.message.statusCode === 422) {
        Object.entries(error.response.data.message.message).forEach(([key, value]) =>
          enqueueSnackbar(value[0], { variant: 'error' })
        );
      }else{
        enqueueSnackbar('oops! encountered an error', { variant: 'error' });
        childRef.current.setSubmit();
      }
      console.log(error);
    }
  };

  const updateTodo = async (todo) => {
    const formData = new FormData();
    for (var key in todo) {
      formData.append(key, todo[key]);
    }
    formData.append('_method', 'PATCH');
    try {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/v1/todo/${todo.id}`, formData)
        .then((data) => {
          dispatch(getTodos());
          childRef.current.removeModal();
          childRef.current.resetModal();
          enqueueSnackbar('Todo item has been Updated!', { variant: 'success' });
        });

    } catch (error) {
      if (!error.response.data.success) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
        childRef.current.setSubmit();
      }
    }
  };
  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/v1/todo/${id}`)
      dispatch(getTodos());
      enqueueSnackbar('Todo item has been removed!', { variant: 'success' });
    } catch (error) {
      if (!error.response.data.success) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    }
  }

  (function dne() {
    if (errorMessage) enqueueSnackbar(`oops! ${errorMessage}`, { variant: 'error' });
  })();

  const removeTodo = async (id, title) => {
    swal({
      title: 'Are you sure?',
      text: `${title} will be deleted!`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then((willDelete) => {
      if (willDelete) {
        deleteTodo(id);
      } else {
        swal('Todo item is intact!');
      }
    });
  };
  const editTodo = todo => {
    setTodos(todo);
    childRef.current.editModal(todo);
  };
  const viewTodo = todo => {
    setTodos(todo);
    childRef.current.viewTodoModal();
  };

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <div>
        <button onClick={handleClick} className='todo-add-button'>Add Todo</button>
        <Popup
          ref={childRef}
          onSubmit={newTodo}
          edit={todo}
          storageUrl={storageUrl}
          resetEdit={resetEdit}
          completeTodo={updateTodo}
          updateTodo={updateTodo}
        />
      </div>
      <Todo
        todos={todos}
        storageUrl={storageUrl}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        editTodo={editTodo}
        viewTodo={viewTodo}
      />
      {todos.length === 0 && (
        <div className='center'>
          <p style={{ color: 'white', marginTop: "50px" }}>You currently have no todo item.</p>
        </div>
      )}
    </>
  );
}

export default TodoList;
