import React, { useContext, useState } from "react"
import type IProblem from "../components/Problem/IProblem"
import Problem from "../components/Problem/Problem";
import { useFetchData } from "../hooks/FetchAPI";
import { UserContext } from "../contexts/UserContext";
import type { IUserContext } from "../@types/UserContext";
import { useNavigate } from "react-router-dom";
import './dashboard.css'


function Dashboard(){
    const [problems, setProblems] = useState<IProblem[]>([]);
    const navigate = useNavigate();
    const {user, loginUser} = useContext(UserContext) as IUserContext;
    const [errorPosting, setErrorPosting] = useState("");

    useFetchData("/auth/user", loginUser)

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

    const addProblem = (problem: IProblem) => {
      problems?.push(problem);
      setProblems(problems);
    }

    const removeIllegalProblem = (problem: IProblem) => {
      const updated: IProblem[] = problems.filter(prob => prob !== problem)

      setProblems(updated);
    }

    const setProblemId = (problem: IProblem, problemId: number) => {
      const updated: IProblem[] = problems.map((prob) => {
        if(prob === problem){
            prob.problemId = problemId;
        }
        return prob;
      })

      setProblems(updated);
    }

    const postProblem = (problem: IProblem) => {
        addProblem(problem)

        const post = () => {
            const headers: RequestInit = {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({problem: problem.problemPrompt})
            }

            fetch(`${import.meta.env.VITE_BASE_API_URL}/problem/add`, headers)
            .then(async response => {
                if(!response.ok){
                  if(response.status == 401) refresh();
                  else{
                    return Promise.reject(await response.text())
                  }
                }

                const isJSON = response.headers.get('content-type')?.includes('application/json');
                const responseJson = isJSON && await response.json();

                setProblemId(problem, responseJson.problemId)
                setErrorPosting("")
            })
            .catch(error => {
                console.error(error);
                if(error === "This problem already exists"){
                    removeIllegalProblem(problem)
                    setErrorPosting("This problem already exists")
                }
            })
        }

        const refresh = () => {
            const headers: RequestInit = {
            method: "GET",
            credentials: "include"
            }
            fetch(`${import.meta.env.VITE_BASE_API_URL}/auth/refresh`, headers)
                .then(async response => {
                    if(!response.ok){
                        return Promise.reject(await response.text())
                    }
                    post()
                    console.log(await response.text());
                })
                .catch(error => {
                    console.error("Refresh didn't work: " + error)
                    navigate("/login");
                }
            )
        }

        post();
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
        {user?.canCreateProblems && <form onSubmit={submitProblem} className='problem-submit-form'>
          <h2>Post new problem?</h2>
          <textarea className='input-solution' name="input-solution" placeholder="Post new problem?"></textarea>
          <button className='submit-solution' type='submit'>Post Problem</button>
          {errorPosting && <p className="error">{errorPosting}</p>}
        </form>}
      </main>
    )
}

export default Dashboard