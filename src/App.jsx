import Card from './components/Card'

const firstCard = {
  id: 'demo1',
  title: 'Learn what props are',
  priority: 'high',
  dueDate: '2026-01-15',
}

const secondCard = {
  id: 'demo2',
  title: 'Reuse the same component',
  priority: 'low',
  dueDate: '',
}

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🏊 Swimlane</h1>
      </header>
      <main>
        <div style={{ maxWidth: 280, display: 'grid', gap: 8 }}>
          <Card card={firstCard} />
          <Card card={secondCard} />
        </div>
      </main>
    </div>
  )
}
