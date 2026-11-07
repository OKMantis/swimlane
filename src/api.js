// All HTTP calls live in one module, the way you'd keep API logic out of a Rails view.
const API_URL = 'http://localhost:3001'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // fetch() only rejects on network failure, NOT on 404/500 — so check ourselves.
  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed (${response.status})`)
  }
  return response.json()
}

export const api = {
  getBoards: () => request('/boards'),

  getColumns: (boardId) => request(`/columns?boardId=${boardId}&_sort=position`),

  getCards: (columnIds) => {
    if (columnIds.length === 0) return Promise.resolve([])
    return request(`/cards?columnId:in=${columnIds.join(',')}&_sort=position`)
  },

  createCard: (card) => request('/cards', { method: 'POST', body: JSON.stringify(card) }),
}
