const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log(error);
  });

const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Password: {
    type: String,
    require: true,
  },
  Confirm_Password: {
    type: String,
    require: true,
  },
  Login: [
    {
      Login_Date: {
        type: String,
        require: true,
      },
    },
  ],
  Tokens: [
    {
      Token: {
        type: String,
        require: true,
      },
    },
  ],
  RegisterDate: {
    type: Date,
    default: Date.now,
  },
});

const QuizSchema = new mongoose.Schema({
  Language: {
    type: String,
    require: true,
  },
  Questions: [
    {
      question: {
        type: String,
        require: true,
      },
      Options: [
        {
          type: String,
          require: true,
        },
      ],
      Answer: {
        type: String,
        require: true,
      },
      Difficulty_Level: {
        type: Number,
        require: true,
      },
    },
  ],
});

const ExerciseSchema = new mongoose.Schema({
  UserID: {
    type: String,
    require: true,
  },
  Language: {
    type: String,
    require: true,
  },
  AnsweredQuiz: [
    {
      Question: {
        type: String,
        require: true,
      },
      AnsweredApplied: {
        type: String,
        require: true,
      },
      correctAnswer: {
        type: Boolean,
        require: true,
      },
      Difficulty_Level: {
        type: Number,
        require: true,
      },
    },
  ],
  QuizRemaining: {
    type: Boolean,
    require: true,
  },
  TotalQuiz: {
    type: Number,
    require: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 12);
    this.Confirm_Password = await bcrypt.hash(this.Confirm_Password, 12);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  try {
    let Token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.Tokens = this.Tokens.concat({ Token: Token });
    await this.save();
    return Token;
  } catch (err) {
    console.log(err);
  }
};

const UsersModel = mongoose.model("Register_User", UserSchema);
const QuizModel = mongoose.model("Quiz", QuizSchema);
const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);

module.exports = { UsersModel, QuizModel, ExerciseModel };
