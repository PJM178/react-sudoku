'use client'

import { useCallback, useEffect, useState, useMemo } from 'react';
import styles from './page.module.css'
import SudokuField from './SudokuField';

type DifficultyTypes = "hard" | "normal" | "easy" | "too easy"

export default function Home() {
  const [sudokuBoard, setSudokuBoard] = useState<{ fullBoard: (number | string)[][], playBoard: (number | string)[][] }>({ fullBoard: [], playBoard: [] });
  const [difficulty, setDifficulty] = useState<DifficultyTypes>("normal");

  const shuffle = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  const boardDifficulty = (difficulty: DifficultyTypes) => {
    switch (difficulty) {
      case ("too easy"):
        return 0.05;
      case ("easy"):
        return 0.2;
      case ("normal"):
        return 0.5;
      case ("hard"):
        return 0.8;
      default:
        return 0.5;
    }
  };

  const initiateSudokuBoard = useCallback(() => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const mat: (number | string)[][] = [];
    const shuffledArr = shuffle(arr.slice());
    mat.push(shuffledArr);
    for (let i = 1; i < 9; i++) {
      while (mat.length <= i) {
        const newArr = shuffle(arr.slice());
        let stop = false;
        for (let j = 0; j < arr.length; j++) {
          for (let k = 0; k < i; k++) {
            if (mat[k].indexOf(newArr[j]) === j) stop = true;
          }
        }
        if (!stop) {
          mat.push(newArr);
        }
      }
    }
    return mat;
  }, []);

  const randomizeBoard = useCallback(((board: (number | string)[][]) => {
    const newBoard = board.map(arr => arr.slice().map(r => {
      if (Math.random() < boardDifficulty(difficulty)) {
        return r = "";
      } else {
        return r = r;
      }
    }));
    return newBoard;
  }), [difficulty]);

  const handleNewBoard = () => {
    const board = initiateSudokuBoard();
    const secondBoard = randomizeBoard(board);
    setSudokuBoard({ fullBoard: board, playBoard: secondBoard });
    localStorage.setItem("winning-sudoku-board", JSON.stringify(board));
  };

  useEffect(() => {
    const board = initiateSudokuBoard();
    const secondBoard = randomizeBoard(board);
    setSudokuBoard({ fullBoard: board, playBoard: secondBoard });
    localStorage.setItem("winning-sudoku-board", JSON.stringify(board));
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.sudokuBoard}>
        {sudokuBoard.playBoard.map((array, j) => {
          return (
            array.map((array, k) => (
              <SudokuField key={k} j={j} k={k} value={array} sudokuBoard={sudokuBoard.playBoard} setSudokuBoard={setSudokuBoard} />
            ))
          )
        })}
      </div>
      <div className={styles.settingsContainer}>
        <button className={styles.newBoardButton} onClick={handleNewBoard}>Get new board</button>
        <select className={styles.newBoardButton} defaultValue={difficulty} onChange={(e) => setDifficulty(e.target.value.toLowerCase() as DifficultyTypes)}>
          <option value="too easy">Too easy</option>
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      {JSON.stringify(sudokuBoard.fullBoard) === JSON.stringify(sudokuBoard.playBoard) && sudokuBoard.fullBoard.length > 0 &&
        <div>You win!</div>}
    </main>
  )
}
