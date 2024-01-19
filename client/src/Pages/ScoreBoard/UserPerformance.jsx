import axios, { all } from 'axios';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';

const UserPerformance = () => {
    const [Alldata, setAllData] = useState({});
    const dataset = () => {
        let returnObj = []
        let colorCode = ["red", "green", "blue", "yellow", "orange", "darkblue"];
        const dataKeys = Object.keys(Alldata);
        if (dataKeys.length > 0) {
            dataKeys?.map((curr, id) => {
                returnObj.push({
                    label: `${curr}`,
                    data: Alldata[curr],
                    fill: false,
                    borderColor: `${colorCode[id]}`,
                    backgroundColor: `${colorCode[id]}`,
                    tension: 0.1
                }
                )
            })
            return returnObj;
        }

    }
    const data = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: dataset()
    };

    const optionsLine = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Performance in each Exercise',
            },
        },
    };

    // feching UserPerformance and showing through using react Line Chart
    const fetchUserPerformance = async () => {
        await axios.get("/api/fetchUserPerformance").then((response) => {
            setAllData(response.data.obj)
        })
    }
    useEffect(() => {
        dataset();
    }, [Alldata])
    useEffect(() => {
        fetchUserPerformance()
    }, [])

    return (
        <div id='cardLineChart'>
            {
                Object.keys(Alldata).length > 0 &&
                <Line
                    data={data}
                    options={optionsLine}
                />
            }
        </div>
    )
}

export default UserPerformance