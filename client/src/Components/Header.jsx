import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Header.css"
import { NavLink } from "react-router-dom"
import { UserData } from "../App"
import axios from 'axios'
import { GiHamburgerMenu } from "react-icons/gi";
import { notification } from './Notification'
import { useLocation } from 'react-router-dom'

const Header = () => {
    const { userData, setUserData, checkUserAlreadyLogin } = useContext(UserData)
    const [logoutConfirmation, setLogoutConfirmation] = useState(false);
    const [menuSlide, setmenuSlide] = useState(false);
    const ref = useRef(null);
    const location = useLocation();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setLogoutConfirmation(false);
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [logoutConfirmation]);

    const logout = async () => {
        await axios.get("/api/logout").then((response) => {
            console.log(response.data.message);
            notification(response.data.message, "Success");
            setTimeout(() => {
                window.location.reload();
            }, 1000)
        })
    }

    useEffect(() => {
        let a = document.getElementById("menuSlider");
        if (menuSlide) {
            a.classList.add("menuSliderActive")
            a.classList.remove("menuSliderUnActive")
        } else {
            a.classList.add("menuSliderUnActive")
            a.classList.remove("menuSliderActive")
        }
    }, [menuSlide])

    const handleSlider = () => setmenuSlide(!menuSlide)
    return (
        <>
            <header>
                <h1>Language Learning Game</h1>
                <ol>
                    <li><NavLink to={"/"} className={location.pathname.includes("/home") ? "active" : ""}>HOME</NavLink></li>
                    <li><NavLink to={"/scoreboard/UserPerformance"}  className={location.pathname.includes("/scoreboard") ? "active" : ""}>SCORE BOARD</NavLink></li>
                    {
                        userData ?
                            <li><button onClick={() => setLogoutConfirmation(!logoutConfirmation)}>LOGOUT</button></li>
                            :
                            <>
                                <li><NavLink to={"/login"}>LOGIN</NavLink></li>
                                <li><NavLink to={"/register"}>REGISTER</NavLink></li>
                            </>
                    }
                </ol>
                <GiHamburgerMenu id="hamburgerMenu" onClick={handleSlider} />
                {/* {
                    menuSlide && */}
                <ul id='menuSlider'>
                    <NavLink to={"/"}  className={location.pathname.includes("/home") ? "active" : ""} onClick={handleSlider}><li className='listText'>HOME</li></NavLink>
                    <NavLink to={"/scoreboard/UserPerformance"} className={location.pathname.includes("/scoreboard") ? "active" : ""} onClick={handleSlider} ><li>SCORE BOARD</li></NavLink>
                    {
                        userData ?
                            <button onClick={() => { setmenuSlide(!menuSlide); setLogoutConfirmation(!logoutConfirmation) }}><li className='listText'>LOGOUT</li></button>
                            :
                            <>
                                <NavLink to={"/login"} onClick={handleSlider}><li className='listText'>LOGIN</li></NavLink>
                                <NavLink to={"/register"} onClick={handleSlider}><li className='listText'>REGISTER</li></NavLink>
                            </>
                    }
                </ul>
                {/* } */}
            </header>
            {
                logoutConfirmation &&
                <div id='logout-confirmation' >
                    <div id='logout-dialog' ref={ref}>
                        <h3>Are you sure <br /> you want to logout?</h3>
                        <div id='buttons'>
                            <button onClick={() => setLogoutConfirmation(!logoutConfirmation)}>Cancel</button>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Header