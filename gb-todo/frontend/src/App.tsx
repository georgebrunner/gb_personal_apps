import { useState, useEffect } from 'react'
import { TodoItem, Store, fetchTodos, fetchStores, addTodo, toggleTodo, ListType } from './api'
import VoiceInput from './components/VoiceInput'

const APP_LINKS = [
  { name: 'Health', port: 5173, path: '/health/' },
  { name: 'Guitar', port: 5174, path: '/guitar/' },
  { name: 'Todo', port: 5175, path: '/todo/' },
  { name: 'Finance', port: 5176, path: '/finance/' },
  { name: 'Sales', port: 5178, path: '/sales/' },
]

const currentApp = 'Todo'

function getAppUrl(app: typeof APP_LINKS[0]): string {
  const isProduction = window.location.port === '' || window.location.port === '80' || window.location.port === '443'
  if (isProduction) {
    return `${window.location.protocol}//${window.location.hostname}${app.path}`
  }
  return `http://${window.location.hostname}:${app.port}`
}

const LIST_TYPES: { type: ListType; label: string; placeholder: string }[] = [
  { type: 'todo', label: 'To Do', placeholder: 'What needs to be done?' },
  { type: 'shopping', label: 'Shopping', placeholder: 'What do you need to buy?' },
  { type: 'notes', label: 'Notes', placeholder: 'Add a note...' },
]

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoText, setNewTodoText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [listType, setListType] = useState<ListType>('todo')
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hideCompleted, setHideCompleted] = useState(false)

  useEffect(() => {
    fetchStores().then(setStores).catch(console.error)
  }, [])

  useEffect(() => {
    loadTodos()
  }, [listType, selectedStore])

  const loadTodos = async () => {
    setLoading(true)
    try {
      const storeFilter = listType === 'shopping' ? selectedStore || undefined : undefined
      const data = await fetchTodos(listType, storeFilter)
      setTodos(data)
    } catch (error) {
      console.error('Failed to load todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newTodoText.trim()) return

    try {
      const newTodo = await addTodo({
        text: newTodoText.trim(),
        completed: false,
        list_type: listType,
        store: listType === 'shopping' ? selectedStore || undefined : undefined
      })
      setTodos([newTodo, ...todos])
      setNewTodoText('')
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const handleVoiceResult = (text: string) => {
    setNewTodoText(text)
  }

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleTodo(id)
      setTodos(todos.map(t => t.id === id ? updated : t))
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  const handleListTypeChange = (newType: ListType) => {
    setListType(newType)
    if (newType !== 'shopping') {
      setSelectedStore(null)
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (hideCompleted && todo.completed) return false
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const currentListConfig = LIST_TYPES.find(lt => lt.type === listType)!

  const getStoreName = (storeId: string | null) => {
    if (!storeId) return 'All Stores'
    const store = stores.find(s => s.id === storeId)
    return store ? store.name : storeId
  }

  if (loading && todos.length === 0) {
    return (
      <div className="container">
        <nav className="app-nav">
          {APP_LINKS.map(app => (
            <a
              key={app.name}
              href={getAppUrl(app)}
              className={`app-link ${app.name === currentApp ? 'active' : ''}`}
            >
              {app.name}
            </a>
          ))}
        </nav>
        <h1>GB Lists</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <nav className="app-nav">
        {APP_LINKS.map(app => (
          <a
            key={app.name}
            href={getAppUrl(app)}
            className={`app-link ${app.name === currentApp ? 'active' : ''}`}
          >
            {app.name}
          </a>
        ))}
      </nav>
      <h1>GB Lists</h1>

      {/* List Type Tabs */}
      <div className="tabs">
        {LIST_TYPES.map(lt => (
          <button
            key={lt.type}
            className={`tab ${listType === lt.type ? 'active' : ''}`}
            onClick={() => handleListTypeChange(lt.type)}
          >
            {lt.label}
          </button>
        ))}
      </div>

      {/* Store Selector for Shopping */}
      {listType === 'shopping' && (
        <div className="store-selector">
          <button
            className={`store-btn ${selectedStore === null ? 'active' : ''}`}
            onClick={() => setSelectedStore(null)}
          >
            All
          </button>
          {stores.map(store => (
            <button
              type="button"
              key={store.id}
              className={`store-btn ${selectedStore === store.id ? 'active' : ''}`}
              onClick={() => setSelectedStore(store.id)}
            >
              {store.name}
            </button>
          ))}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleAddTodo}>
          <div className="form-group">
            <div className="input-with-voice">
              <input
                type="text"
                placeholder={selectedStore ? `Add to ${getStoreName(selectedStore)} list...` : currentListConfig.placeholder}
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
              />
              <VoiceInput onResult={handleVoiceResult} />
            </div>
          </div>
          <button type="submit" disabled={!newTodoText.trim()}>
            Add {currentListConfig.label === 'Notes' ? 'Note' : 'Item'}
          </button>
        </form>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({activeCount})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Done ({todos.length - activeCount})
        </button>
      </div>

      <div className="card">
        {filteredTodos.length === 0 ? (
          <p className="empty-message">
            {filter === 'all'
              ? selectedStore
                ? `No items in ${getStoreName(selectedStore)} list yet. Add one above!`
                : `No ${currentListConfig.label.toLowerCase()} items yet. Add one above!`
              : filter === 'active' ? 'No active items!' : 'No completed items!'}
          </p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <label className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id!)}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="todo-content">
                  <span className="todo-text">{todo.text}</span>
                  {listType === 'shopping' && !selectedStore && todo.store && (
                    <span className="todo-store">{getStoreName(todo.store)}</span>
                  )}
                </div>
                <button
                  className="complete-btn"
                  onClick={() => handleToggle(todo.id!)}
                  aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {todo.completed ? '↩' : '✓'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="stats">
          <span>{activeCount} item{activeCount !== 1 ? 's' : ''} remaining</span>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={(e) => setHideCompleted(e.target.checked)}
            />
            Hide completed
          </label>
        </div>
      )}
    </div>
  )
}

export default App
