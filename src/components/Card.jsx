import PriorityBadge from './PriorityBadge'

// A plain JavaScript helper. Components are just functions, so helpers can live next to them.
function isOverdue(dueDate) {
  if (!dueDate) return false
  const today = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  return dueDate < today // ISO date strings compare correctly as text
}

export default function Card({ card, onOpen }) {
  return (
    <article className="card" onClick={() => onOpen(card.id)}>
      <h3 className="card-title">{card.title}</h3>
      <div className="card-meta">
        <PriorityBadge priority={card.priority} />
        {card.dueDate && (
          <span className={isOverdue(card.dueDate) ? 'due overdue' : 'due'}>
            📅 {card.dueDate}
          </span>
        )}
      </div>
    </article>
  )
}
