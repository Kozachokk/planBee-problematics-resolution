import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { UserContext } from "./contexts/UserContext";
import type { IUserContext } from "./@types/UserContext";
import { useContext } from "react";
import { useFetchData } from "./hooks/Fetch";

function App(){

  const { loginUser } = useContext(UserContext) as IUserContext
  if(import.meta.env.MODE !== "CSS") {
    useFetchData("/auth/user", loginUser)
  }

  return(
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Dashboard />}/>
        <Route path="login" element={<Login />}/>
      </Routes>
    </>
  )
}

export default App;