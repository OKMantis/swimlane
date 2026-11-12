import { useMemo } from 'react'
import { useBoard } from '../context/boardContext'
import Card from './Card'
import NewCardForm from './NewCardForm'

function matchesFilters(card, filters) {
  const query = filters.query.trim().toLowerCase()
  const text = `${card.title} ${card.description ?? ''}`.toLowerCase()
  const matchesQuery = query === '' || text.includes(query)
  const matchesPriority = filters.priority === 'all' || card.priority === filters.priority
  return matchesQuery && matchesPriority
}

export default function Column({ column, onOpenCard }) {
  const { cards, filters } = useBoard()

  // useMemo: only recompute when cards or this column's id change.
  const columnCards = useMemo(
    () =>
      cards
        .filter((card) => card.columnId === column.id)
        .sort((a, b) => a.position - b.position),
    [cards, column.id],
  )

  // Derived state: calculated during render, never stored with useState.
  const visibleCards = columnCards.filter((card) => matchesFilters(card, filters))
  const isFiltered = visibleCards.length !== columnCards.length

  return (
    <section className="column">
      <header className="column-header">
        <h2>{column.title}</h2>
        <span className="count">
          {isFiltered ? `${visibleCards.length} of ${columnCards.length}` : columnCards.length}
        </span>
      </header>

      <div className="card-list">
        {visibleCards.map((card) => (
          <Card key={card.id} card={card} onOpen={onOpenCard} />
        ))}
        {visibleCards.length === 0 && (
          <p className="empty">{isFiltered ? 'No matching cards' : 'No cards'}</p>
        )}
      </div>

      <NewCardForm columnId={column.id} />
    </section>
  )
}
