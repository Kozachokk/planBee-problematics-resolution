import { useState } from "react"
import type IProblem from "../components/Problem/IProblem"
import Problem from "../components/Problem/Problem";


function Dashboard(){
    const [problems, setProblems] = useState<IProblem[]>();

    

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