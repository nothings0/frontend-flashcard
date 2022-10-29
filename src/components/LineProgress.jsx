import React from 'react'

const LineProgress = ({value, length}) => {

  return (
    <div className="line-progress">
        <div className="line-progress__value" style={{width: `${ ((value + 1) / length)*100}%`}}></div>
    </div>
  )
}

export default LineProgress