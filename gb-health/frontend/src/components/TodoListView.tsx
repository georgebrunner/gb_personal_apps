import { useState, useEffect } from 'react'
import { getTodos, addTodoItem, toggleTodoItem, deleteTodoItem, TodoItem } from '../api'
import VoiceInput from './VoiceInput'

export default function TodoListView() {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoText, setNewTodoText] = useState('')
  const [loading, setLoading] = useState(true)

  const loadTodos = async () => {
    try {
      const data = await getTodos(selectedDate)
      setTodos(data.items || [])
    } catch (e) {
      console.error('Failed to load todos', e)
      setTodos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    loadTodos()
  }, [selectedDate])

  const handleAddTodo = async (text: string) => {
    if (!text.trim()) return

    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      created_at: new Date().toISOString()
    }

    try {
      const result = await addTodoItem(selectedDate, newItem)
      setTodos(result.items || [])
      setNewTodoText('')
    } catch (e) {
      console.error('Failed to add todo', e)
    }
  }

  const handleToggle = async (item: TodoItem) => {
    try {
      const result = await toggleTodoItem(selectedDate, item.id, !item.completed)
      setTodos(result.items || [])
    } catch (e) {
      console.error('Failed to toggle todo', e)
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      await deleteTodoItem(selectedDate, itemId)
      setTodos(prev => prev.filter(t => t.id !== itemId))
    } catch (e) {
      console.error('Failed to delete todo', e)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAddTodo(newTodoText)
  }

  const handleVoiceResult = (text: string) => {
    // Split by common separators to add multiple items
    const items = text.split(/[,;]|and then|then|also/i).map(s => s.trim()).filter(Boolean)
    items.forEach(item => {
      handleAddTodo(item)
    })
  }

  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return <div className="card">Loading...</div>
  }

  return (
    <div>
      <div className="card">
        <div className="todo-header">
          <h2>To Do List</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="date-picker"
          />
        </div>

        <div className="todo-date-display">
          {formatDate(selectedDate)}
          {selectedDate === today && <span className="today-badge">Today</span>}
        </div>

        {totalCount > 0 && (
          <div className="todo-progress">
            <div className="todo-progress-text">
              {completedCount} of {totalCount} completed
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Add new todo */}
        <form onSubmit={handleSubmit} className="todo-add-form">
          <VoiceInput
            placeholder="Tap mic to add tasks by voice"
            onResult={handleVoiceResult}
          />
          <div className="todo-input-row">
            <input
              type="text"
              placeholder="Add a task..."
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              className="todo-input"
            />
            <button type="submit" className="todo-add-btn">+</button>
          </div>
        </form>

        {/* Todo list */}
        {todos.length === 0 ? (
          <p className="todo-empty">No tasks yet. Add your first task above!</p>
        ) : (
          <div className="todo-list">
            {todos.filter(t => !t.completed).map(todo => (
              <div key={todo.id} className="todo-item">
                <button
                  type="button"
                  className="todo-checkbox"
                  onClick={() => handleToggle(todo)}
                  aria-label="Mark as complete"
                >
                  <span className="checkbox-icon">○</span>
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  type="button"
                  className="todo-delete"
                  onClick={() => handleDelete(todo.id)}
                  aria-label="Delete task"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Completed items */}
            {todos.some(t => t.completed) && (
              <>
                <div className="todo-completed-header">Completed</div>
                {todos.filter(t => t.completed).map(todo => (
                  <div key={todo.id} className="todo-item completed">
                    <button
                      type="button"
                      className="todo-checkbox checked"
                      onClick={() => handleToggle(todo)}
                      aria-label="Mark as incomplete"
                    >
                      <span className="checkbox-icon">✓</span>
                    </button>
                    <span className="todo-text">{todo.text}</span>
                    <button
                      type="button"
                      className="todo-delete"
                      onClick={() => handleDelete(todo.id)}
                      aria-label="Delete task"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
