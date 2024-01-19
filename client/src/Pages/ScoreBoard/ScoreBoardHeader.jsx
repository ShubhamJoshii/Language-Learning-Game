import React from 'react'
import { NavLink } from 'react-router-dom'

const routes = [
  {
    link:"/scoreboard/UserPerformance",
    Text:"User Performance"
  },
  {
    link:"/scoreboard/ScoreBoard",
    Text:"Score Board"
  },
  {
    link:"/scoreboard/GlobalScoreBoard",
    Text:"Global Score Board"
  },
]

const ScoreBoardHeader = () => {

  return (
    <div id="ScoreBoardHeader">
      {/* // Header for Score Board */}
      {
        routes.map((curr,id)=>{
          return <NavLink to={curr.link} style={{color:`#${Math.floor(Math.random() * 16777215).toString(16)}`}}>{curr.Text}</NavLink>
        })
      }
    </div>
  )
}

export default ScoreBoardHeader