import React from 'react';
import classNames from 'classnames';

interface Props {
  message: string | null;
  onClose: () => void;
}

export const ErrorNotification: React.FC<Props> = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        'is-visible',
      )}
    >
      <button
        className="delete"
        onClick={onClose}
        aria-label="close"
        data-cy="CloseErrorNotification"
      />
      {message}
    </div>
  );
};
