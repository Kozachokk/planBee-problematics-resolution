import './login.css';

function Login(){
    return(
        <div className="formBox">
            <form onSubmit={login}>
                <label htmlFor="secretcode">Login Id</label>
                <input type="text" id="loginid"></input>
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