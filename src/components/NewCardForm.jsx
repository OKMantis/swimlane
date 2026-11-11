import { useRef, useState } from 'react'
import { useBoard } from '../context/boardContext'

export default function NewCardForm({ columnId }) {
  const { addCard } = useBoard()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null) // a "box" that holds the real <input> DOM node

  async function handleSubmit(event) {
    event.preventDefault() // stop the browser's full-page form submit
    if (title.trim() === '') return

    setSaving(true)
    const ok = await addCard(columnId, { title: title.trim(), priority })
    setSaving(false)

    if (ok) {
      setTitle('')
      inputRef.current.focus() // keep typing the next card straight away
    }
  }

  function handleCancel() {
    setIsOpen(false)
    setTitle('')
  }

  if (!isOpen) {
    return (
      <button type="button" className="add-card-button" onClick={() => setIsOpen(true)}>
        + Add a card
      </button>
    )
  }

  return (
    <form className="new-card-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Card title"
      />
      <select value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <div className="form-actions">
        <button type="button" className="button button-ghost" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="button" disabled={saving || title.trim() === ''}>
          {saving ? 'Adding…' : 'Add'}
        </button>
      </div>
    </form>
  )
}
