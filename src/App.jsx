import { useEffect, useReducer, useState } from 'react'
import { api } from './api'
import { boardReducer, initialBoardState } from './boardReducer'
import Board from './components/Board'
import BoardPicker from './components/BoardPicker'
import CardModal from './components/CardModal'

export default function App() {
  const [boards, setBoards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  // columns + cards now live in ONE reducer instead of two useState calls
  const [state, dispatch] = useReducer(boardReducer, initialBoardState)
  const { columns, cards } = state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null) // errors from create/update/delete
  const [selectedCardId, setSelectedCardId] = useState(null)

  // Derived value: store only the id, look the card up on every render.
  const selectedCard = cards.find((card) => card.id === selectedCardId)

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
          dispatch({ type: 'boardLoaded', columns: boardColumns, cards: boardCards })
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
  }, [selectedBoardId])

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
      dispatch({ type: 'cardAdded', card: newCard })
      return true
    } catch (err) {
      setNotice(err.message)
      return false
    }
  }

  async function handleUpdateCard(cardId, changes) {
    const current = cards.find((card) => card.id === cardId)
    const patch = { ...changes }
    if (changes.columnId && changes.columnId !== current.columnId) {
      patch.position = cards.filter((card) => card.columnId === changes.columnId).length
    }
    try {
      const saved = await api.updateCard(cardId, patch)
      dispatch({ type: 'cardUpdated', card: saved })
      return true
    } catch (err) {
      setNotice(err.message)
      return false
    }
  }

  async function handleDeleteCard(cardId) {
    try {
      await api.deleteCard(cardId)
      dispatch({ type: 'cardRemoved', cardId })
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
        {!loading && !error && (
          <Board
            columns={columns}
            cards={cards}
            onAddCard={handleAddCard}
            onOpenCard={setSelectedCardId}
          />
        )}
        {selectedCard && (
          <CardModal
            key={selectedCard.id}
            card={selectedCard}
            columns={columns}
            onSave={handleUpdateCard}
            onDelete={handleDeleteCard}
            onClose={() => setSelectedCardId(null)}
          />
        )}
      </main>
    </div>
  )
}
