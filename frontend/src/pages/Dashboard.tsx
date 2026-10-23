import React, { useContext, useEffect, useState } from "react"
import type IProblem from "../@types/IProblem"
import Problem from "../components/Problem/Problem";
import { UserContext } from "../contexts/UserContext";
import type { IUserContext } from "../@types/UserContext";
import { useNavigate } from "react-router-dom";
import './dashboard.css'
import { fetchGet, fetchPost } from "../util/fetch";


function Dashboard(){
    const [problems, setProblems] = useState<IProblem[]>([]);
    const navigate = useNavigate();
    const {user} = useContext(UserContext) as IUserContext;
    const [errorPosting, setErrorPosting] = useState("");

    const deleteProblem = (problemId: number) => {
      const updated: IProblem[] = problems.filter(prob => prob.problemId !== problemId)

      setProblems([...updated])
    }

    const postProblem = (problem: IProblem) => {
      // Add problem to ui
      problems?.push(problem);
      setProblems(problems);

      const handleResponse = (data: any) => {
        // Update the new problem's id to reflect that of the backend
        const updated: IProblem[] = problems.map((prob) => {
          if(prob.problemId === problem.problemId){
              prob.problemId = data.problemId;
          }
          return prob;
        })

        setProblems(updated);
        setErrorPosting("")
      }
      const handleError = (error: string) => {
        switch (error){
          case "This problem already exists":
            // Remove the problem if it was illegal
            deleteProblem(problem.problemId)
            setErrorPosting("This problem already exists")
            break;
          case "Not logged in":
            navigate("/login");
            break;
          default:
            if(import.meta.env.DEV){
              console.error("Post Problem Error: " + error);
            }
        }
      }

      fetchPost("/problem/add", JSON.stringify({problem: problem.problemPrompt}), handleResponse, handleError)
    }

    const parseProblemsData = (data:any) => {
      const problems = data.map((prob: any) => (
        {
          problemId: prob.problemId,
          problemPrompt: prob.problem,
          createdBy: prob.createdBy,
          solutions: prob.solutions
        }
      ))
      setProblems(problems)
    }

    const submitProblem = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const problem: IProblem = {
            problemPrompt: (e.target.elements.namedItem("input-solution") as HTMLInputElement).value,
            solutions: [],
            createdBy: user!.username,
            problemId: Date.now(),
        }

        postProblem(problem)
    }

    // Populate the problems useState
    useEffect(() => {
      if(import.meta.env.MODE == "CSS"){
          const sampleProblems: IProblem[] = [
            {
              problemId: 0,
              problemPrompt: "Problem 1 sample with little text",
              solutions: [{
                solutionId: 0,
                solution: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae",
                approvedBy: ['admin', 'user'],
                disapprovedBy: [],
                proposedBy: "admin"
              },
              {
                solutionId: 2,
                solution: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
                approvedBy: ['user'],
                disapprovedBy: ['admin'],
                proposedBy: "user"
              }],
              createdBy: "admin"
            },
            {
              problemId: 1,
              problemPrompt: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae",
              solutions: [],
              createdBy: "user 1"
            },
            {
              problemId: 5,
              problemPrompt: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Consectetur adipiscing elit quisque faucibus ex sapien vitae. Ex sapien vitae pellentesque sem placerat in id. Placerat in id cursus mi pretium tellus duis. Pretium tellus duis convallis tempus leo eu aenean.",
              solutions: [],
              createdBy: "Ilya"
            }
          ];

          useEffect(() => {
            setProblems(sampleProblems);
          }, [])
      }
      else {
        fetchGet("/problem", parseProblemsData, (error) => console.error(error));
      }
    }, [])


    return(
      <main>
        {problems?.map(problem => <Problem 
          key={problem.problemId}
          problemId={problem.problemId}
          problemPrompt={problem.problemPrompt}
          solutions={problem.solutions}
          createdBy={problem.createdBy}
          deleteProblem={deleteProblem}
        />)}
        {(user?.canCreateProblems || user?.isAdmin) && <form onSubmit={submitProblem} className='problem-submit-form'>
          <h2>Post new problem?</h2>
          <textarea className='input-solution' name="input-solution" placeholder="Post new problem?"></textarea>
          <button className='submit-solution' type='submit'>Post Problem</button>
          {errorPosting && <p className="error">{errorPosting}</p>}
        </form>}
      </main>
    )
}

export default Dashboard