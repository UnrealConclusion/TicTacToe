import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/** The square component renders a single button (a single grid space for the tic tac toe board) 
 * 
 * In react a function component differs from a class in that 
 * - a function component does not have their own state 
 * - a function component takes a prop as an input and returns what should be rendered
*/
function Square(props) { // props are parameters that are passed to a component 
  return (
    <button className="square" 
      onClick={props.onClick /** calls the onClick method of Board */}
    >
      {props.value /** displays the value from props */}
    </button>
  );
}

/** The board class simply renders 9 squares to create a tic tac toe board */
class Board extends React.Component {
  renderSquare(i) { /** Method creates a single square */
    return (
      <Square 
        value={this.props.squares[i]} /** store the id of the square in the board state */
        onClick={() => this.props.onClick(i)} /** call the handleClick method when the button is clicked */
      />
    );
  }

  render() {
    return (
      <div>
        {/** call the render square method 3 times for each row to create the board */}
        {/** the id of each square is passed into the render square method and assigned to the board state */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

/** the game class renders the board 
 * 
 * a react class has its own state 
 * when set state is called the component will rerender itself 
*/
class Game extends React.Component {
  constructor(props) {    
    super(props); // for JavaScript classes super needs to be called in the constuctor  
    this.state = {      
      history: [{        
        squares: Array(9).fill(null), // an array of 9 to represent the game board   
      }],      
      xIsNext: true, // boolean value that dictates whos turn it is 
      stepNumber: 0, // the number of moves that has been made 
    };  
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // if we go back in time and make another move, discard all of the previous future history from that point forward 
    const current = history[history.length - 1]; // current will be the last element in history 
    const squares = current.squares.slice();  // note that .slice() creates a copy of the square to modify (immutable data should be used so that it is easy to determine when rerendering is required)
    
    if (calculateWinner(squares) || squares[i]) { // if the space is filled or there is a winner return without doing anything
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ // when set state is called the component will rerender itself
      history: history.concat([{ // add the current board to history 
        squares: squares,      
      }]),      
      stepNumber: history.length, // update the move number 
      xIsNext: !this.state.xIsNext, // update whos turn it is 
    });
  }

  /** method jumps to a different point in history */
  jumpTo(step) {    
    this.setState({      
      stepNumber: step, // step number is changed -> board will be rerender according to step number we are on  
      xIsNext: (step % 2) === 0, // if step number is even, it is x's turn else it is o's turn 
    });  
  }

  render() {
    const history = this.state.history;    
    const current = history[this.state.stepNumber]; /** render the move according to the step number */
    const winner = calculateWinner(current.squares);  /** on each render check if there is a winner */

    /** maps the history of moves to a list of react buttons  */
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';      
      return ( /** stores the step number as the key for the move to be used to go back in history */
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>        
        </li>      
      );   
    });


    let status;    
    if (winner) {      
      status = 'Winner: ' + winner;    
    } else {      
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');    
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status /** display the game status */}</div>
          <ol>{moves /** display history of moves */}</ol>
        </div>
      </div>
    );
  }
}

/** function used to calculate if there is a winner */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
