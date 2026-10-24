import { useState, useEffect, useContext } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import type { IUserContext } from '../@types/UserContext';
import { fetchPost } from '../util/fetch';

function Login() {

    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { user, loginUser } = useContext(UserContext) as IUserContext;

    const navigate = useNavigate()

    if (user) navigate("/")

    // Add an event listener for the enter key to submit the form, automatically removes it too
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
        const handleResponse = () => {
            navigate("/")
        }

        const handleError = (error: string) => {
            setError(error + "");
        }

        const loginInformation = {
            username: username,
            password: password,
        }

        if (import.meta.env.MODE === "CSS") {
            navigate("/")
            loginUser({
                userId: 0,
                username: "admin",
                isAdmin: true,
                canCreateProblems: true
            })
        }
        else fetchPost("/auth/login", JSON.stringify(loginInformation), handleResponse, handleError);
    }

    const submitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        login();
    }

    return (
        <div className="formBox">
            <form onSubmit={submitForm}>
                <label htmlFor="username">username</label>
                <input type="text" id="username" name='username' value={username} onChange={(e) => { setUsername(e.target.value) }}></input>
                <label htmlFor="password">password</label>
                <input type="password" id="password" name='password' value={password} onChange={(e) => { setPassword(e.target.value) }}></input>
                <button type="submit">Login</button>
            </form>
            {error && <p className='error'>Error: {error}</p>}
        </div>
    )
}

export default Login;