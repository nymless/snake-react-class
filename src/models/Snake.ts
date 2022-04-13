import { Observable } from '../utils/Observable'

export class Snake extends Observable {
  private static directions = {
    right: 'ArrowRight',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    up: 'ArrowUp',
  } as const

  private static validTurns = {
    // TODO: Another validTurns realization.
    // Circular doubly linked list?
    // Next and prev methods will be valid turns.
    // All list nodes saved in links for quick finding.
    // Links in directions static field.
    [Snake.directions.right]: {
      leftTurn: Snake.directions.up,
      rightTurn: Snake.directions.down,
    },
    [Snake.directions.down]: {
      leftTurn: Snake.directions.right,
      rightTurn: Snake.directions.left,
    },
    [Snake.directions.left]: {
      leftTurn: Snake.directions.down,
      rightTurn: Snake.directions.up,
    },
    [Snake.directions.up]: {
      leftTurn: Snake.directions.left,
      rightTurn: Snake.directions.right,
    },
  } as const

  private static getInitCoords = () => {
    return [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]
  }

  private static initDirection = Snake.directions.right

  private coords
  private direction: typeof Snake.directions[keyof typeof Snake.directions]

  constructor() {
    super()
    this.coords = Snake.getInitCoords()
    this.direction = Snake.initDirection
  }

  getCoords = () => {
    return this.coords
  }

  getDirection = () => {
    return this.direction
  }

  reset = () => {
    this.coords = Snake.getInitCoords()
    this.direction = Snake.initDirection
  }

  turn = (key: string) => {
    type validKey = typeof this.direction
    function isValidType(key: string): key is validKey {
      let isValid = false
      for (let value of Object.values(Snake.directions))
        if (value === key) {
          isValid = true
          break
        }
      return isValid
    }
    if (!isValidType(key)) {
      return
    }
    const isValidTurn = (key: validKey) => {
      let validTurns = Snake.validTurns[this.direction]
      return validTurns.leftTurn === key || validTurns.rightTurn === key
    }
    if (!isValidTurn(key)) {
      return
    }
    this.direction = key
  }

  private step = () => {
    let snake = this.coords
    let way = this.direction
    let newHead = { ...snake[snake.length - 1] }
    if (way === Snake.directions.right) newHead.x += 1
    if (way === Snake.directions.left) newHead.x -= 1
    if (way === Snake.directions.down) newHead.y += 1
    if (way === Snake.directions.up) newHead.y -= 1
    this.coords.push(newHead)
  }

  grow = () => {
    this.step()
    this.notify()
  }

  move = () => {
    this.step()
    this.coords.shift()
    this.notify()
  }
}
