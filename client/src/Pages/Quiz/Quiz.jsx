import React, { useEffect, useState } from 'react'
import "./styles.css"
import { GiSandsOfTime } from "react-icons/gi";
import LoadingBar from 'react-top-loading-bar'
import TimeOut from './TimeOut';
import axios from "axios"
import { useParams } from 'react-router-dom';
import { notification } from '../../Components/Notification';
import Feedback from './Feedback'
import Result from './Result';

const Quiz = () => {
    const [timeRemain, setTimeRemain] = useState(10);
    const [IntialRemain, setInitialRemain] = useState(timeRemain);
    const [totalQuiz, setTotalQuiz] = useState({
        total: 10,
        answedTotal: 0
    })
    const [attempedQuiz, setAttempedQuiz] = useState([]);
    const [progress, setProgress] = useState(10);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [quizQuestion, setQuizQuestion] = useState({})
    const [loading, setLoading] = useState("Loading")
    const [excerciseID, setexcerciseID] = useState(null);
    const params = useParams();

    // for React Loading Bar 
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemain((prev) => prev > 0 ? prev -= 1 : 0)
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // for updating Loading when user didn,t Attempt any question
    useEffect(() => {
        if (IntialRemain !== "Stop") {
            const curr = (timeRemain / IntialRemain) * 100;
            setProgress(curr);
            if (timeRemain === 0 && totalQuiz.answedTotal < totalQuiz.total && loading === "Loaded") {
                setLoading("Didn't Choice")
                saveExerciseQuiz();
            }
        }
    }, [timeRemain])

    // for fetching Quiz on the basis of previos Question Diffcultity Level
    const nextExcerciseQuiz = async (difficultyLevel) => {
        if (totalQuiz.total !== totalQuiz.answedTotal) {
            setLoading("Loading");
            if (params?.excerciseID) {
                await axios.get(`/api/excercise/${params.excerciseID}`).then(async (response) => {
                    let data = response.data.data;
                    await axios.post(`/api/fetchQuiz/${params._id}/${difficultyLevel}`, { attempedQuiz }).then((response) => {
                        setQuizQuestion(response.data.nextQuiz)
                        setTotalQuiz({ ...totalQuiz, answedTotal: data?.AnsweredQuiz?.length + 1 })
                        setAttempedQuiz([...attempedQuiz, response.data.nextQuiz._id])
                        setTimeRemain(IntialRemain);
                        setSelectedChoice(null)
                        setTimeout(() => {
                            setLoading("Loaded")
                        }, 1000)
                    }).catch((err) => {
                        console.log(err)
                    })
                })
            }
        }
    }

    useEffect(() => {
        nextExcerciseQuiz(1)
    }, [])

    // for returing the Diificulty Level on basis of numbers
    const Difficulty_Level = () => {
        if (quizQuestion.Difficulty_Level === 1)
            return "Easy";
        if (quizQuestion.Difficulty_Level === 2)
            return "Medium";
        if (quizQuestion.Difficulty_Level === 3)
            return "Difficult";
    }

    // Save Excercise 
    const saveExerciseQuiz = async () => {
        const time = IntialRemain;
        let QuizRemaining = false;
        if (totalQuiz.total > totalQuiz.answedTotal) {
            QuizRemaining = true;
        }
        let correctAnswer = false;
        if (selectedChoice === quizQuestion.Answer) {
            correctAnswer = true;
        }
        if (totalQuiz.answedTotal >= 1 && params.excerciseID) {
            // alert("Route Under Process")
            await axios.post(`/api/saveExercise/${params.excerciseID}`, {
                QuizLanguageID: params._id,
                TotalQuiz: totalQuiz.total, QuizRemaining, Question: quizQuestion.question,
                AnsweredApplied: selectedChoice,
                correctAnswer,
                Difficulty_Level: quizQuestion.Difficulty_Level
            }).then((response) => {
                setInitialRemain(time);
            })
        }
    }

    // for providing feedback on basis of another Answer Choice
    const submitData = async () => {
        if (totalQuiz.answedTotal <= totalQuiz.total && timeRemain !== 0) {
            // setInitialRemain("Stop")
            await saveExerciseQuiz();
            if (selectedChoice === quizQuestion.Answer) {
                if (quizQuestion.Difficulty_Level === 3) {
                    setLoading("Right")
                } else if (quizQuestion.Difficulty_Level === 2) {
                    setLoading("Difficulty_Level_Upgrade_Difficult")
                } else if (quizQuestion.Difficulty_Level === 1) {
                    setLoading("Difficulty_Level_Upgrade_Medium")
                }
            }
            if (selectedChoice !== quizQuestion.Answer) {
                if (quizQuestion.Difficulty_Level === 1) {
                    setLoading("Wrong")
                } else if (quizQuestion.Difficulty_Level === 2) {
                    setLoading("Difficulty_Level_Downgrade_Easy")
                } else if (quizQuestion.Difficulty_Level === 3) {
                    setLoading("Difficulty_Level_Downgrade_Medium")
                }
            }
        }
        if (totalQuiz.answedTotal === totalQuiz.total) {
            notification("All Quiz Attempted", "Success");
        }
    }

    return (
        <>
            {
                loading === "Loading" &&
                <TimeOut />
            }
            {
                loading === "Loaded" &&
                <div id='quiz'>
                    <LoadingBar color={"#00bccd"} progress={progress}
                        onLoaderFinished={() => setProgress(0)} />
                    <div id='timecount' style={timeRemain < IntialRemain / 2 ? { color: "red" } : { color: "" }}>
                        <GiSandsOfTime />
                        <p>{timeRemain} seconds</p>
                        <p>{Difficulty_Level()}</p>
                    </div>
                    <p id='quiz-count'>Question {totalQuiz.answedTotal} out Of {totalQuiz.total}</p>
                    <h2>{quizQuestion?.question}</h2>
                    <div id='options-btns'>
                        {
                            quizQuestion?.Options?.map((curr, id) => {
                                return (
                                    <button key={id} className={selectedChoice === curr ? "selected-Choice" : ""} onClick={() => {
                                        if (timeRemain < IntialRemain) {
                                            selectedChoice !== curr ? setSelectedChoice(curr) : setSelectedChoice("")
                                        }
                                    }
                                    }>{curr}</button>
                                )
                            })
                        }
                    </div>
                    <button id='next-quiz' onClick={submitData}>Submit</button>
                </div>
            }
            {
                (loading === "Wrong" || loading === "Right" || loading === "Didn't Choice" || loading === "Difficulty_Level_Upgrade_Medium" || loading === "Difficulty_Level_Upgrade_Difficult" || loading === "Difficulty_Level_Downgrade_Easy" || loading === "Difficulty_Level_Downgrade_Medium") &&
                <Feedback feedback={loading} nextExcerciseQuiz={nextExcerciseQuiz} quizQuestion={quizQuestion} setLoading={setLoading} selectedChoice={selectedChoice} Answer={quizQuestion.Answer} totalQuiz={totalQuiz.total} answedTotal={totalQuiz.answedTotal} />
            }
            {
                loading === "Result" && <>
                    <Result />
                </>
            }

        </>
    )
}

export default Quiz