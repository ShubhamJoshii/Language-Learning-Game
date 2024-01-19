const express = require("express");
const { UsersModel, QuizModel, ExerciseModel } = require("./Database");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Authenication = require("./Authenication");


// Home Route get fetch info of user if user is logged onto a webpage
router.get("/home", Authenication, async (req, res) => {
  if (req.rootUser) {
    const fetchRemainingExercise = await ExerciseModel.findOne({
      UserID: req.userID,
      QuizRemaining: true,
    });
    res.send({
      data: req.rootUser,
      result: true,
      QuizRemaining: fetchRemainingExercise,
    });
  } else {
    res.send({ result: false });
  }
});

// for Registering a New User
router.post("/register", async (req, res) => {
  const { Name, Email, Password, Confirm_Password } = req.body;
  // console.log(req.body);
  if (Password === Confirm_Password && Password.length >= 8) {
    const emailExist = await UsersModel.findOne({ Email });
    if (emailExist) {
      // console.log("User Email Exists");
      return res.send({
        message: "User Email is Already Exist",
        result: false,
      });
    }
    const userData = new UsersModel({
      Name,
      Email,
      Password,
      Confirm_Password,
    });
    await userData.save();
    return res.send({ message: "User Email Registed Now Login", result: true });
  } else if (Password !== Confirm_Password) {
    res.send({ message: "Password should greater than 8", result: false });
  }
});

// for user Login into webpage
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  const Login_Date = Date().toString();
  try {
    const userExist = await UsersModel.findOne({ Email });
    if (userExist) {
      const passwordMatch = await bcrypt.compare(Password, userExist.Password);
      if (passwordMatch) {
        userExist.Login = userExist.Login.concat({ Login_Date });
        const Token = await userExist.generateAuthToken();
        // console.log(Token);
        res.cookie("LanguageAssessmentToken", Token, {
          expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
        userExist.save();
        res.send({ message: "User logged in", result: true });
      } else {
        res.send({ message: "Password doesn't Matched", result: false });
      }
    } else {
      res.send({ message: "Entered Email is Not Exists", result: false });
    }
  } catch (err) {
    console.log(err);
  }
});

// for logout User
router.get("/logout", Authenication, async (req, res) => {
  res.clearCookie("LanguageAssessmentToken", { path: "/" });
  res.status(200).send({ message: "User Logout" });
});

// for fetching All the Quiz from the backend
router.get("/fetchAllQuiz", async (req, res) => {
  const quizes = await QuizModel.find();
  res.status(200).send({ message: "Fetched Quize", Data: quizes });
});

// fetch Quiz on basis of quiz language and category
router.get("/getQuizesCategory/:quizLanguage", async (req, res) => {
  const { quizLanguage } = req.params;
  const quizes = await QuizModel.findOne({ Language: quizLanguage });
  res.send(quizes._id);
});

// fetching Quiz on the basis of Quiz language and Difficulty Level
router.post("/fetchQuiz/:quizLanguageID/:quizLevel", async (req, res) => {
  const { quizLanguageID, quizLevel } = req.params;
  const { attempedQuiz } = req.body;
  try {
    // find one quizes data where quizlanguage _id is same
    const quizes = await QuizModel.findOne({ _id: quizLanguageID });
    // console.log(attempedQuiz);

    // filtering on basis already atttempted and Diffculty Level quiz from the "quizes"  
    const remainingData = await quizes.Questions.filter(
      (e) =>
        !attempedQuiz?.includes(e._id.toString()) &&
        e.Difficulty_Level === Number(quizLevel)
    );

    // Random fetch one quiz from remainingData
    const randomIndex = Math.floor(Math.random() * remainingData.length);
    res.status(200).send({
      message: "Fetched Quizes",
      Language: quizes.Language,
      nextQuiz: remainingData[randomIndex],
    });
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "Error in fetching Quizes" });
  }
});


// Adding a New quiz on existing Language Quizes or Crating a New Langauge Quiz Section
router.post("/addQuiz",Authenication, async (req, res) => {
  const { Language, Questions } = req.body;
  // console.log(Language, Questions);
  try {
    if(req.rootUser){
      const fetchLanguage = await QuizModel.findOne({ Language });
      if (fetchLanguage) {
        // console.log(fetchLanguage);
        fetchLanguage.Questions = fetchLanguage.Questions.concat(Questions);
        await fetchLanguage.save();
        res.status(200).send({ message: "Quiz Added on Existing Langugage" });
      } else {
        const saveQuiz = new QuizModel({ Language, Questions });
        await saveQuiz.save();
        res.status(200).send({ message: "Quiz Added and Lanuaguge Created" });
      }
    }else{
      res.status(200).send({ message: "Please Login First" });
    }
  } catch (err) {
    res.status(200).send({ message: "Error in Quiz Adding" });
  }
});

