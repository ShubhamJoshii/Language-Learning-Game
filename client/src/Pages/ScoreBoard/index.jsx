import React from 'react'
import "./styles.css"
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Legend,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

import UserPerformance from './UserPerformance';
import ScoreBoardHeader from './ScoreBoardHeader';
import { useParams } from 'react-router-dom';
import ScoreBoard from './ScoreBoard';
import GlobalScoreBoard from './GlobalScoreBoard';



// Implement a scoring system to evaluate user performance in each  exercise (0-5).
// Scoring should be based on how difficult the question is. For a easy  questions it can be 1 and very difficult question can be 5.
// Track and display the user's progress in the game, including completed  exercises and proficiency levels.

const index = () => {
    const params = useParams();

    return (<>
        <ScoreBoardHeader />
        <div id='Score-Board'>
            {/* // showing Components on basis of states */}
            {
                params.type === "UserPerformance" &&
                <UserPerformance />
            }
            {
                params.type === "ScoreBoard" &&
                <ScoreBoard />
            }
            {
                params.type === "GlobalScoreBoard" &&
                <GlobalScoreBoard />
            }

        </div>
    </>
    )
}

export default index