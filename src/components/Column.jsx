import { useBoard } from '../context/boardContext'
import Card from './Card'
import NewCardForm from './NewCardForm'

export default function Column({ column, onOpenCard }) {
  const { cards } = useBoard() // read straight from context — no more prop drilling
  const columnCards = cards
    .filter((card) => card.columnId === column.id)
    .sort((a, b) => a.position - b.position) // filter() already made a new array, so sort() is safe

  return (
    <section className="column">
      <header className="column-header">
        <h2>{column.title}</h2>
        <span className="count">{columnCards.length}</span>
      </header>

      <div className="card-list">
        {columnCards.map((card) => (
          <Card key={card.id} card={card} onOpen={onOpenCard} />
        ))}
        {columnCards.length === 0 && <p className="empty">No cards</p>}
      </div>

      <NewCardForm columnId={column.id} />
    </section>
  )
}
