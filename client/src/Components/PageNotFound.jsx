import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div id='PageNotFound'>
      <h1>404</h1>
      <h2>Not Found</h2>
      <p>The Page requested could not be found on this server!</p>
      <button onClick={()=>navigate("/")}>GO TO HOME</button>
    </div>
  )
}

export default PageNotFound