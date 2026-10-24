import { createContext, useState, type ReactNode } from "react";
import type { IUser, IUserContext } from "../@types/UserContext";

export const UserContext = createContext<IUserContext | null>(null)

interface IProps {
    children: ReactNode
}

function UserContextProvider({ children }: IProps) {
    const [user, setUser] = useState<IUser>()

    const loginUser = (user: IUser) => {
        const loggedInUser: IUser = {
            userId: user.userId,
            username: user.username,
            isAdmin: !!user.isAdmin,
            canCreateProblems: !!user.canCreateProblems,
        }
        setUser(loggedInUser)
    }

    const clearUser = () => {
        setUser(undefined)
    }

    return (
        <UserContext.Provider value={{ user, loginUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider