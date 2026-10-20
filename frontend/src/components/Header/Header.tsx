import { useContext } from 'react';
import './header.css';
import { UserContext } from '../../contexts/UserContext';
import type { IUserContext } from '../../@types/UserContext';
import { useNavigate } from 'react-router-dom';

function Header(){
    const { user, clearUser } = useContext(UserContext) as IUserContext;

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
            <p>Name: {user?.username}</p>
            <button onClick={logout}>Logout</button>
        </header>
    )
}

export default Header;