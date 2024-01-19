import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import axios from "axios"

const ScoreBoard = () => {
    const [dataSet, setDataSet] = useState([]);
    
    const data = (data, i) => {
        let colorCode = ["red", "green", "blue", "yellow", "orange", "darkblue"];
        return {
            labels: ['Correct', 'In-Correct'],
            datasets: [{
                labels: 'Poll',
                data: data,
                backgroundColor: [`${"#"+Math.floor(Math.random() * 16777215).toString(16)}`, 'black'],
                borderColor: [`${"#"+Math.floor(Math.random() * 16777215).toString(16)}`, 'black'],
                hoverOffset: 4
            }]
        }
    }

    const optionsDough = (text = "English") => {
        return {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `${text} Quiz`,
                },
            }
        }
    }
    const fetchAllResult = async () => {
        await axios.get("/api/fetchAllResult").then((response) => {
            // console.log(response.data.dataList);
            setDataSet(response.data.dataList)
        })
    }

    useEffect(() => {
        fetchAllResult();
    }, [])

    return (
        <>
            {
                dataSet.map((curr,id) => {
                    let key = Object.keys(curr)[0]
                    return (
                        <div id='card' key={id}>
                            <Doughnut
                                data={data(curr[key],id)}
                                options={optionsDough(key)}
                            ></Doughnut>
                        </div>
                    )
                })
            }
        </>
    )
}

export default ScoreBoard