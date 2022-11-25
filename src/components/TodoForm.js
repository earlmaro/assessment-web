import React, { useState, useEffect, useRef } from 'react';
import { RiContactsBookLine } from 'react-icons/ri';

function TodoForm(props) {
  const [input, setInput] = useState({
    id: props.edit ? props.edit.id : null,
    title: props.edit ? props.edit.title : '',
    photo: props.edit ? props.edit.photo : '',
    is_completed: props.edit ? props.edit.is_completed : false
  });

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  const handleChange = event => {
    const { value, name } = event.target;
    console.log(value, name)
    if(name === 'title') setInput({...input, [name]: value})
    if(name === 'photo') setInput({...input, [name]: event.target.files[0]})
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.onSubmit({
      photo: input.photo,
      title: input.title,
      is_completed: input.is_completed,
      id: input.id,
    });
    // console.log(input);
    // setInput({
    //   id: null,
    //   title: '',
    //   photo: '',
    //   is_completed: false
    // });
  };

  return (
    <form onSubmit={handleSubmit} className='todo-form'>
      {props.edit ? (
        <>
          <input
            placeholder='Update your item'
            value={input.title}
            onChange={handleChange}
            name='title'
            ref={inputRef}
            className='todo-input edit'
          />
          <button onClick={handleSubmit} className='todo-button edit'>
            Update
          </button>
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
              ref={inputRef}
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
            <button className='todo-add-button '>Submit</button>
          </div>
        </>
      )}
    </form>
  );
}

export default TodoForm;
