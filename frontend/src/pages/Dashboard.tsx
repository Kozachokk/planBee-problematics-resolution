import { useContext, useEffect, useState } from "react"
import type IProblem from "../components/Problem/IProblem"
import Problem from "../components/Problem/Problem";
import { UserContext } from "../contexts/UserContext";
import type { IUserContext } from "../@types/UserContext";


function Dashboard(){
    const [problems, setProblems] = useState<IProblem[]>();

    const { loginUser } = useContext(UserContext) as IUserContext

    useEffect(() => {
      const getUserData = () => {
        const headers: RequestInit = {
          method: "GET",
          credentials: "include"
        }

        fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/user`, headers)
          .then(async response => {
            const isJSON = response.headers.get("content-type")?.includes('application/json');
            const data = isJSON && await response.json();

            console.log(data);
            loginUser(data);
          })
          .catch(error => {
            console.error(error)
          })
      }

      getUserData()
    }, [])


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