import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import axios from "axios"
const GlobalScoreBoard = () => {
    const [dataSets, setDataSet] = useState({});
    const datasets = () => {
        return [
            {
                label: 'Quiz Ranked',
                data: Object.values(dataSets),
                fill: false,
                borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
            }
        ]
    }

    const data = {
        labels: Object.keys(dataSets),
        datasets: datasets()
    };
    // Bar chart Option
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Global Score Board',
            },
        },
    };

    // fetching the Global Score
    const fetchGlobalScore = async () => {
        await axios.get("/api/fetchGlobalScore").then((response) => {
            let obj = response.data.result;
            let keyValueArray = Object.entries(obj);
            keyValueArray.sort((a, b) => b[1] - a[1]);
            let sortedObject = Object.fromEntries(keyValueArray);
            setDataSet(sortedObject);
        })
    }

    useEffect(() => {
        fetchGlobalScore()
    }, [])

    return (
        <div id='cardLineChart'>
            <Bar options={options} data={data} />
        </div>
    )
}

export default GlobalScoreBoard