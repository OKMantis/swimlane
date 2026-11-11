import { useEffect, useState } from 'react'
import { useBoard } from '../context/boardContext'

export default function CardModal({ card, onClose }) {
  const { columns, updateCard, deleteCard } = useBoard()

  // One state object for the whole form. It starts as a COPY of the card,
  // so typing doesn't change the real card until you press Save.
  const [form, setForm] = useState({
    title: card.title,
    description: card.description ?? '',
    priority: card.priority,
    dueDate: card.dueDate ?? '',
    columnId: card.columnId,
  })
  const [saving, setSaving] = useState(false)

  // Side effect: listen for the Escape key while the modal is open.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown) // cleanup on close
  }, [onClose])

  // One handler for every field, thanks to the input's name attribute.
  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.title.trim() === '') return
    setSaving(true)
    const ok = await updateCard(card.id, { ...form, title: form.title.trim() })
    setSaving(false)
    if (ok) onClose()
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${card.title}"?`)) return
    const ok = await deleteCard(card.id)
    if (ok) onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation: clicks inside the modal must not reach the overlay */}
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>Edit card</h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            Title
            <input name="title" value={form.title} onChange={handleChange} />
          </label>

          <label className="field">
            Description
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
          </label>

          <div className="field-row">
            <label className="field">
              Priority
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="field">
              Due date
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </label>

            <label className="field">
              Column
              <select name="columnId" value={form.columnId} onChange={handleChange}>
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="button button-danger" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="button button-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button" disabled={saving || form.title.trim() === ''}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
