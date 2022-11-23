import React, { useState, useEffect, useRef } from 'react';

function TodoForm(props) {
  // const [input, setInput] = useState(props.edit ? props.edit.title : '');
  const [input, setInput] = useState({
    id: props.edit ? props.edit.id : '',
    title: props.edit ? props.edit.title : '',
    photo: props.edit ? props.edit.photo : '',
    is_completed: props.edit ? props.edit.is_completed : ''
  });

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  const handleChange = e => {
    // setInput(e.target.value);
    setInput({
      id: input.id,
      title: e.target.value,
      photo: input.photo,
      is_completed: input.is_completed
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    props.onSubmit({
      photo: input.photo,
      title: input.title,
      is_completed: input.is_completed,
      id: input.id,
    });
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className='todo-form'>
      {props.edit ? (
        <>
          <input
            placeholder='Update your item'
            value={input.title}
            onChange={handleChange}
            name='text'
            ref={inputRef}
            className='todo-input edit'
          />
          <button onClick={handleSubmit} className='todo-button edit'>
            Update
          </button>
        </>
      ) : (
        <>
          <input
            placeholder='Add a todo'
            value={input.title}
            onChange={handleChange}
            name='text'
            className='todo-input'
            ref={inputRef}
          />
          <button onClick={handleSubmit} className='todo-button'>
            Add todo
          </button>
        </>
      )}
    </form>
  );
}

export default TodoForm;
