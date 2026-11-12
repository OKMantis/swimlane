import { useBoard } from '../context/boardContext'

const EMPTY_FILTERS = { query: '', priority: 'all' }

export default function FilterBar() {
  const { filters, setFilters } = useBoard()

  function handleChange(event) {
    const { name, value } = event.target
    setFilters((previous) => ({...previous, [name]: value }))
  }

  const isFiltering = filters.query != '' || filters.priorities !== 'all'

  return (
    <div className='filter-bar'>
      <input 
        type="search"
        name="query"
        value={filters.query}
        onChange={handleChange}
        placeholder="Search title or description"
      />
      <select name="priority" value={filters.priority} onChange={handleChange}>
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      {isFiltering && (
        <button type="button" className="button button-ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
          Clear filters
        </button>
      )}
    </div>
  )
}