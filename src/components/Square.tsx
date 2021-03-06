import React from 'react'
import classNames from 'classnames'

interface SquareProps {
  isSnakeBody: boolean
  isSnakeEnd: boolean
  isSnakeHead: boolean
  isApple: boolean
}

export const Square: React.FC<SquareProps> = React.memo((props) => {
  return (
    <div
      className={classNames(
        'square',
        { snake: props.isSnakeBody },
        { snake: props.isSnakeHead },
        { snake: props.isSnakeEnd }
      )}
    >
      {props.isApple && (
        <img
          className="apple"
          src={require('../images/Apple.png')}
          alt="apple"
        />
      )}
    </div>
  )
})
