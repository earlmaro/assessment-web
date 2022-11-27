import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useSnackbar } from 'notistack';
import { FaTimes } from "react-icons/fa";

const Popup = forwardRef((props, ref) => {
  const { enqueueSnackbar } = useSnackbar();
  const [input, setInput] = useState({
    id: props.edit.id ? props.edit.id : null,
    title: props.edit.title ? props.edit.title : '',
    photo: props.edit.photo ? props.edit.photo : '',
    is_completed: props.edit.is_completed ? props.edit.is_completed : false
  });
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [viewTodo, setViewTodo] = React.useState(false);
  const [enable, setEnable] = React.useState(false);
  
  Modal.setAppElement(document.getElementById('root'));

  const customStyles = {
    content: {
      top: '37%',
      left: '50%',
      right: 'auto',
      height: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#161a2b',
      borderRadius: '10px',
      border: '2px solid #282828',
    },
  };
  useImperativeHandle(ref, () => ({
    openModal() {
      setInput({
        photo: '',
        title: '',
        is_completed: 0,
        id: null
      });
      setIsOpen(true);
    },
    editModal(todo) {
      setInput({
        photo: todo.photo,
        title: todo.title,
        is_completed: todo.is_completed,
        id: todo.id,
      });
      setIsOpen(true);
    },
    removeModal() {
      setIsOpen(false);
    },
    viewTodoModal() {
      setViewTodo(true);
      setIsOpen(true);
    },
    setSubmit() {
      setSubmitted(false);
    },
    resetModal() {
      setInput({
        id: null,
        title: '',
        photo: '',
        is_completed: false
      });
      setSubmitted(false);
      // console.log('dd')
    },
  }));
  function closeModal() {
    props.resetEdit();
    setIsOpen(false);
    setViewTodo(false);
    setEnable(false);
  }
  const handleChange = event => {
    setEnable(true);
    const { value, name } = event.target;
    if (name === 'title') setInput({ ...input, [name]: value })
    if (name === 'photo') setInput({ ...input, [name]: event.target.files[0] })
  };

  const handleComplete = (todo, status) => {
    setSubmitted(true);
    let updateObj = {
      title: todo.title,
      photo: todo.photo,
      is_completed: status,
      id: todo.id,
    }
    props.updateTodo(updateObj);
  };

  const handleUpdate = () => {
    setSubmitted(true);
    props.updateTodo(input);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!input.title || /^\s*$/.test(input.title)) {
      enqueueSnackbar('Enter todo title', { variant: 'error' });
      return;
    }
    setSubmitted(true);
    props.onSubmit({
      photo: input.photo,
      title: input.title,
      is_completed: input.is_completed,
      id: input.id,
    });
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Todo Modal"
      backdrop="static"
    >
      <div>
        <FaTimes
          onClick={closeModal}
          className='close-modal button-1'
        />
      </div>
      <form onSubmit={handleSubmit} className='todo-form'>
        {props.edit.photo ? (
          <>
            <h1 className='modal-header' style={{marginTop: '50px'}}> {viewTodo ? 'Your' : 'Update'}  Todo Item</h1>
            <div className='modal-header'>
              {<img src={`${props.storageUrl}uploads/${props.edit.photo}`} alt="todo photo" />}
            </div>
            {!viewTodo ? (
              <div className='center'>
                <label htmlFor="title" style={{color: 'white'}}> Name: </label>
                <input
                  placeholder='Enter todo name'
                  value={input.title}
                  onChange={handleChange}
                  name='title'
                  className='modal-inputs'
                />
              </div>
            ) : (
              <div className='center' style={{color: 'white'}}>
                <label htmlFor="title" style={{ marginRight: '1px'}}> Name: </label>
                {props.edit.title}
              </div>
            )}
            {!viewTodo && (
              <div className='center'>
                <label htmlFor="title" style={{color: 'white'}}> Photo: </label>
                <input
                  type='file'
                  placeholder='change file'
                  onChange={handleChange}
                  name='photo'
                  className='modal-inputs'
                />
              </div>
            )}
            {submitted && !viewTodo && (
              <div className='center'>
                <button disabled className='todo-add-button'>Loading..</button>
              </div>
            )}
            {!submitted && !viewTodo && !enable && (
              <div className='center'>
                <button disabled type="button" onClick={handleUpdate} className='button-disabled'> Update</button>
              </div>
            )}
            {!submitted && !viewTodo && enable && (
              <div className='center'>
                <button type="button" onClick={handleUpdate} className='todo-add-button'>Update</button>
              </div>
            )}
            {viewTodo && !props.edit.is_completed && !submitted && (
              <div className='center'>
                <button type="button" style={{marginTop: '20px'}} onClick={() => handleComplete(props.edit, 1)} className='todo-add-button'>mark as complete</button>
              </div>
            )}

            {viewTodo && !props.edit.is_completed && submitted && (
              <div className='center'>
                <button disabled className='todo-add-button'>Loading..</button>
              </div>
            )}

            {viewTodo && props.edit.is_completed && !submitted && (
              <div className='center'>
                <button type="button" onClick={() => handleComplete(props.edit, 0)} className='todo-add-button'>mark as in incomplete</button>
              </div>
            )}
            
            {viewTodo && props.edit.is_completed && submitted && (
              <div className='center'>
                <button disabled className='todo-add-button'>Loading..</button>
              </div>
            )}

          </>
        ) : (
          <>
            <h1 className='modal-header' style={{marginTop: '50px'}}>Create a Todo Item</h1>
            <div className='center'>
            <label htmlFor="title" style={{color: 'white'}}> Name: </label>
              <input
                placeholder='Enter todo name'
                value={input.title}
                onChange={handleChange}
                name='title'
                className='modal-inputs'
              />
            </div>
            <div className='center'>
            <label htmlFor="title" style={{color: 'white'}}> Photo: </label>
              <input
                type='file'
                placeholder='Add a todo'
                onChange={handleChange}
                name='photo'
                className='modal-inputs'
              />
            </div>
            <div className='center'>
              {submitted ? (
                <button disabled className='todo-add-button'>Loading..</button>
              ) : (
                <button className='todo-add-button '>Submit</button>
              )}
            </div>
          </>
        )}
      </form>
    </Modal>
  );
});

export default Popup;