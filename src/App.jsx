import { useEffect, useState } from 'react'
import { api } from './api'
import Board from './components/Board'

export default function App() {
  const [columns, setColumns] = useState([])
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false // guards against setting state after this effect was cleaned up

    async function loadFirstBoard() {
      try {
        const boards = await api.getBoards()
        if (boards.length === 0) return
        const boardColumns = await api.getColumns(boards[0].id)
        const boardCards = await api.getCards(boardColumns.map((column) => column.id))

        if (!ignore) {
          setColumns(boardColumns)
          setCards(boardCards)
        }
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadFirstBoard()
    return () => {
      ignore = true
    }
  }, []) // empty array = run once, after the first render

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏊 Swimlane</h1>
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
