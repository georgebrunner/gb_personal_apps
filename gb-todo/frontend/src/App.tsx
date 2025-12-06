import { useState, useEffect } from 'react'
import { TodoItem, fetchTodos, addTodo, toggleTodo, deleteTodo } from './api'
import VoiceInput from './components/VoiceInput'

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoText, setNewTodoText] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      const data = await fetchTodos()
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
      const newTodo = await addTodo({ text: newTodoText.trim(), completed: false })
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

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length

  if (loading) {
    return (
      <div className="container">
        <h1>GB Todo</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>GB Todo</h1>

      <div className="card">
        <form onSubmit={handleAddTodo}>
          <div className="form-group">
            <div className="input-with-voice">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
              />
              <VoiceInput onResult={handleVoiceResult} />
            </div>
          </div>
          <div className="button-row">
            <button type="submit" disabled={!newTodoText.trim()}>
              Add Task
            </button>
            <button type="submit" disabled={!newTodoText.trim()} className="save-btn">
              Save
            </button>
          </div>
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
          Completed ({todos.length - activeCount})
        </button>
      </div>

      <div className="card">
        {filteredTodos.length === 0 ? (
          <p className="empty-message">
            {filter === 'all' ? 'No tasks yet. Add one above!' :
             filter === 'active' ? 'No active tasks!' :
             'No completed tasks!'}
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
                <span className="todo-text">{todo.text}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(todo.id!)}
                  aria-label="Delete task"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="stats">
          <span>{activeCount} task{activeCount !== 1 ? 's' : ''} remaining</span>
        </div>
      )}
    </div>
  )
}

export default App
