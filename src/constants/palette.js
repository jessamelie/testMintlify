/**
 * Pastel category tags used across task creation, display, and editing.
 */
export const PASTEL_TAGS = [
  {
    id: 'lavender',
    label: 'Général',
    bg: '#EDE4FF',
    border: '#D8C4FF',
    text: '#5B3E96',
    dot: '#B794F4',
  },
  {
    id: 'peach',
    label: 'Travail',
    bg: '#FFE8DC',
    border: '#FFCBB3',
    text: '#9C4221',
    dot: '#F6AD8F',
  },
  {
    id: 'sky',
    label: 'Perso',
    bg: '#DFF2FF',
    border: '#BAE3FF',
    text: '#2B6CB0',
    dot: '#90CDF4',
  },
  {
    id: 'rose',
    label: 'Urgent',
    bg: '#FFE0EA',
    border: '#FFC2D6',
    text: '#97266D',
    dot: '#F687B3',
  },
  {
    id: 'mint',
    label: 'Bien-être',
    bg: '#DCF7E8',
    border: '#B7EBD0',
    text: '#276749',
    dot: '#81E6B3',
  },
];

export const DEFAULT_TAG_ID = 'lavender';

/**
 * Resolve a tag configuration by id, falling back to the default tag.
 */
export function getTagById(tagId) {
  return PASTEL_TAGS.find((tag) => tag.id === tagId) ?? PASTEL_TAGS[0];
}

