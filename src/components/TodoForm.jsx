import { useState } from 'react';
import { DEFAULT_TAG_ID } from '../constants/palette';
import TagSelector from './TagSelector';

/**
 * Form to create a new to-do item with a title and pastel category tag.
 */
export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [tagId, setTagId] = useState(DEFAULT_TAG_ID);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Écris une tâche avant de l’ajouter.');
      return;
    }
    onAdd(trimmed, tagId);
    setTitle('');
    setError('');
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    if (error) setError('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className="todo-form__row">
        <input
          type="text"
          className="todo-input"
          placeholder="Ajouter une nouvelle tâche..."
          aria-label="Nouvelle tâche"
          value={title}
          onChange={handleTitleChange}
          maxLength={140}
        />
        <button type="submit" className="btn btn--primary">
          + Ajouter
        </button>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <TagSelector selectedTagId={tagId} onSelect={setTagId} />
    </form>
  );
}

