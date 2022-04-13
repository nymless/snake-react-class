import React from 'react'
import { Apple } from '../models/Apple'
import { Snake } from '../models/Snake'
import { Board } from './Board'
import './SnakeGame.scss'

const getInitialSquares = () => {
  const square = {
    isSnakeBody: false,
    isSnakeHead: false,
    isSnakeEnd: false,
    isApple: false,
  }
  const squares = Array<typeof square[]>(9)
  for (let i = 0; i < squares.length; i++) {
    const row = Array<typeof square>(16)
    for (let i = 0; i < row.length; i++) {
      row[i] = { ...square }
    }
    squares[i] = row
  }
  return squares
}

const getBestScores = () => {
  return Number(localStorage.getItem('bestScore'))
}

const getInitialState = () => {
  return {
    squares: getInitialSquares(),
    appleEaten: false,
    tailBitten: false,
    borderCrossed: false,
    gameStarted: false,
    directionChanged: false,
    scoreCount: 0,
    bestScore: getBestScores(),
  }
}

export type Squares = ReturnType<typeof getInitialSquares>
type InitialState = ReturnType<typeof getInitialState>

export class SnakeGame extends React.Component<{}, InitialState> {
  constructor(props: {}) {
    super(props)
    this.state = getInitialState()
  }

  snake = new Snake()
  apple = new Apple(this.snake)

  timerID?: NodeJS.Timer
  unsubscribe?: ReturnType<typeof this.snake.subscribe>

  componentDidMount = () => {
    this.unsubscribe = this.snake.subscribe(this.onSnakeChange)
  }

  componentWillUnmount = () => {
    if (this.timerID) {
      clearInterval(this.timerID)
    }
    document.removeEventListener('keydown', this.onKeydown)
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  onSnakeChange = () => {
    if (this.isBorderCrossed()) {
      this.setState({ borderCrossed: true })
      this.stopGame()
      return
    }
    if (this.isTailBitten()) {
      this.setState({ tailBitten: true })
      this.stopGame()
      return
    }
    if (this.isAppleEaten()) {
      this.setState({ appleEaten: true })
      this.increaseScore()
    }
    this.setSquares()
  }

  setSquares = () => {
    let newSquares = getInitialSquares()
    let snake = this.snake.getCoords()
    let apple = this.apple.getCoords()
    snake.forEach((coords, index, array) => {
      let path = newSquares[coords.y][coords.x]
      if (index === 0) {
        path.isSnakeEnd = true
      } else if (index === array.length - 1) {
        path.isSnakeHead = true
      } else {
        path.isSnakeBody = true
      }
    })
    newSquares[apple.y][apple.x].isApple = true
    this.setState({ squares: newSquares })
  }

  resetSquares = () => {
    this.setState(getInitialState(), this.setSquares)
  }

  isAppleEaten = () => {
    let snakeCoords = this.snake.getCoords()
    let snakeHead = snakeCoords[snakeCoords.length - 1]
    let apple = this.apple.getCoords()
    return snakeHead.x === apple.x && snakeHead.y === apple.y
  }

  isBorderCrossed = () => {
    let snakeCoords = this.snake.getCoords()
    let head = snakeCoords[snakeCoords.length - 1]
    return head.x < 0 || head.x > 15 || head.y < 0 || head.y > 8
  }

  isTailBitten = () => {
    let snakeCoords = this.snake.getCoords()
    let head = snakeCoords[snakeCoords.length - 1]
    let headSquare = this.state.squares[head.y][head.x]
    return headSquare.isSnakeBody && !headSquare.isSnakeEnd
  }

  onKeydown = (event: KeyboardEvent) => {
    if (this.state.directionChanged) {
      return
    }
    this.setState({ directionChanged: true })
    this.snake.turn(event.key)
  }

  increaseScore = () => {
    this.setState((state) => {
      let count = state.scoreCount
      return { scoreCount: count + 1 }
    })
  }

  setBestScores = () => {
    if (this.state.bestScore < this.state.scoreCount) {
      localStorage.setItem('bestScore', String(this.state.scoreCount))
    }
  }

  clearBestScores = () => {
    localStorage.removeItem('bestScore')
    this.setState({ bestScore: 0 })
  }

  gameActions = () => {
    if (this.state.appleEaten) {
      this.setState({ appleEaten: false })
      this.apple.setRandomCoords()
      this.snake.grow()
    } else {
      this.snake.move()
    }
    if (this.state.directionChanged) {
      this.setState({ directionChanged: false })
    }
  }

  startTimer = () => {
    this.timerID = setInterval(() => {
      this.gameActions()
    }, 500)
  }

  startGame = () => {
    this.setState({ gameStarted: true })
    document.addEventListener('keydown', this.onKeydown)
    this.startTimer()
  }

  stopTimer = () => {
    clearInterval(this.timerID as NodeJS.Timeout)
  }

  stopGame = () => {
    this.pauseGame()
    this.setBestScores()
  }

  pauseGame = () => {
    this.stopTimer()
    this.setState({ gameStarted: false })
    document.removeEventListener('keydown', this.onKeydown)
  }

  onClickStart = () => {
    if (!this.state.gameStarted) {
      this.startGame()
    } else {
      this.pauseGame()
    }
  }

  onClickReset = () => {
    this.snake.reset()
    this.apple.reset()
    this.resetSquares()
  }

  render() {
    return (
      <div className="snakeGame">
        <Board
          tailBitten={this.state.tailBitten}
          borderCrossed={this.state.borderCrossed}
          squares={this.state.squares}
        />
        <div className="gameInfo">
          {this.state.borderCrossed || this.state.tailBitten ? (
            <div role="button" className="button" onClick={this.onClickReset}>
              Reset game
            </div>
          ) : (
            <div role="button" className="button" onClick={this.onClickStart}>
              {this.state.gameStarted ? 'Pause game' : 'Start game'}
            </div>
          )}
          <div role="button" className="button" onClick={this.clearBestScores}>
            Clear score
          </div>
          <div className="score">
            <img
              className="apple"
              src={require('../images/Apple.png')}
              alt="apple"
            />
            <div>{'- ' + this.state.scoreCount}</div>
          </div>
          <div className="score">{'Best score - ' + this.state.bestScore}</div>
        </div>
      </div>
    )
  }
}
