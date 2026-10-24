import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { UserContext } from "./contexts/UserContext";
import type { IUserContext } from "./@types/UserContext";
import { useContext, useEffect } from "react";
import { fetchGet } from "./util/fetch";

function App() {

  const navigate = useNavigate()

  const { loginUser } = useContext(UserContext) as IUserContext

  useEffect(() => {
    if (import.meta.env.MODE !== "CSS") {
      const handleError = (error: string) => {
        if (error === "Not logged in") {
          navigate("/login");
        } else {
          console.error(error)
        }
      }

      fetchGet("/auth/user", loginUser, handleError);
    } else {
      loginUser({
        userId: 0,
        username: "admin",
        isAdmin: true,
        canCreateProblems: true
      })
    }
  }, [])


  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;