import { useState, useEffect, useContext } from "react";
import Problem from "../components/Problem/Problem";
import type IProblem from "../components/Problem/IProblem";
import { UserContext } from "../App";

function Dashboard(){
  const [problems, setProblems] = useState<IProblem[]>([]);
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    const fetchProblems = async () => {
      await fetch(`${import.meta.env.VITE_BASE_API_URL}/problem`, {
        method: "GET",
        });
      }

    fetchProblems()
  }, [])

  return (
    <>
    <h1>{user?.username}</h1>
    {problems.map(problem => <Problem 
        problemId={problem.problemId}
        problemPrompt={problem.problemPrompt}
        solutions={problem.solutions}
      />)}
    </>
  )
}

export default Dashboard;

