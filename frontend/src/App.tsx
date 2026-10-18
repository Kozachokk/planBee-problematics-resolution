import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App(){

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