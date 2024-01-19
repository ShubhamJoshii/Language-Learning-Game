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
      {
        routes.map((curr,id)=>{
          return <NavLink to={curr.link} style={{color:`#${Math.floor(Math.random() * 16777215).toString(16)}`}}>{curr.Text}</NavLink>
        })
      }
        {/* <NavLink to={"/scoreboard/UserPerformance"}>User Performance</NavLink>
        <NavLink to={"/scoreboard/ScoreBoard"}>Score Board</NavLink>
        <NavLink to={"/scoreboard/GlobalScoreBoard"}>Global Score Board</NavLink> */}
        {/* <NavLink to={"/scoreboard/UserPerformance"}>UserPerformance</NavLink>
        <NavLink to={"/scoreboard/UserPerformance"}>UserPerformance</NavLink> */}
    </div>
  )
}

export default ScoreBoardHeader