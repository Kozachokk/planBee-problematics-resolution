import { useContext, useEffect, useState } from "react"
import type IProblem from "../components/Problem/IProblem"
import Problem from "../components/Problem/Problem";
import { UserContext } from "../contexts/UserContext";
import type { IUserContext } from "../@types/UserContext";
import { useFetchData } from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";


function Dashboard(){
    const [problems, setProblems] = useState<IProblem[]>();
    const { user, loginUser } = useContext(UserContext) as IUserContext
    const navigate = useNavigate()

    useFetchData("/auth/user", loginUser)

    console.log(!user)
    if(!user) navigate("/login")



    return(
      <main>
        {problems?.map(problem => <Problem 
          problemId={problem.problemId}
          problemPrompt={problem.problemPrompt}
          solutions={problem.solutions}
        />)}
      </main>
    )
}

export default Dashboard