import React from 'react';

type FilterType = 'all' | 'active' | 'completed';

interface Props {
  todosCount: number;
  filterBy: FilterType;
  setFilterBy: (filter: FilterType) => void;
  hasCompleted: boolean;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todosCount,
  filterBy,
  setFilterBy,
  hasCompleted,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} items left
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
        className={`todoapp__clear-completed ${!hasCompleted ? 'hidden' : ''}`}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
