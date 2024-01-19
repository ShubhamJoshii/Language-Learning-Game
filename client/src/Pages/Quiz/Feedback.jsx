import React from 'react'
import Wrong from "../../assets/Wrong.png"
import Right from "../../assets/Right.png"
const Feedback = ({ feedback, nextExcerciseQuiz, quizQuestion, setLoading, selectedChoice, Answer, answedTotal, totalQuiz }) => {
    let difficultyLevel = quizQuestion.Difficulty_Level;
    const nextQuiz = () => {
        if (answedTotal < totalQuiz) {
            if (selectedChoice === quizQuestion.Answer) {
                (difficultyLevel < 3 && difficultyLevel > 0) ? difficultyLevel += 1 : difficultyLevel == 3
                setLoading("Right")
                nextExcerciseQuiz(difficultyLevel)
            } else {
                (difficultyLevel <= 3 && difficultyLevel > 1) ? difficultyLevel -= 1 : difficultyLevel == 1
                setLoading("Wrong")
                nextExcerciseQuiz(difficultyLevel)
            }
        }
        if (answedTotal === totalQuiz) {
            setLoading("Result")
        }
    }
    return (
        <div id="StartQuizPage">
            <div id='FeedBack'>
                <>
                    {
                        feedback === "Didn't Choice" &&
                        <>
                            <img src={Wrong} alt='Wrong_Image' />
                            <h2 >Oops! </h2>
                            <p> Your Does not Choice among Options.</p>
                            <p> The correct answer to the question is <span>{Answer}</span></p>
                        </>
                    }
                    {
                        feedback === "Wrong" &&
                        <>
                            <img src={Wrong} alt='Wrong_Image' />
                            <h2 >Oops! </h2>
                            <p> Your answer is incorrect.</p>
                            <p> The correct answer to the question is <span>{Answer}</span></p>
                        </>
                    }
                    {
                        feedback === "Right" &&
                        <>
                            <img src={Right} alt='Right_Image' />
                            <h2 >Great job!</h2>
                            <p> Your answer is correct.</p>
                            <p> Your correct answer to the question is <span>"{Answer}"</span></p>

                        </>
                    }
                    {
                        feedback === "Difficulty_Level_Upgrade_Medium" &&
                        <>
                            <img src={Right} alt='Right_Image' />
                            <h2 >Congratulations!</h2>
                            <p> Your performance has upgraded to the Medium difficulty level. Keep it up!</p>
                            <p> Your correct answer to the question is <span>"{Answer}"</span></p>

                        </>
                    }
                    {
                        feedback === "Difficulty_Level_Upgrade_Difficult" &&
                        <>
                            <img src={Right} alt='Right_Image' />
                            <h2 >Congratulations!</h2>
                            <p> Outstanding! You're now tackling Difficult questions. Ready for the challenge?</p>
                            <p> Your correct answer to the question is <span>"{Answer}"</span></p>

                        </>
                    }
                    {
                        feedback === "Difficulty_Level_Downgrade_Easy" &&
                        <>
                            <img src={Wrong} alt='Wrong_Image' />
                            <h2>No problem!</h2>
                            <p>You've moved back to Easy difficulty. Use this as an opportunity to reinforce your understanding.</p>
                            <p>The Correct answer to the question is <span>"{Answer}"</span></p>
                        </>
                    }
                    {
                        feedback === "Difficulty_Level_Downgrade_Medium" &&
                        <>
                            <img src={Wrong} alt='Wrong_Image' />
                            <h2>Don't worry,</h2>
                            <p>you're doing great! You're now back to Medium difficulty. Keep pushing!</p>
                            <p>The Correct answer to the question is <span>"{Answer}"</span></p>
                        </>
                    }
                    <button onClick={nextQuiz}>{answedTotal < totalQuiz ? "Next Quiz" : "Show Result"}</button>
                </>
            </div>
        </div>
    )
}
export default Feedback