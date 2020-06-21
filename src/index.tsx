import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button
        className={props.winner ? "square-winner" : "square"}
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

type BoardProps = {
  squares: Array<String>;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  winningLines: Array<number>;
};

class Board extends React.Component<BoardProps> {

  renderSquare(i, winner) {
    return <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={winner}
      />
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, this.props.winningLines.some(e => e === 0))}
          {this.renderSquare(1, this.props.winningLines.some(e => e === 1))}
          {this.renderSquare(2, this.props.winningLines.some(e => e === 2))}
        </div>
        <div className="board-row">
          {this.renderSquare(3, this.props.winningLines.some(e => e === 3))}
          {this.renderSquare(4, this.props.winningLines.some(e => e === 4))}
          {this.renderSquare(5, this.props.winningLines.some(e => e === 5))}
        </div>
        <div className="board-row">
          {this.renderSquare(6, this.props.winningLines.some(e => e === 6))}
          {this.renderSquare(7, this.props.winningLines.some(e => e === 7))}
          {this.renderSquare(8, this.props.winningLines.some(e => e === 8))}
        </div>
      </div>
    );
  }
}

type SideProps = {
  value: number;
};

class Side extends React.Component<SideProps> {
  render () {
    return (
      <div><b>Turns:</b> {this.props.value}</div>
    );
  }
}

type BoardState = {
  squares: Array<String>;
};

type GameState = {
  history: Array<BoardState>;
  stepNumber: number;
  xIsNext: boolean;
}

class Game extends React.Component<{}, GameState> {
  constructor(props) {
    super(props);
    this.state = {
      history: [{squares: Array(9).fill(null)}],
      stepNumber: 0,
      xIsNext: true
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const [winner, lines] = calculateWinner(squares);

    if (winner || squares[i]) {
      console.log("Illegal move");
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const [winner, lines] = calculateWinner(squares);
    let status: String;

    if (winner) {
      status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            winningLines={lines}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="side">
          <Side value={this.state.stepNumber}/>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares: Array<String>): [String | null, Array<number>] {
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
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}