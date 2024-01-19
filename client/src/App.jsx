import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { createContext, lazy, useEffect, useState } from "react"
import { Suspense } from "react";
const Homepage = lazy(() => import("./Pages/Homepage/index.jsx"));
const Header = lazy(() => import("./Components/Header"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Quiz = lazy(() => import("./Pages/Quiz"))
const ScoreBoard = lazy(() => import("./Pages/ScoreBoard"))
const QuizRemainingNotification = lazy(() => import("./Components/QuizRemainingNotification"))
const PreLoding = lazy(() => import("./Components/PreLoding.jsx"));

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import PageNotFound from './Components/PageNotFound.jsx';

const UserData = createContext();
function App() {
  const [userData, setUserData] = useState(undefined);
  const [remainingQuiz, setRemainingQuiz] = useState({});
  const checkUserAlreadyLogin = async () => {
    await axios.get("/api/home").then((response) => {
      if (response.data.result) {
        setUserData(response.data.data)
        setRemainingQuiz(response.data.QuizRemaining)
        // console.log(response.data)
      }
    })
  }

  useEffect(() => {
    checkUserAlreadyLogin();
  }, [])

  return (
    <>
      <UserData.Provider value={{ userData, setUserData, checkUserAlreadyLogin }}>
        <ToastContainer />
        <Router>
          <Suspense fallback={<PreLoding />}>
          <Header />
          {
            remainingQuiz?.QuizRemaining && 
            <QuizRemainingNotification remainingQuiz={remainingQuiz} setRemainingQuiz={setRemainingQuiz} userName={userData.Name} userId={userData._id}/>
          }
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/home/:_id" element={<Homepage />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:_id/" element={<Quiz />} />
            <Route path="/quiz/:_id/:excerciseID" element={<Quiz />} />
            <Route path="/scoreboard" element={<ScoreBoard />} />
            <Route path="/scoreboard/:type" element={<ScoreBoard />} />
            {
              !userData &&
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            }
            <Route path="*" element={<PageNotFound />} />
          </Routes>
          </Suspense>
          
        </Router>
      </UserData.Provider>
      {/* <PreLoding /> */}
    </>
  )
}



export default App
export { UserData }