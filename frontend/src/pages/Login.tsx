import './login.css';

function Login(){
    return(
        <div className="formBox">
            <form onSubmit={login}>
                <label htmlFor="username">username</label>
                <input type="text" id="username" name='username'></input>
                <label htmlFor="password">password</label>
                <input type="text" id="password" name='password'></input>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

function login(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    
    // Get cookies from the server
    console.log((e.target.elements.namedItem("username") as HTMLInputElement).value);
    console.log((e.target.elements.namedItem("password") as HTMLInputElement).value);
    
    const requestOption:RequestInit = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: (e.target.elements.namedItem("username") as HTMLInputElement).value,
            password: (e.target.elements.namedItem("password") as HTMLInputElement).value
        })
    }

    fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/login`, requestOption)
        .then(response => response.json())
        .then(data => console.log(data));
}

export default Login;