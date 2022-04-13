import { Snake } from './Snake'
import { getRandomInt } from '../utils/getRandomInt'

export class Apple {
  private static getInitCoords = () => {
    return { x: 8, y: 4 }
  }

  private coords
  private snake

  constructor(snake: Snake) {
    this.snake = snake
    this.coords = Apple.getInitCoords()
  }

  getCoords = () => {
    return this.coords
  }

  reset = () => {
    this.coords = Apple.getInitCoords()
  }

  private randomCoords = () => {
    return { x: getRandomInt(0, 16), y: getRandomInt(0, 9) }
  }

  setRandomCoords = () => {
    //TODO: Another setRandom realization.
    // Get random coords once and with snake coords considered.
    // To avoid coords rolled many times on late game (long snake)
    let appleCoords = this.randomCoords()
    let snakeCoords = this.snake.getCoords()
    let maybeOnSnakeCoords = true
    outer: while (maybeOnSnakeCoords) {
      for (let i = 0; i < snakeCoords.length; i++) {
        let сoords = snakeCoords[i]
        if (appleCoords.x === сoords.x && appleCoords.y === сoords.y) {
          appleCoords = this.randomCoords()
          continue outer
        }
      }
      maybeOnSnakeCoords = false
    }
    this.coords = appleCoords
  }
}
