import { useEffect, useState } from 'react'
import { api } from './api'
import { BoardProvider } from './context/BoardProvider'
import Board from './components/Board'
import BoardPicker from './components/BoardPicker'

export default function App() {
  const [boards, setBoards] = useState(null) // null = not loaded yet
  const [selectedBoardId, setSelectedBoardId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getBoards()
      .then((data) => {
        setBoards(data)
        if (data.length > 0) setSelectedBoardId(data[0].id)
      })
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏊 Swimlane</h1>
        {boards && boards.length > 0 && (
          <BoardPicker boards={boards} selectedBoardId={selectedBoardId} onSelect={setSelectedBoardId} />
        )}
      </header>
      <main>
        {error && (
          <p className="status status-error">
            Could not load boards: {error}. Is json-server running? (npm run api)
          </p>
        )}
        {!error && boards === null && <p className="status">Loading boards…</p>}
        {boards && boards.length === 0 && <p className="status">No boards yet — add one to db.seed.json.</p>}

        {/* key={selectedBoardId}: a new board id = a brand-new provider with fresh state */}
        {selectedBoardId && (
          <BoardProvider key={selectedBoardId} boardId={selectedBoardId}>
            <Board />
          </BoardProvider>
        )}
      </main>
    </div>
  )
}
