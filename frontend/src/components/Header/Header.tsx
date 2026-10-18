import { useContext } from 'react';
import './header.css';
import { UserContext } from '../../contexts/UserContext';
import type { IUserContext } from '../../@types/UserContext';

function Header(){
    const { user } = useContext(UserContext) as IUserContext;

    return (
        <header>
            <p>Name: {user?.username}</p>
            <button>Logout</button>
        </header>
    )
}

export default Header;