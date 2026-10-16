import './login.css';

function Login(){
    return(
        <div className="formBox">
            <form onSubmit={login}>
                <label htmlFor="username">Login Id</label>
                <input type="text" id="username" name='username'></input>
                <label htmlFor="password">Login Id</label>
                <input type="text" id="password" name='password'></input>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

function login(e: React.SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    
    // Get cookies from the server
    console.log((e.target.elements.namedItem("loginid") as HTMLInputElement).value);
}

export default Login;