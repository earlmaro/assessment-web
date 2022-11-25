import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useSnackbar } from 'notistack';
// import { LoadingButton } from '@mui/lab';

const Popup = forwardRef((props, ref) => {
  const { enqueueSnackbar } = useSnackbar();
  const [input, setInput] = useState({
    id: props.edit ? props.edit.id : null,
    title: props.edit ? props.edit.title : '',
    photo: props.edit ? props.edit.photo : '',
    is_completed: props.edit ? props.edit.is_completed : false
  });
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  Modal.setAppElement(document.getElementById('root'));

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      height: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#161a2b',
    },
  };
  useImperativeHandle(ref, () => ({
    openModal() {
      setIsOpen(true);
    },
    removeModal() {
      setIsOpen(false);
    },
    resetModal() {
      setInput({
        id: null,
        title: '',
        photo: '',
        is_completed: false
      });
      setSubmitted(false);
    },
  }));
  function closeModal() {
    props.resetEdit();
    setIsOpen(false);
  }
  const handleChange = event => {
    const { value, name } = event.target;
    console.log(value, name)
    if (name === 'title') setInput({ ...input, [name]: value })
    if (name === 'photo') setInput({ ...input, [name]: event.target.files[0] })
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!input.title || /^\s*$/.test(input.title)) {
      enqueueSnackbar('Enter todo title', { variant: 'error' });
      return;
    }
    console.log(input);
    if (!input.photo) {
      enqueueSnackbar('Select a photo', { variant: 'error' });
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
      contentLabel="Example Modal"
    >
      <div>
        <button onClick={closeModal} className="button-1">close</button>
      </div>
      {/* <TodoForm onSubmit={newTodo} /> */}
      <form onSubmit={handleSubmit} className='todo-form'>
        {props.edit.photo ? (
          <>
            <h1 className='modal-header'>Update Todo Item</h1>
            <div className='modal-header'>
              {<img src={`${props.storageUrl}uploads/${props.edit.photo}`} alt="todo photo" />}
            </div>
            <div className='container'>
              <input
                placeholder='Enter todo name'
                value={props.edit.title}
                onChange={handleChange}
                name='title'
                className='modal-inputs'
              />
            </div>
            <div className='container'>
              <input
                type='file'
                placeholder='change file'
                onChange={handleChange}
                name='photo'
                className='modal-inputs'
              />
            </div>
            {submitted ? (
              <div className='container'>
                  <button disabled className='todo-add-button'>Loading..</button>
                </div>
              ) : (
                <div className='container'>
                  <button className='todo-add-button '>Update</button>
                </div>
              )}
          </>
        ) : (
          <>
            <h1 className='modal-header'>Create a Todo Item</h1>
            <div className='container'>
              <input
                placeholder='Enter todo name'
                value={input.title}
                onChange={handleChange}
                name='title'
                className='modal-inputs'
              />
            </div>
            <div className='container'>
              <input
                type='file'
                placeholder='Add a todo'
                onChange={handleChange}
                name='photo'
                className='modal-inputs'
              />
            </div>
            <div className='container'>
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