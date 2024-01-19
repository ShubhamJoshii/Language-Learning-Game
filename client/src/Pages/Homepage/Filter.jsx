import React, { useEffect, useState } from 'react'
import axios from "axios"
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const Filter = ({allQuiz}) => {
    const params = useParams();
    return (
        <div id="filter">
            <p id='quizesCount'>Showing {allQuiz?.length} Quizes Type</p>
            <h4>Filters</h4>
            <input type="search" name="search" id="search" placeholder='Search' />
            <div id='filterCategory'>
                <h5>Language</h5>
                <h5>{allQuiz?.length}</h5>
            </div>
            <div id='FurtherfilterCategory'>
                {
                    allQuiz?.map((curr, id) => {
                        return (
                            <NavLink to={`/home/${curr._id}`} key={id}><p className={params._id === curr._id ? "activeClass" : ""}>{curr.Language}</p></NavLink>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Filter