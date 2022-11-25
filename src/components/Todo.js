import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo, storageUrl }) => {
  const [edit, setEdit] = useState({
    id: null,
    title: '',
    photo: '',
    is_completed: false
  });

  const submitUpdate = value => {
    // console.log(value);
    updateTodo(value);
    setEdit({
      id: null,
      title: '',
      photo: '',
      is_completed: false
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return todos.map((todo, index) => (
    <div
      className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
      key={index}
    >
      <div>
        {<img src= {`${storageUrl}uploads/${todo.photo}`} alt="profile" class="profile" />}
      </div>
      
      <div key={todo.id} onClick={() => completeTodo(todo.id)}>
        {todo.title}
      </div>
      <div className='icons'>
        <RiCloseCircleLine
          onClick={() => removeTodo(todo.id, todo.title)}
          className='delete-icon'
        />
        <TiEdit
          onClick={() => setEdit({ id: todo.id, title: todo.title, photo: todo.photo, is_completed: todo.is_completed })}
          className='edit-icon'
        />
      </div>
    </div>
  ));
};

export default Todo;
