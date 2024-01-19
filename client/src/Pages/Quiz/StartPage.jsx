import React from 'react';
import ReactLoading from 'react-loading';

// Start Page of Quiz Excercise
const StartPage = ({createQuizExcercise}) => {
  return (
    <div id='StartQuizPage'>
      <div id="StartPage">
        {/* <ReactLoading type={"balls"} color={"#00a0ff"} height={'20%'} width={'10%'} /> */}
        <h3>Ready to Start Your Quiz?</h3>
        <h3>You have 10 minutes to take this quiz.</h3>
        <button onClick={()=>createQuizExcercise()}>Start Quiz</button>
      </div>
    </div>
  )
}

export default StartPage