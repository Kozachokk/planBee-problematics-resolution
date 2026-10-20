import { useState } from "react"
import type IProblem from "../components/Problem/IProblem"
import Problem from "../components/Problem/Problem";
import { useFetchData } from "../hooks/FetchAPI";


function Dashboard(){
    const [problems, setProblems] = useState<IProblem[]>();


    const parseProblemsData = (data:any) => {
      const problems = data.map((el: any) => (
        {
          problemId: el.problemId,
          problemPrompt: el.problem,
          createdBy: el.createdBy,
          solutions: el.solutions
        }
      ))
      setProblems(problems)
    }

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