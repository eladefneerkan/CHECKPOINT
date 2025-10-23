import { useState } from 'react';

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}



export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [turns, setTurns] = useState(0);
  const [squares, setSquares] = useState(Array(9).fill(null))
  let selectedSquare = null;

  function handleClick(i) {
    if (calculateWinner(squares)) { //prevent moving after game is finished
      return; //return early
    }

    //after 3 moves are made (second click - destination)
    if (selectedSquare != null) {
      //invalid selection
      //selecting an already filled spot
      if (squares[i]) {
        selectedSquare = null;
        return; //revert to start of move
      }
      // can only move to adjacent tiles
      if ((selectedSquare == 0 || selectedSquare == 3 || selectedSquare == 6) && (i == 2 || i == 5 || i == 8)) { //left side
        selectedSquare = null;
        return;
      } else if ((selectedSquare == 0 || selectedSquare == 1 || selectedSquare == 2) && (i == 6 || i == 7 || i == 8)) { //top side
        selectedSquare = null;
        return;
      } else if ((selectedSquare == 2 || selectedSquare == 5 || selectedSquare == 8) && (i == 0 || i == 3 || i == 6)) { //right side
        selectedSquare = null;
        return;
      } else if ((selectedSquare == 6 || selectedSquare == 7 || selectedSquare == 8) && (i == 0 || i == 1 || i == 2)) { //bottom side
        selectedSquare = null;
        return;
      }
      //valid selection
      const tempSquares = squares.slice(); //make copy of array
      tempSquares[i] = squares[selectedSquare]; //move the piece to new spot
      tempSquares[selectedSquare] = null; //make original spot blank
      selectedSquare = null;

      if (!calculateWinner(tempSquares)) { //if the move doesn't win the game
        if (xIsNext) {
          if (squares[4] == "X" && tempSquares[4] == "X") { //if X hasn't vacated the middle
            return; //revert move without updating
          }
        } else {
          if (squares[4] == "O" && tempSquares[4] == "O") { //if O hasn't vacated the middle
            return; //revert move without updating
          }
        }
      }
      setSquares(tempSquares); //update squares with new state


    //before 3 moves are made
    } else if (turns < 6) { 
      if (squares[i]) { //prevent double marking
        return; //return early
      }
      const nextSquares = squares.slice(); //use copy of array
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      setSquares(nextSquares);


    } else { //after 3 moves are made (first click - source)
      if (xIsNext) { 
        if (squares[i] == "X") {
          selectedSquare = i; //store square to move
        }
      } else {
        if (squares[i] == "O") {
          selectedSquare = i; //store square to move
        }
      }
      return;
    }

    setTurns(turns + 1); //increment turns
    setXIsNext(!xIsNext); //flip turns
  }


  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
    <div className="status">{status}</div>
    <div className="status">{turns}</div>

      <div className="board-row">
         <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
         <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
         <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
         <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
         <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
         <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>
      <div className="board-row">
         <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
         <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
         <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  )
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}