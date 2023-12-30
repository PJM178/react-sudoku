import styles from './page.module.css'

const SudokuField = ({ value, setSudokuBoard, j, k, sudokuBoard }: {
  value: number | string,
  setSudokuBoard: React.Dispatch<React.SetStateAction<{ fullBoard: (number | string)[][]; playBoard: (number | string)[][]; }>>,
  j: number,
  k: number,
  sudokuBoard: (number | string)[][]
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSudokuBoard(prevValue => {
      const fullBoard = prevValue.fullBoard;
      const playBoard = prevValue.playBoard.map((value, i) => {
        if (i === j) {
          if (Number(e.target.value) > 9) {
            value[k] = 9;
          } else if (Number(e.target.value) < 0) {
            value[k] = 0;
          } else {
            value[k] = Number(e.target.value);
          }
          return value;
        }
        return value;
      })
      return { fullBoard, playBoard };
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      setSudokuBoard(prevValue => {
        const fullBoard = prevValue.fullBoard
        const playBoard = prevValue.playBoard.map((value, i) => {
          if (i === j) {
            value[k] = "";
            return value;
          }
          return value;
        })
        return { fullBoard, playBoard };
      })
    }
  };

  return (
    <input className={styles.sudokuField} type='number' value={value} onKeyDown={e => handleKeyDown(e)} onChange={(e) => handleChange(e)} />
  )
};

export default SudokuField;