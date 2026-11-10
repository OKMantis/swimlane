// A reducer is a PURE function: (currentState, action) => nextState.
// No fetch calls, no randomness, no mutation — just "given this event, what's the new state?"
export const initialBoardState = {
  columns: [],
  cards: [],
}

export function boardReducer(state, action) {
  switch (action.type) {
    case 'boardLoaded':
      return { columns: action.columns, cards: action.cards }

    case 'cardAdded':
      return { ...state, cards: [...state.cards, action.card] }

    case 'cardUpdated':
      return { 
        ...state,
        cards: state.cards.map((card) => (card.id === action.card.id ? action.card : card)),
      }

    case 'cardRemoved':
      return { ...state, cards: state.cards.filter((card) => card.id !== action.cardId) }

    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}