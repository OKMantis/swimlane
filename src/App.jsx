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
        {loading && <p className="status">Loading board…</p>}
        {error && (
          <p className="status status-error">
            Could not load the board: {error}. Is json-server running? (npm run api)
          </p>
        )}
        {!loading && !error && <Board columns={columns} cards={cards} />}
      </main>
    </div>
  )
}
