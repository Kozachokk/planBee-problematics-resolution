import Header from "./components/Header/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import { createContext, useState, type Dispatch, type SetStateAction } from "react";

interface IUser{
  userId: number,
  username: string,
  isAdmin: boolean,
  canCreateProblems: boolean
}

interface IUserContext{
  user?: IUser,
  setUser?: Dispatch<SetStateAction<IUser | undefined>>
}

const [user, setUser] = useState<IUser>();

export const UserContext = createContext<IUserContext>({user: user, setUser: setUser})

function App(){

  const value: IUserContext = {
    user:user, setUser:setUser
  }

  return(
    <UserContext.Provider value={value}>
      <Header/>
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path="login" element={<Login />}/>
      </Routes>
    </UserContext.Provider>
  )
}


export default App;