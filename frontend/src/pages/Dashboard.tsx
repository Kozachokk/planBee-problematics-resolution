import { useContext, useEffect, useState } from "react"
import type IProblem from "../components/Problem/IProblem"
import Problem from "../components/Problem/Problem";
import { UserContext } from "../contexts/UserContext";
import type { IUserContext } from "../@types/UserContext";
import { useFetchData } from "../hooks/useFetchData";


function Dashboard(){
    const [problems, setProblems] = useState<IProblem[]>();
    const { user, loginUser } = useContext(UserContext) as IUserContext

    const parseProblemsData = (data:any) => {
      setProblems(data.map((el: any) => (
        {
          problemId: el.problemId,
          problemPrompt: el.problem,
          createdBy: el.username,
          solutions: []
        }
      )))

      console.log(problems)
    }

    useFetchData("/auth/user", loginUser)
    useFetchData("/problem", parseProblemsData)


    return(
      <main>
        {problems?.map(problem => <Problem 
          key={problem.problemId}
          problemId={problem.problemId}
          problemPrompt={problem.problemPrompt}
          solutions={problem.solutions}
          createdBy={problem.createdBy}
        />)}
      </main>
    )
}

export default Dashboard