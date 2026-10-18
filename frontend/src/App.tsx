import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./pages/Login";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import Dashboard from "./pages/Dashboard";

function App(){
  const user = useContext(UserContext)?.user;



  return(
    <>
      <Header/>
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Navigate replace to={"/login"}/> }/>
        <Route path="login" element={<Login />}/>
      </Routes>
    </>
  )
}

export default App;