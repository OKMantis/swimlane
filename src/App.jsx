import { useEffect, useState } from 'react'
import { api } from './api'
import Board from './components/Board'
import BoardPicker from './components/BoardPicker'

export default function App() {
  const [boards, setBoards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const [columns, setColumns] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null) // errors from create/update/delete

  // Effect 1: load the list of boards once.
  useEffect(() => {
    api
      .getBoards()
      .then((data) => {
        setBoards(data)
        if (data.length > 0) {
          setSelectedBoardId(data[0].id)
        } else {
          setLoading(false)
        }
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Effect 2: (re)load columns + cards every time selectedBoardId changes.
  useEffect(() => {
    if (!selectedBoardId) return
    let ignore = false

    async function loadBoard() {
      try {
        const boardColumns = await api.getColumns(selectedBoardId)
        const boardCards = await api.getCards(boardColumns.map((column) => column.id))
        if (!ignore) {
          setColumns(boardColumns)
          setCards(boardCards)
          setError(null)
        }
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBoard()
    return () => {
      ignore = true
    }
  }, [selectedBoardId]) // dependency array: re-run when this value changes

  // Returns true/false so the form knows whether to clear itself.
  async function handleAddCard(columnId, fields) {
    const position = cards.filter((card) => card.columnId === columnId).length
    try {
      const newCard = await api.createCard({
        columnId,
        title: fields.title,
        description: '',
        priority: fields.priority,
        dueDate: '',
        position,
      })
      // Immutable update: build a NEW array instead of cards.push(newCard)
      setCards((previous) => [...previous, newCard])
      return true
    } catch (err) {
      setNotice(err.message)
      return false
    }
  }

  function handleSelectBoard(boardId) {
    setLoading(true)
    setSelectedBoardId(boardId)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏊 Swimlane</h1>
        {boards.length > 0 && (
          <BoardPicker boards={boards} selectedBoardId={selectedBoardId} onSelect={handleSelectBoard} />
        )}
      </header>
      <main>
        {notice && (
          <div className="notice">
            {notice}
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}
        {loading && <p className="status">Loading board…</p>}
        {error && (
          <p className="status status-error">
            Could not load the board: {error}. Is json-server running? (npm run api)
          </p>
        )}
        {!loading && !error && <Board columns={columns} cards={cards} onAddCard={handleAddCard} />}
      </main>
    </div>
  )
}
