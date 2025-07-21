/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo
} from './api/todos';

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  Title = 'Title should not be empty',
}

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoId, setProcessingTodoId] = useState<number | null>(null);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (errorMessage !== null) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      return;
    }
  }, [errorMessage]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos.length]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      })
      .catch(() => setErrorMessage(ErrorMessage.Delete));
  };

  const handleDelete = (id: number) => {
    setProcessingTodoId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorMessage(ErrorMessage.Delete))
      .finally(() => setProcessingTodoId(null));
  };

  const handleToggle = (todoToToggle: Todo) => {
    setProcessingTodoId(todoToToggle.id);
    updateTodo(todoToToggle.id, { completed: !todoToToggle.completed })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => setProcessingTodoId(null));
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    Promise.all(
      todos.map(todo => updateTodo(todo.id, { completed: !areAllCompleted })),
    )
      .then(updatedTodos => setTodos(updatedTodos))
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => setProcessingTodoId(null));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        newTodoField.current?.focus();
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        newTodoField.current?.focus();
      });
  };

  let filteredTodos = todos;

  if (filterBy === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (filterBy === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${areAllCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              ref={newTodoField}
              disabled={loading}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDelete(todo.id)}
                    disabled={processingTodoId === todo.id}
                  >
                    ×
                  </button>

                  {processingTodoId === todo.id && (
                    <div
                      data-cy="TodoLoader"
                      className="modal overlay is-active"
                    >
                      <div
                        className="modal-background
                      has-background-white-ter"
                      />
                      <div className="loader" />
                    </div>
                  )}
                </div>
              ))}

              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={tempTodo.completed}
                      onChange={() => {}}
                      disabled
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {}}
                    disabled
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div
                      className="modal-background
                    has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {todos.filter(todo => !todo.completed).length} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${filterBy === 'all' ? 'selected' : ''}`}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilterBy('all')}
                >
                  All
                </a>
                <a
                  href="#/active"
                  className={`filter__link ${filterBy === 'active' ? 'selected' : ''}`}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilterBy('active')}
                >
                  Active
                </a>
                <a
                  href="#/completed"
                  className={`filter__link ${filterBy === 'completed' ? 'selected' : ''}`}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setFilterBy('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className={`todoapp__clear-completed ${
                  !todos.some(todo => todo.completed) ? 'hidden' : ''
                }`}
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}

        <div
          data-cy="ErrorNotification"
          className={`notification is-danger is-light has-text-weight-normal ${
            errorMessage ? '' : 'hidden'
          }`}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage(null)}
          />
          {errorMessage}
        </div>
      </div>
    </div>
  );
};
