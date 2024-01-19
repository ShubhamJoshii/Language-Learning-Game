import React, { useContext, useState } from 'react'
import "./Login.css"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { notification } from "../../Components/Notification"
import axios from "axios"
import { UserData } from '../../App';
const Login = () => {
  const [LoginData, setLoginData] = useState({
    Email: "",
    Password: "",
  })
  const { checkUserAlreadyLogin } = useContext(UserData)
  const navigate = useNavigate();

  // for Handling the Input Data
  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginData({ ...LoginData, [name]: value })
  }

  // for handling the password visible or hide
  const handlePassword = (e) => {
    const a = document.getElementById('Password');
    e.target.checked ?
      a.type = "text" :
      a.type = "password"
  }

  // for submitting the form detail to Backend
  const submitForm = async (e) => {
    e.preventDefault();
    await axios.post("/api/login", LoginData).then((response) => {
      if (response.data.result) {
        notification(response.data.message, "Success")
        checkUserAlreadyLogin();
        navigate("/")
      } else {
        notification(response.data.message, "Un-Success")
      }
    })
  }
  return (
    <div id='AuthContainer'>

      <form id='Login' onSubmit={submitForm}>
        <h2>LOGIN</h2>
        <div id='login-Input'>
          <label>Email</label>
          <input type="email" name="Email" id="Email" value={LoginData.Email} onChange={handleInput} />
          <label>Password</label>
          <input type="password" name="Password" id="Password" value={LoginData.Password} onChange={handleInput} />
        </div>
        <div id='formMethod'>
          <div>
            <input type="checkbox" onChange={handlePassword} name="ShowPassword" id="ShowPassword" />
            <label htmlFor='ShowPassword'>Show Password</label>
          </div>
          <p id='forget_Password'>Forget Password?</p>

        </div>
        <input type='submit' value="LOGIN" /><br />

        <p>Need an account? <Link to='/register'>SIGN UP</Link></p>
      </form>
    </div>
  )
}

export default Login