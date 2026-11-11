import { useEffect, useMemo, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

const STORAGE_KEY = 'pastel_todos_v1';

const INITIAL_TODOS = [
  {
    id: 'sample-1',
    title: 'Préparer le café et planifier la journée',
    tagId: 'mint',
    completed: true,
  },
  {
    id: 'sample-2',
    title: 'Finaliser la maquette aux tons pastel',
    tagId: 'peach',
    completed: false,
  },
  {
    id: 'sample-3',
    title: 'Lire 20 minutes ce soir',
    tagId: 'sky',
    completed: false,
  },
];

const FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'active', label: 'À faire' },
  { id: 'completed', label: 'Terminées' },
];

function loadInitialTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return INITIAL_TODOS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TODOS;
  } catch {
    return INITIAL_TODOS;
  }
}

function createTaskId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [todos, setTodos] = useState(loadInitialTodos);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Ignore storage quota or private-mode errors gracefully.
    }
  }, [todos]);

  const handleAdd = (title, tagId) => {
    const newTodo = {
      id: createTaskId(),
      title,
      tagId,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleUpdate = (id, updates) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)));
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleDuplicate = (id) => {
    setTodos((prev) => {
      const index = prev.findIndex((todo) => todo.id === id);
      if (index === -1) return prev;

      const source = prev[index];
      const suffix = ' (copie)';
      const title =
        source.title.length + suffix.length <= 140 ? `${source.title}${suffix}` : source.title;

      const copy = {
        id: createTaskId(),
        title,
        tagId: source.tagId,
        completed: false,
      };

      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)];
    });
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const counts = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      all: todos.length,
      active: todos.length - completed,
      completed,
    };
  }, [todos]);

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed);
    if (filter === 'completed') return todos.filter((todo) => todo.completed);
    return todos;
  }, [todos, filter]);

  const emptyMessage = {
    all: 'Aucune tâche pour le moment. Ajoute ta première tâche ci-dessus !',
    active: 'Bravo, toutes tes tâches sont terminées !',
    completed: 'Aucune tâche terminée pour l’instant.',
  }[filter];

  return (
    <div className="app-shell">
      <div className="pastel-blob pastel-blob--lavender" aria-hidden="true" />
      <div className="pastel-blob pastel-blob--peach" aria-hidden="true" />
      <div className="pastel-blob pastel-blob--mint" aria-hidden="true" />

      <main className="todo-card">
        <header className="todo-header">
          <div>
            <span className="todo-eyebrow">Organisateur quotidien</span>
            <h1 className="todo-title">Ma To-Do</h1>
          </div>
          <div className="todo-counter" aria-live="polite">
            <span className="todo-counter__number">{counts.active}</span>
            <span className="todo-counter__label">
              {counts.active <= 1 ? 'tâche restante' : 'tâches restantes'}
            </span>
          </div>
        </header>

        <TodoForm onAdd={handleAdd} />

        <nav className="filter-bar" aria-label="Filtrer les tâches">
          <div className="filter-pills">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`filter-pill ${filter === item.id ? 'filter-pill--active' : ''}`}
              >
                {item.label}
                <span className="filter-pill__count">{counts[item.id]}</span>
              </button>
            ))}
          </div>

          {counts.completed > 0 && (
            <button type="button" className="btn-clear" onClick={handleClearCompleted}>
              Effacer terminées
            </button>
          )}
        </nav>

        {visibleTodos.length === 0 ? (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

