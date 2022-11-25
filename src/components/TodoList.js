import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
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
  const [todo, setTodos] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  let subtitle;
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      height: '350px',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#161a2b',
    },
  };
  Modal.setAppElement(document.getElementById('root'));
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  const newTodo = async (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      enqueueSnackbar('Enter todo title', { variant: 'error' });
      return;
    }
    console.log(todo);
    if (!todo.photo) {
      enqueueSnackbar('Select a photo', { variant: 'error' });
      return;
    }
    const formData = new FormData();
		for ( var key in todo ) {
      formData.append(key, todo[key]);
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/v1/todo`, formData);
        dispatch(getTodos());
        closeModal()
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
        dispatch(getTodos());
      enqueueSnackbar('Todo item has been Updated!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('oops! Something went wrong!', { variant: 'error' });
    }
  };
  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/v1/todo/${id}`)
      dispatch(getTodos());
      enqueueSnackbar('Todo item has been removed!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('oops! Something went wrong!', { variant: 'error' });
    }
  }
  
  (function dne(){
    if(errorMessage) enqueueSnackbar(`oops! ${errorMessage}`, { variant: 'error' });
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
      <div>
      <button onClick={openModal} className='todo-add-button'>Add Todo</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        >
          <div>
            <button onClick={closeModal} className="button-1">close</button>
          </div>
        <TodoForm onSubmit={newTodo} />
      </Modal>
    </div>
      <Todo
        todos={todos}
        storageUrl={storageUrl}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;
