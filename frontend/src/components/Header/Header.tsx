import { useContext } from 'react';
import './header.css';
import { UserContext } from '../../contexts/UserContext';
import type { IUserContext } from '../../@types/UserContext';
import { useNavigate } from 'react-router-dom';

function Header() {
    const { user, clearUser, loginUser } = useContext(UserContext) as IUserContext;

    const navigate = useNavigate()

    const logout = () => {
        const headers: RequestInit = {
            method: "GET",
            credentials: "include",
        }
        fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/logout`, headers)

        clearUser()

        navigate("/login");
    }

    return (
        <header>
            <h2>Logged In As: <span>{user?.username}</span></h2>
            {import.meta.env.MODE === "CSS" && <button style={{position: 'absolute', top: '50px', left: '20px'}} onClick={() => loginUser({userId: user!.userId, username: user!.username, isAdmin: !user!.isAdmin, canCreateProblems: user!.canCreateProblems})}>Toggle admin(css testing)</button>}
            <button onClick={logout}>Logout</button>
        </header>
    )
}

export default Header;