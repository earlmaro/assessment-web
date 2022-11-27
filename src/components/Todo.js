import React, { useState, useEffect } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo, storageUrl, editTodo, viewTodo }) => {
  const [edit, setEdit] = useState({
    id: null,
    title: '',
    photo: '',
    is_completed: false
  });

  const showTodo = todo => {
    viewTodo(todo);
  };
  const handleEdit = (todo) => {
    editTodo(todo);
  };

  return todos.map((todo, index) => (
    <div
      className={todo.is_completed ? 'todo-row complete' : 'todo-row'}
      key={index}
    >
      <div>
        {<img src= {`${storageUrl}uploads/${todo.photo}`} alt="todo photo" />}
      </div>

      <div className='todo-title' onClick={() => showTodo(todo)}>
        {todo.title}
      </div>
      <div className='icons'>
        <RiCloseCircleLine
          onClick={() => removeTodo(todo.id, todo.title)}
          className='delete-icon'
        />
        {!todo.is_completed && (
          <TiEdit
            onClick={() => handleEdit(todo)}
            className='edit-icon'
          />
        )}
      </div>
    </div>
  ));
};

export default Todo;
