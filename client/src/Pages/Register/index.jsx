import React, { useState } from 'react'
import "./Register.css"
import { Link } from 'react-router-dom'
import axios from "axios"
import { notification } from '../../Components/Notification'
import { useNavigate } from 'react-router-dom'
import { IoInformationCircleSharp } from "react-icons/io5";
const Register = () => {
  const [registerData, setRegisterData] = useState({
    Name: '',
    Email: "",
    Password: "",
    Confirm_Password: ""
  })

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setRegisterData({ ...registerData, [name]: value })
    // handlePasswordValidation();
  }
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    // console.log(registerData);
    let allTrue = handlePasswordValidation();
    console.log(allTrue)
    if (allTrue && registerData.Password.length >= 8 && registerData.Password === registerData.Confirm_Password && registerData.Email && registerData.Name) {
      await axios.post("/api/register", registerData).then((response) => {
        if (response.data.result) {
          notification(response.data.message, "Success")
          navigate("/login")
        } else {
          notification(response.data.message, "Un-Success")
        }
      }).catch((err) => {
        console.log(err)
      })
    } else if (registerData.Password !== registerData.Confirm_Password) {
      notification("Password and Confirm Password doesn't Match", "Success")
    } else if (registerData.Password.length < 8) {
      notification("Password Lenght should be greater than 8", "Success")
    } else if (!registerData.Email) {
      notification("Please, Enter Email Id", "Success")
    } else if (!registerData.Name) {
      notification("Please Enter your Name", "Success")
    } else if (!allTrue) {
      notification("Password Criteria does not Meat", "Warning")
    }
  }

  const handlePassword = (e) => {
    const a = document.getElementById('Password');
    const b = document.getElementById('Confirm_Password');
    if (e.target.checked) {
      a.type = "text";
      b.type = "text";
    } else {
      a.type = "password";
      b.type = "password";
    }
  }

  const handleInputEmail = (e) => {
    const { name, value } = e.target;
    const isValidInput = /^[A-Za-z\s]+$/.test(value[0]);
    if (isValidInput || value === "") {
      setregisterInfo({ ...registerData, [name]: value });
    }
  }

  const handleInputName = (e) => {
    const { name, value } = e.target;
    const isValidInput = /^[A-Za-z\s]+$/.test(value);
    if (isValidInput || value === "") {
      setregisterInfo({ ...registerData, [name]: value });
    }
  };

  const handlePasswordValidation = (e) => {
    const password = registerData.Password;
    const lower = new RegExp('(?=.*[a-z])');
    const upper = new RegExp('(?=.*[A-Z])');
    const number = new RegExp('(?=.*[0-9])');
    const special = new RegExp("(?=.*[!@#\$%\^&\*])");
    const length = new RegExp("(?=.{8,})")
    let LowerValidation = false, upperValidation = false, SpecialValidation = false, NumberValidation = false, LenghtValidation = false;
    lower.test(password) ? LowerValidation = true : LowerValidation = false;
    upper.test(password) ? upperValidation = true : upperValidation = false;
    special.test(password) ? SpecialValidation = true : SpecialValidation = false;
    number.test(password) ? NumberValidation = true : NumberValidation = false;
    length.test(password) ? LenghtValidation = true : LenghtValidation = false;
    let allTrue = LowerValidation && upperValidation && SpecialValidation && NumberValidation && LenghtValidation
    return allTrue
    // console.log(password?.includes(" "));
  }


  return (
    <div id='AuthContainer'>
      <form id='Register' onSubmit={submitForm}>
        <h2>REGISTER</h2>
        <div id='Register-Input'>
          <label htmlFor='Name'>Name</label>
          <input type="text" name="Name" value={registerData.Name} id="Name" onChange={handleInput} required />
          <label htmlFor='Email'>Email</label>
          <input type="email" name="Email" value={registerData.Email} id="Email" onChange={handleInput} required />

          <div id='passwordInfo'>
            <label htmlFor='Password'>Password</label>
            <div id='passwordInfoRules'>
              <IoInformationCircleSharp />
              <div id='passwordRules'>
                <h5>Your password must contain:</h5>
                <p>At least 8 characters</p>
                <p>Lower case letters (a-z)</p>
                <p>Upper case letters (A-Z)</p>
                <p>Numbers (0-9)</p>
                <p>Special characters (e.g. !@#$%^&*)</p>
              </div>
            </div>
          </div>
          <input type="password" name="Password" value={registerData.Password} id="Password" onChange={handleInput} required />
          <label htmlFor='Confirm_Password'>Confirm Password</label>
          <input type="password" name="Confirm_Password" value={registerData.Confirm_Password} id="Confirm_Password" onChange={handleInput} required />
        </div>
        <div id='formMethod'>
          <div>
            <input type="checkbox" onChange={handlePassword} name="ShowPassword" id="ShowPassword" />
            <label htmlFor='ShowPassword'>Show Password</label>
          </div>
        </div>

        <input type='submit' value="REGISTER" />
        <p>Already have account? <Link to='/Login'>LOGIN</Link></p>
      </form>
    </div>
  )
}

export default Register