/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState(new Date());

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const onClearSearch = () => {
    setSearch('');
  };

  const onStatusChange = (value: string) => {
    setStatus(value);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Failed to load todos');
      });
  }, [updatedAt]);

  useEffect(() => {
    const filtered = todos.filter(todo => {
      if (status === 'all') {
        return todo.title.toLowerCase().includes(search.toLowerCase());
      }

      return (
        todo.title.toLowerCase().includes(search.toLowerCase()) &&
        todo.completed === (status === 'completed')
      );
    });

    setFilteredTodos(filtered);
  }, [todos, search, status]);

  const handleSelectTodo = (todo: Todo | null) => {
    setSelectedTodo(todo);
  };

  const reload = () => {
    setUpdatedAt(new Date());
    setErrorMessage('');
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                onSearch={onSearch}
                onStatusChange={onStatusChange}
                onClearSearch={onClearSearch}
              />
            </div>

            <div className="block">
              {todos.length === 0 && !errorMessage && <Loader />}
              {todos.length > 0 && (
                <TodoList
                  todos={filteredTodos}
                  selectedTodo={selectedTodo}
                  onSelect={handleSelectTodo}
                />
              )}
              {errorMessage && todos.length === 0 && (
                <div>
                  <p>{errorMessage}</p>
                  <button className="button is-danger" onClick={reload}>
                    Reload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal todo={selectedTodo} onClose={() => handleSelectTodo(null)} />
      )}
    </>
  );
};
