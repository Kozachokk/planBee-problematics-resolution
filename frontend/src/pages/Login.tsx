import { useState, useEffect, useContext } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import type { IUserContext } from '../@types/UserContext';

function Login(){

    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { user } = useContext(UserContext) as IUserContext;

    const navigate = useNavigate()

    if(user) navigate("/")

    useEffect(() => {
    const listener = (e: KeyboardEvent) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            login()
        }
    };
    document.addEventListener("keydown", listener);
    return () => {
        document.removeEventListener("keydown", listener);
    };
  }, []);

    const login = () => {
        const requestOption:RequestInit = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password,
            })
        }

        fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/login`, requestOption)
            .then(async response => {
                if(!response.ok){
                    const error = await response.text()
                    return Promise.reject(error);
                }

                navigate("/")
            })
            .catch(error => {
                setError(error + "");
            }
        )
    }

    const submitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        login();
    }

    return(
        <div className="formBox">
            <form onSubmit={submitForm}>
                <label htmlFor="username">username</label>
                <input type="text" id="username" name='username' value={username} onChange={(e) => {setUsername(e.target.value)}}></input>
                <label htmlFor="password">password</label>
                <input type="password" id="password" name='password' value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
                <button type="submit">Login</button>
            </form>
            {error && <p className='error'>Error: {error}</p>}
        </div>
    )
}

export default Login;