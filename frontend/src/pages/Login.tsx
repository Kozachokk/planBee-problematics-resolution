import { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login(){

    const [error, setError] = useState("");
    const navigate = useNavigate()

    const login = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Get cookies from the server
        const requestOption:RequestInit = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({
                username: (e.target.elements.namedItem("username") as HTMLInputElement).value,
                password: (e.target.elements.namedItem("password") as HTMLInputElement).value
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

    return(
        <div className="formBox">
            <form onSubmit={login}>
                <label htmlFor="username">username</label>
                <input type="text" id="username" name='username'></input>
                <label htmlFor="password">password</label>
                <input type="text" id="password" name='password'></input>
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    )
}

export default Login;