import { createContext, useContext } from 'react'

// 1. The context object itself. It starts as null: "no provider above me".
export const BoardContext = createContext(null)

// 2. A custom hook so components never touch BoardContext directly,
//    and get a clear error if they're rendered outside <BoardProvider>.
export function useBoard() {
  const context = useContext(BoardContext)
  if (context === null) {
    throw new Error('useBoard() must be used inside <BoardProvider>')
  }
  return context
}