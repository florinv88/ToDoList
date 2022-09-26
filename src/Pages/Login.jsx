import React from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'

function Login() {
    const { useState } = React
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    const loginUser = () => {
        if (username === '' || password === '') {
            alert("Username or password invalid!")
        }
        else {
            axios({
                method: "post",
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true,
                url: "https://todolist-t1.herokuapp.com/login"
            })
                .then(res => (console.log(res), navigate('/')))
        }
        setUsername("")
        setPassword("")
    }

    return (
        <div className="register-page">
            <div className="register-page__block">
                <section className="register-page__block__input">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </section >
                <section className="register-page__block__input">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </section>
                <br />
                <button onClick={loginUser}>Login</button>
            </div>
        </div >
    )
}

export default Login