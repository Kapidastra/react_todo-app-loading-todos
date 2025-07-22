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
    <form onSubmit={onSubmit}>
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all"
          onClick={handleToggleAll}
          aria-label="Toggle all todos"
          data-cy="ToggleAllButton"
        />
      )}

      <input
        ref={inputRef}
        type="text"
        className="new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        disabled={loading}
        data-cy="NewTodoField"
      />
    </form>
  </header>
);
