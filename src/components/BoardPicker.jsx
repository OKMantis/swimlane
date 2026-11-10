export default function BoardPicker({ boards, selectedBoardId, onSelect} ) {
  return (
    <label className="board-picker">
      Board
      <select value={selectedBoardId ?? ''} onChange={(event) => onSelect(event.target.value)}>
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select>
    </label>
  )
}