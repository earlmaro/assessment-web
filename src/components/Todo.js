import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
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
      <div key={todo.id} onClick={() => completeTodo(todo.id)}>
        {todo.title}
      </div>
      <div className='icons'>
        <RiCloseCircleLine
          onClick={() => removeTodo(todo.id)}
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
