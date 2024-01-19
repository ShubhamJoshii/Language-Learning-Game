import React, { useContext, useEffect, useState } from 'react'
import Filter from './Filter'
import "./styles.css"
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { UserData } from '../../App'
import { useNavigate } from 'react-router-dom'
import { notification } from '../../Components/Notification'
import axios from 'axios'
const index = () => {
  const { userData } = useContext(UserData)
  const [allQuiz, setAllQuiz] = useState([]);
  const params = useParams()
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    await axios.get("/api/fetchAllQuiz").then((response) => {
      setAllQuiz(response.data.Data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const startQuiz = () => {
    if (userData && params._id) {
      navigate(`/quiz/${params._id}`)
    } else if (!userData) {
      notification("Please Login before Staring Quiz", "Warning");
    } else if (!params._id) {
      notification("Please Select the Quiz First", "Warning");
    }
  }

  useEffect(() => {
    fetchQuiz();
  }, [])

  return (
    <div id='homepage'>
      <Filter allQuiz={allQuiz} />
      <div id='second-Half'>
        <h1>Play Online Quiz & Improve your Language!</h1>
        <ol>
          <div id='instruction-BTN'>
            <h3>Instructions:</h3>
            <select name='QuizSelect' id="QuizSelect" onChange={(e) => navigate(`/home/${e.target.value}`)} value={params._id}>
              <option selected value="">--select--</option>
              {
                allQuiz?.map((curr, id) => {
                  return (
                    <option value={curr._id} >{curr.Language}</option>
                  )
                })
              }
            </select>
          </div>
          <li>To begin the quiz, you need to <NavLink to="/login">log in</NavLink> or authenticate. If you don't have an account, please <NavLink to="/register">sign up</NavLink>. This step ensures that your progress is saved, and you can resume the quiz later.</li>
          <li>Once authenticated, click on the "Start Quiz" button to begin.</li>
          <li>Questions are categorized based on difficulty levels: Easy (1 point), Medium (3 points), and Difficult (5 points). Your score is cumulative and will increase or decrease based on the difficulty of the questions.</li>
          <li>Answer each question to the best of your ability. Be careful, as correct answers increase the difficulty of the next question, and incorrect answers decrease it.</li>
          <li>Review the feedback for each question, whether you got it right or wrong. Learn from the feedback to improve your knowledge.</li>
          <li>Users Allow to choose the language they want to learn from a list of available languages</li>
        </ol>
        <button onClick={startQuiz}>Start Quiz</button>
      </div>
    </div>
  )
}

export default index