// Saving the User quiz Excercises 
router.post("/saveExercise/:exercise_id", Authenication, async (req, res) => {
  const { exercise_id } = req.params;
  const {
    QuizLanguageID,
    TotalQuiz,
    QuizRemaining,
    Question,
    AnsweredApplied,
    correctAnswer,
    Difficulty_Level,
  } = req.body;

  const LanguageFind = await QuizModel.findOne({ _id: QuizLanguageID });

  const userQuizExists = await ExerciseModel.findOne({
    _id: exercise_id,
    QuizRemaining: true,
    Language: LanguageFind.Language,
  });

  if (TotalQuiz - 1 === userQuizExists.AnsweredQuiz.length) {
    userQuizExists.QuizRemaining = false;
  }
  // console.log(userQuizExists.QuizRemaining)
  userQuizExists.TotalQuiz = TotalQuiz;
  if (userQuizExists) {
    userQuizExists.AnsweredQuiz = await userQuizExists.AnsweredQuiz.concat({
      Question,
      AnsweredApplied,
      correctAnswer,
      Difficulty_Level,
    });
    await userQuizExists.save();
    res.send({ message: "Quiz Saved", result: true });
  }
});

// Fetching the Result of User after Attemping all The quizes
router.get("/fetctResult/:exercise_id", async (req, res) => {
  const { exercise_id } = req.params;
  const userQuizExists = await ExerciseModel.findOne({ _id: exercise_id });
  // let Correct = 0;
  if (!userQuizExists.QuizRemaining) {
    let Correct = userQuizExists.AnsweredQuiz.filter((e) => e.correctAnswer);
    let InCorrect = userQuizExists.AnsweredQuiz.length - Correct.length;
    res.send({ Correct: Correct.length, InCorrect });
  } else {
    res.send({ message: "Please first give full test" });
  }
});

// Delete the existing User Quiz exercise mainly Left Quiz
router.delete("/excercise/:_id", async (req, res) => {
  const { _id } = req.params;
  const deleteExcercise = await ExerciseModel.deleteOne({ _id });
  if (deleteExcercise) {
    res.send({ message: "Attempted Quiz Deleted", result: true });
  } else {
    res.send({ message: "Try Again", result: false });
  }
});

// Fetching the existing User Quiz exercise mainly Left Quiz Excerxises
router.get("/excercise/:_id", async (req, res) => {
  const { _id } = req.params;
  const fetchExcercise = await ExerciseModel.findOne({ _id });
  // console.log(fetchExcercise);
  if (fetchExcercise) {
    res.send({ data: fetchExcercise, result: true });
  } else {
    res.send({ data: null, result: false });
  }
});

// for creating New Excersise only when Admin is logged in
router.post(
  "/createQuizExcercise/:QuizLanguageID",
  Authenication,
  async (req, res) => {
    const { QuizLanguageID } = req.params;
    const LanguageFind = await QuizModel.findOne({ _id: QuizLanguageID });
    const Exercise = new ExerciseModel({
      UserID: req.userID,
      AnsweredQuiz: [],
      QuizRemaining: true,
      Language: LanguageFind.Language,
    });
    let data = await Exercise.save();
    res.send({ message: "New Excrease", excerciseID: data._id });
  }
);

// SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD SCORE BOARD
// for feching usre performance
router.get("/fetchUserPerformance", Authenication, async (req, res) => {
  const fetchQuizLanguage = await QuizModel.find();
  const fetchExcercise = await ExerciseModel.find({ UserID: req.userID });
  const dataList = [];
  const languageType = [];
  fetchQuizLanguage.map((Quiz) => {
    languageType.push(Quiz.Language);
  });
  fetchExcercise.map((curr) => {
    const data = {};
    let Correct = curr.AnsweredQuiz.filter((e) => e.correctAnswer).length;
    let InCorrect = curr.AnsweredQuiz.length - Correct;
    data[curr.Language] = Correct;
    dataList.push(data);
  });
  const obj = dataList.reduce((result, obj) => {
    const subject = Object.keys(obj)[0];
    const value = obj[subject];
    result[subject] = (result[subject] || []).concat(value);
    return result;
  }, {});
  res.send({ obj, languageType });
});

// for feching all User Result
router.get("/fetchAllResult", Authenication, async (req, res) => {
  const fetchQuizLanguage = await QuizModel.find();
  const fetchExcercise = await ExerciseModel.find({ UserID: req.userID });
  const dataList = [];
  const languageType = [];
  fetchQuizLanguage.map((Quiz) => {
    languageType.push(Quiz.Language);
  });
  fetchExcercise.map((curr) => {
    const data = {};
    let Correct = curr.AnsweredQuiz.filter((e) => e.correctAnswer).length;
    let InCorrect = curr.AnsweredQuiz.length - Correct;
    data[curr.Language] = [Correct, InCorrect];
    dataList.push(data);
  });
  // console.log(fetchExcercise)
  res.send({ dataList, languageType });
});

// For fetching Global User Result
router.get("/fetchGlobalScore", async (req, res) => {
  const fetchQuizLanguage = await QuizModel.find();
  const fetchUser = await UsersModel.find();
  const fetchExcercise = await ExerciseModel.find();
  const dataList = [];
  const languageType = [];
  fetchQuizLanguage.map((Quiz) => {
    languageType.push(Quiz.Language);
  });
  fetchExcercise.map((curr) => {
    let data = {};
    let Correct = curr.AnsweredQuiz.filter((e) => e.correctAnswer).length;
    const userName = fetchUser.filter(
      (e) => e._id.toString() === curr.UserID
    )[0].Name;
    data = {key:userName,Correct};
    dataList.push(data);
  });
  let result = {}
  dataList.forEach(item => {
    if (result[item.key] === undefined) {
      result[item.key] = item.Correct;
    } else {
      result[item.key] += item.Correct;
    }
  });
  res.send({ result });
});

module.exports = router;