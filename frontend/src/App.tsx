import type { ISolution } from "./components/Solution/ISolution";
import Problem from "./components/Problem/Problem";
import { useState } from "react";
import type { IProblem } from "./components/Problem/IProblem";

const solutions: ISolution[] = [
  {
    solutionId: 0,
    disprovedBy: ["person 1"],
    approvedBy: ["1", "2", "3"],
    solutionPrompt: "Do somethings"
  },
  {
    solutionId: 1,
    approvedBy: ["waf"],
    disprovedBy: ["fwaf", "woof"],
    solutionPrompt: "Do nothing"
  }
]

const problemsPlaceholders: IProblem[] = [
  {
    problemId: 0,
    problemPrompt: "Yes, this has become a really very big problem and we need to find a solution very fast for this incredibly hard problem lorem ipsum",
    solutions: solutions
  },
  {
    problemId: 1,
    problemPrompt: "Yes, this is another very important problem lorem ipsus......has become a really very big problem and we need to find a solution very fast for this incredibly hard problem lorem ipsum",
    solutions: solutions
  }
]

function App(){

  const [problems, setProblems] = useState<IProblem[]>(problemsPlaceholders);

  return(
    <main>
      {problems.map(problem => <Problem 
        problemId={problem.problemId}
        problemPrompt={problem.problemPrompt}
        solutions={problem.solutions}
      />)}
    </main>
  )
}

export default App;