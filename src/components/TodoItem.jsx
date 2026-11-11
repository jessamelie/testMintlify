import { useEffect, useRef, useState } from 'react';
import { getTagById } from '../constants/palette';
import TagSelector from './TagSelector';

/**
 * Single to-do item row supporting toggle, inline edit (title + tag), duplicate, and delete.
 */
export default function TodoItem({ todo, onToggle, onUpdate, onDuplicate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftTagId, setDraftTagId] = useState(todo.tagId);
  const editInputRef = useRef(null);

  const tag = getTagById(todo.tagId);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setDraftTitle(todo.title);
    setDraftTagId(todo.tagId);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftTitle(todo.title);
    setDraftTagId(todo.tagId);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      cancelEditing();
      return;
    }
    onUpdate(todo.id, { title: trimmed, tagId: draftTagId });
    setIsEditing(false);
  };

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
    }
  };

  return (
    <li
      className={`todo-item ${todo.completed ? 'todo-item--completed' : ''}`}
      style={{ '--item-accent': tag.dot, '--item-tint': tag.bg }}
    >
      {isEditing ? (
        <div className="todo-item__edit">
          <div className="todo-item__edit-row">
            <input
              ref={editInputRef}
              type="text"
              className="todo-input todo-input--compact"
              aria-label="Modifier la tâche"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={handleEditKeyDown}
              maxLength={140}
            />
            <div className="todo-item__edit-actions">
              <button type="button" className="btn btn--save" onClick={saveEdit}>
                Enregistrer
              </button>
              <button type="button" className="btn btn--ghost" onClick={cancelEditing}>
                Annuler
              </button>
            </div>
          </div>
          <TagSelector selectedTagId={draftTagId} onSelect={setDraftTagId} size="sm" />
        </div>
      ) : (
        <div className="todo-item__view">
          <label className="todo-checkbox">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              aria-label={`Marquer « ${todo.title} » comme ${todo.completed ? 'à faire' : 'terminée'}`}
            />
            <span className="todo-checkbox__box" aria-hidden="true">
              {todo.completed && (
                <svg viewBox="0 0 16 16" fill="none" className="todo-checkbox__icon">
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </label>

          <div className="todo-item__content" onDoubleClick={startEditing}>
            <span className="todo-item__title">{todo.title}</span>
            <span
              className="todo-badge"
              style={{
                '--tag-bg': tag.bg,
                '--tag-border': tag.border,
                '--tag-text': tag.text,
              }}
            >
              {tag.label}
            </span>
          </div>

          <div className="todo-item__actions">
            <button
              type="button"
              className="icon-btn icon-btn--duplicate"
              onClick={() => onDuplicate(todo.id)}
              aria-label={`Dupliquer « ${todo.title} »`}
              title="Dupliquer"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect
                  x="7"
                  y="7"
                  width="9"
                  height="9"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M13 7V5.5A1.5 1.5 0 0011.5 4h-6A1.5 1.5 0 004 5.5v6A1.5 1.5 0 005.5 13H7"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--edit"
              onClick={startEditing}
              aria-label={`Modifier « ${todo.title} »`}
              title="Modifier"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-8.793 8.793-3.536.707.707-3.536 8.794-8.792z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--delete"
              onClick={() => onDelete(todo.id)}
              aria-label={`Supprimer « ${todo.title} »`}
              title="Supprimer"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 6h12M8 6V4h4v2m-5 0v9a1 1 0 001 1h4a1 1 0 001-1V6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

