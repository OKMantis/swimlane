import Column from "./Column";

export default function Board({ columns, cards }) {
  return (
    <div className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          cards={cards.filter((card) => card.columnId === column.id)}
        />
      ))}
    </div>
  )
}