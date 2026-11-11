import { useState } from 'react'
import { useBoard } from '../context/boardContext'
import CardModal from './CardModal'
import Column from './Column'

export default function Board() {
  const { columns, cards, loading, error, notice, dismissNotice } = useBoard()
  const [selectedCardId, setSelectedCardId] = useState(null)
  const selectedCard = cards.find((card) => card.id === selectedCardId)

  // Hooks first, early returns after — hooks must run in the same order every render.
  if (loading) return <p className="status">Loading board…</p>
  if (error) {
    return (
      <p className="status status-error">
        Could not load the board: {error}. Is json-server running? (npm run api)
      </p>
    )
  }

  return (
    <>
      {notice && (
        <div className="notice">
          {notice}
          <button type="button" onClick={dismissNotice} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <div className="board">
        {columns.map((column) => (
          <Column key={column.id} column={column} onOpenCard={setSelectedCardId} />
        ))}
      </div>

      {selectedCard && (
        <CardModal key={selectedCard.id} card={selectedCard} onClose={() => setSelectedCardId(null)} />
      )}
    </>
  )
}
