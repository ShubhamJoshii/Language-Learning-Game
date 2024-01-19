import React from 'react'
import "./QuizRemaining.css"
import axios from 'axios'
import { notification } from './Notification'
import { useNavigate } from 'react-router-dom'
const QuizRemainingNotification = ({ remainingQuiz,setRemainingQuiz ,userName,userId}) => {
    const navigate = useNavigate();
    const cancelExcercise = async() => {
        await axios.delete(`/api/excercise/${remainingQuiz._id}`).then((response)=>{
            console.log(response.data.message)
            if(response.data.result){
                notification(response.data.message,'Success')
                navigate("/")
                window.location.reload(false);

            }else{
                notification(response.data.message,"Un-Success");
            }
        })
    }
    return (
        <div id="QuizRemainingNotification">
                <div className="inner">
                    <h1>Welcome back, </h1>
                    <p>{userName}! You have <b>{remainingQuiz?.TotalQuiz - remainingQuiz?.AnsweredQuiz?.length}</b> questions left in the <b>{remainingQuiz?.Language} quiz</b>.</p> 
                    <p> Let's continue!`</p>
                    <div>
                        <button onClick={cancelExcercise}>Cancel</button>
                        <button onClick={async ()=>{
                            const id = await axios.get(`/api/getQuizesCategory/${remainingQuiz.Language}`).then((result)=>{
                                return result.data
                            })
                            navigate(`/quiz/${id}/${remainingQuiz._id}`)
                            setRemainingQuiz(null)
                            }}>Continue</button>
                    </div>
                </div>
        </div>
    )
}

export default QuizRemainingNotification