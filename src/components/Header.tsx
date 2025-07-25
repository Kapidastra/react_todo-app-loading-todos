import React from 'react';

import { Todo } from '../types/Todo';

interface HeaderProps {
  title: string;
  newTitle: string;
  setNewTitle: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  handleToggleAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  newTitle,
  setNewTitle,
  onSubmit,
  loading,
  inputRef,
  todos,
  handleToggleAll,
}) => (
  <header className="todoapp__header">
    <h1 className="todoapp__title">{title}</h1>
    {todos.length > 0 && (
      <label className="todo__status-label" htmlFor="toggle-all">
        <button
          id="toggle-all"
          type="button"
          className="todoapp__toggle-all active"
          onClick={handleToggleAll}
          aria-label="Toggle all todos"
          data-cy="ToggleAllButton"
        />
      </label>
    )}

    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="todoapp__new-todo"
        data-cy="NewTodoField"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        disabled={loading}
        autoFocus
      />
    </form>
  </header>
);
