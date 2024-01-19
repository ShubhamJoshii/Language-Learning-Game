import React, { useState } from 'react'
import Header from '../../Components/Header'
import Quiz from './Quiz'
import TimeOut from './TimeOut'
import StartPage from "./StartPage"
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Result from './Result'
const index = () => {
  const [QuizStart, setStartPage] = useState("StartPage");
  const params = useParams();
  const navigate = useNavigate();

  // for when user Doing the existing Quiz
  const createQuizExcercise = async () => {
    if (!params?.excerciseID) {
      // for creating the new Quiz excercise
      await axios.post(`/api/createQuizExcercise/${params._id}`).then((response) => {
        if (response.data.excerciseID) {
          navigate(`/quiz/${params._id}/${response.data.excerciseID}`)
          setStartPage("Quiz")
        }
      })
    } else {
      // for fetching the exsiting Quiz excercise which is have left quesitnos
      await axios.get(`/api/fetctResult/${params.excerciseID}`).then((response) => {
        if (!response.data?.message) {
          setStartPage("Result")
        } else {
          setStartPage("Quiz")
        }
      })
    }
  }


return (
  <>
    {
      QuizStart === "Quiz" &&
      <Quiz />}
    {
      QuizStart === "StartPage" &&
      <StartPage createQuizExcercise={createQuizExcercise} />
    }
    {QuizStart === "Result" && <Result />}
  </>
)
}

export default index