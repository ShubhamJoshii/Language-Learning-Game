import React from 'react';
import ReactLoading from 'react-loading';

const TimeOut = () => {
  return (
    <div id='StartQuizPage'>
      <div id="TimeOut">
        <ReactLoading type={"balls"} color={"#00a0ff"} height={'20%'} width={'10%'} />
        <h3>Please Wait We are Loading Quiz Section...</h3>
      </div>
    </div>
  )
}

export default TimeOut