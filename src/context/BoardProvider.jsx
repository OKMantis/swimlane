import { useEffect, useReducer, useState } from 'react'
import { api } from '../api'
import { BoardContext } from './boardContext'
import { boardReducer, initialBoardState } from '../boardReducer'

// The provider component owns ALL board state and the actions that change it.
export function BoardProvider({ boardId, children }) {
  const [state, dispatch] = useReducer(boardReducer, initialBoardState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [filters, setFilters] = useState({ query: '', priority: 'all' })

  useEffect(() => {
    let ignore = false

    async function loadBoard() {
      try {
        const columns = await api.getColumns(boardId)
        const cards = await api.getCards(columns.map((column) => column.id))
        if (!ignore) dispatch({ type: 'boardLoaded', columns, cards })
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBoard()
    return () => {
      ignore = true
    }
  }, [boardId])

  async function addCard(columnId, fields) {
    const position = state.cards.filter((card) => card.columnId === columnId).length
    try {
      const card = await api.createCard({
        columnId,
        title: fields.title,
        description: '',
        priority: fields.priority,
        dueDate: '',
        position,
      })
      dispatch({ type: 'cardAdded', card })
      return true
    } catch (err) {
      setNotice(err.message)
      return false
    }
  }

  async function updateCard(cardId, changes) {
    const current = state.cards.find((card) => card.id === cardId)
    const patch = { ...changes }
    if (changes.columnId && changes.columnId !== current.columnId) {
      patch.position = state.cards.filter((card) => card.columnId === changes.columnId).length
    }
    try {
      const card = await api.updateCard(cardId, patch)
      dispatch({ type: 'cardUpdated', card })
      return true
    } catch (err) {
      setNotice(err.message)
      return false
    }
  }

  async function deleteCard(cardId) {
    try {
      await api.deleteCard(cardId)
      dispatch({ type: 'cardRemoved', cardId })
      return true
    } catch (err) {
      setNotice(err.message)
      return false
    }
  }

  const value = {
    columns: state.columns,
    cards: state.cards,
    loading,
    error,
    notice,
    dismissNotice: () => setNotice(null),
    filters,
    setFilters,
    addCard,
    updateCard,
    deleteCard,
  }

  // React 19: render the context itself as the provider.
  return <BoardContext value={value}>{children}</BoardContext>
}
