import Board from './components/Board'

// Temporary hard-coded data. In step 6 this comes from the API instead.
const sampleColumns = [
  { id: 'colA', title: 'To Do', position: 0 },
  { id: 'colB', title: 'Doing', position: 1 },
  { id: 'colC', title: 'Done', position: 2 },
]

const sampleCards = [
  { id: 'c1', columnId: 'colA', title: 'Second in To Do', priority: 'low', dueDate: '', position: 1 },
  { id: 'c2', columnId: 'colA', title: 'First in To Do', priority: 'high', dueDate: '2026-01-15', position: 0 },
  { id: 'c3', columnId: 'colB', title: 'Render a list with map()', priority: 'medium', dueDate: '', position: 0 },
]

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🏊 Swimlane</h1>
      </header>
      <main>
        <Board columns={sampleColumns} cards={sampleCards} />
      </main>
    </div>
  )
}
