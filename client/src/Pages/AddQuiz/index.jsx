import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./styles.css"
import { notification } from "../../Components/Notification"
const index = () => {
  const [allQuiz, setAllQuiz] = useState();
  const [AddLanguage, setAddLanguage] = useState({
    Language: "",
    Quiz: [],
    QuizQuestion: "",
    QuizCount: 0,
    Answer: "",
    Difficulty_Level: 1,
    Existing: true
  });

  const fetchQuiz = async () => {
    await axios.get("/api/fetchAllQuiz").then((response) => {
      setAllQuiz(response.data.Data)
      console.log(response.data.Data)
    }).catch((err) => {
      console.log(err)
    })
  }
  useEffect(() => {
    fetchQuiz();
  }, [])

  const handleNewLanguage = (e) => {
    const name = e.target.name
    const value = e.target.value
    setAddLanguage({ ...AddLanguage, [name]: value })
  }
  const handleChoices = (e, id) => {
    const value = e.target.value;
    let arr = AddLanguage.Quiz;
    arr[id] = value;
    setAddLanguage({ ...AddLanguage, Quiz: arr })
  }

  const handleNewQuizSave = async (e) => {
    e.preventDefault();
    if (AddLanguage.Quiz.length >= 2 && AddLanguage.Answer) {
      let data = {
        question: AddLanguage.QuizQuestion,
        Options: AddLanguage.Quiz,
        Answer: AddLanguage.Answer,
        Difficulty_Level: AddLanguage.Difficulty_Level
      }
      await axios.post("/api/addQuiz", { Language: AddLanguage.Language, Questions: data }).then((response) => {
        console.log(response.data)
        notification(response.data.message, "Sucess")
      })
    } else if (AddLanguage.Quiz.length < 2) {
      notification("Add Choice More than 2 Choice", "UnSucess")
      // console.log(AddLanguage)
    } else if (AddLanguage.Answer) {
      notification("First, Select Answer Please", "UnSucess")
    }
  }

  return (
    <div id="AddQuiz">
      <div id='Add-selectLanguage'>
        <div id='selectLanguage'>
          <label htmlFor='QuizSelect'>Select Quiz Language</label>
          <select name='QuizSelect' id="QuizSelect" onClick={(e) => setAddLanguage({
            ...AddLanguage, Language: e.target.value,
            Existing: true
          })}>
            <option selected value="">--select--</option>
            {
              allQuiz?.map((curr, id) => {
                return (
                  <option value={curr.Language} >{curr.Language}</option>
                )
              })
            }
          </select>
        </div>
        <button id='AddQuiz' onClick={(e) => setAddLanguage({
          ...AddLanguage, Language: "",
          Quiz: [],
          QuizQuestion: "",
          QuizCount: 0,
          Answer: "",
          Difficulty_Level: 1,
          Existing: false
        })}>Add New Quiz Language</button>
      </div>
      <form id='Add-New-Quiz-Language' onSubmit={handleNewQuizSave}>
        {
          !AddLanguage.Existing &&
          <>
            <label htmlFor='Language'>Language</label>
            <input id='Language' name='Language' value={AddLanguage.Language} onChange={handleNewLanguage} />
          </>
        }

        <label htmlFor='QuizQuestion'>Add Quesiton Quiz</label>
        <textarea id='QuizQuestion' name='QuizQuestion' value={AddLanguage.QuizQuestion} onChange={handleNewLanguage}></textarea>

        <button onClick={(e) => {
          e.preventDefault();
          let QuizCount = AddLanguage.QuizCount;
          if (QuizCount > 3) {
            notification("Maximum 4 quiz row Allowed", "Warning")
          } else {
            setAddLanguage({ ...AddLanguage, QuizCount: QuizCount + 1 })
          }
        }}>Add Quiz Row</button>
        {
          [...Array(AddLanguage.QuizCount)].map((curr, id) => {
            return (
              <div key={id} id='choices'>
                <label htmlFor='Language'>Choice {id + 1}</label>
                <input id='Language' name='Language' value={AddLanguage.Quiz[id]} onChange={e => handleChoices(e, id)} />
                {/* <button style={AddLanguage?.Quiz[id] === AddLanguage?.Answer ? {background:"lightBlue"} : ""}>Answer</button> */}
              </div>
            )
          })
        }
        {
          AddLanguage.QuizCount >= 2 &&
          <>
            <label htmlFor='QuizSelect'>Select Answer</label>
            <select name='QuizSelect' id="QuizSelect" onChange={(e) => setAddLanguage({ ...AddLanguage, Answer: e.target.value })}>
              <option selected value="">--select--</option>
              {AddLanguage.Quiz.map((curr, id) => {
                return (
                  <option value={curr} >{curr}</option>
                )
              })}
            </select>
            <label htmlFor='QuizSelect'>Difficulty Level</label>
            <select name='QuizSelect' id="QuizSelect" onChange={(e) => setAddLanguage({ ...AddLanguage, Difficulty_Level: e.target.value })}>
              <option selected value="">--select--</option>
              {[...Array(3)].map((curr, id) => {
                return (
                  <option value={id + 1} >{id + 1}</option>
                )
              })}
            </select>

          </>
        }

        <input type="submit" value="Add New Quiz Language" />
      </form >
    </div >
  )
}


export default index
