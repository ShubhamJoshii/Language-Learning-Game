import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { notification } from '../../Components/Notification';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

const Result = () => {
    const [answerRatio, setAnswerRatio] = useState({
        Correct:0,
        InCorrect:0
    })
    const navigate = useNavigate();
    const params = useParams();
    const data = {
        labels: ['Correct', 'In-Correct'],
        datasets: [{
            labels: 'Poll',
            data: [answerRatio.Correct,answerRatio.InCorrect],
            backgroundColor: ['#1c1a5e', 'red'],
            borderColor: ['#1c1a5e', 'red'],
            hoverOffset: 4
        }]
    }
    const options = {}

    // for fething Quiz Result and Showing on Doughnut Chart
    const fetchResult = async () => {
        await axios.get(`/api/fetctResult/${params.excerciseID}`).then((response) => {
            // console.log(response.data)
            if(!response.data?.message){
                setAnswerRatio(response.data)
            }else{
                notification(response.data?.message,"Warning")
            }
        })
    }

    useEffect(()=>{
        fetchResult();
    },[])
    return (
        <div id="StartQuizPage">
            <div id='FeedBack' className='Result'>
                <h2> Quiz Result </h2>
                <Doughnut
                    data={data}
                    options={options}
                ></Doughnut>
                <button onClick={()=>navigate("/")}>Home</button>
            </div>
        </div>
    )
}


export default Result
