import Card from './Card'

export default function Column({ column, cards }) {
  // Never mutate props: copy the array before sorting it.
  const sortedCards = [...cards].sort((a, b) => a.position - b.position)

  return (
    <section className='column'>
      <header className='column-header'>
        <h2>{column.title}</h2>
        <span className='count'>{cards.length}</span>
      </header>

      <div className='card-list'>
        {sortedCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
        {sortedCards.length === 0 && <p className='empty'>No cards</p>}
      </div>
    </section>
  )
}