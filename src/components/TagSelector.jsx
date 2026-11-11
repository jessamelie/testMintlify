import { PASTEL_TAGS } from '../constants/palette';

/**
 * Reusable pastel category selector for task creation and inline editing.
 */
export default function TagSelector({ selectedTagId, onSelect, size = 'md' }) {
  return (
    <div className={`tag-selector tag-selector--${size}`} role="radiogroup" aria-label="Catégorie pastel">
      {PASTEL_TAGS.map((tag) => {
        const isSelected = tag.id === selectedTagId;
        return (
          <button
            key={tag.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(tag.id)}
            className={`tag-chip ${isSelected ? 'tag-chip--selected' : ''}`}
            style={{
              '--tag-bg': tag.bg,
              '--tag-border': tag.border,
              '--tag-text': tag.text,
              '--tag-dot': tag.dot,
            }}
          >
            <span className="tag-dot" aria-hidden="true" />
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}

