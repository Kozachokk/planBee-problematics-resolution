import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import './login.css';

function Login(){

    const [error, setError] = useState("");

    const login = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Get cookies from the server
        const requestOption:RequestInit = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: (e.target.elements.namedItem("username") as HTMLInputElement).value,
                password: (e.target.elements.namedItem("password") as HTMLInputElement).value
            })
        }

        fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/login`, requestOption)
            .then(async response => {
                const isJson = response.headers.get("Content-Type")?.includes('application/json');
                const data = isJson && await response.json();

                if(!response.ok){
                    const error = (data && data.message) || await response.text()
                    return Promise.reject(error);
                }

                console.log(response.headers);
                useContext(UserContext)?.loginUser({
                    userId: -1,
                    username: "admin",
                    isAdmin: true,
                    canCreateProblems: true
                });
            })
            .catch(error => {
                setError(error);
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