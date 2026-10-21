import Solution from "../Solution/Solution";
import './problem.css'
import { useNavigate } from "react-router-dom";
import type ISolution from "../Solution/ISolution";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import type { IUserContext } from "../../@types/UserContext";
import type { IProblemComponent } from "./IProblem";


function Problem(props: IProblemComponent){
    const [solutions, setSolutions] = useState<ISolution[]>(props.solutions);
    const navigate = useNavigate()
    const {user} = useContext(UserContext) as IUserContext;

    const addSolution = (solution: ISolution) => {
        solutions.push(solution);
        setSolutions(solutions);
    }

    const setSolutionId = (oldId: number, solutionId: number) => {
      const updated: ISolution[] = solutions.map((sol) => {
        if(sol.solutionId === oldId){
            sol.solutionId = solutionId;
        }
        return sol;
      })

      setSolutions(updated);
    }

    const postSolution = (solution: ISolution) => {
        addSolution(solution)

        const post = () => {
            const headers: RequestInit = {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({problemId: props.problemId, solution: solution.solution})
            }

            fetch(`${import.meta.env.VITE_BASE_API_URL}/solution/add`, headers)
            .then(async response => {
                if(!response.ok){
                    return Promise.reject(response.status)
                }

                const isJSON = response.headers.get('content-type')?.includes('application/json');
                const responseJson = isJSON && await response.json();

                setSolutionId(solution.solutionId, responseJson.solutionId)
            })
            .catch(error => {
                console.error(error);
                if(error === 401){
                    refresh();
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

    const submitSolution = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const solution: ISolution = {
            solution: (e.target.elements.namedItem("input-solution") as HTMLInputElement).value,
            solutionId: Date.now(),
            approvedBy: [],
            disapprovedBy: [],
            proposedBy: user!.username
        }

        postSolution(solution)
    }

    const deleteProblem = () => {
        const deleteProblem = () => {
            const headers: RequestInit = {
                method: "DELETE",
                credentials: "include"
            }

            fetch(`${import.meta.env.VITE_BASE_API_URL}/problem/delete/${props.problemId}`, headers)
            .then(async response => {
                if(!response.ok){
                    return Promise.reject(response.status)
                }
                props.deleteProblem(props.problemId)
            })
            .catch(error => {
                console.error(error);
                if(error === 401){
                    refresh();
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
                    deleteProblem()
                    console.log(await response.text());
                })
                .catch(error => {
                    console.error("Refresh didn't work: " + error)
                    navigate("/login");
                }
            )
        }

        deleteProblem();
    }

    return(
        <article className="problem">
            <section>
                <h2>{props.createdBy}: <span className="subtitle">{props.problemPrompt}</span></h2>
                {(user?.isAdmin || props.createdBy === user?.username) && <button onClick={deleteProblem}>delete</button>}
            </section>
            {solutions.map(solution => <Solution
                key={solution.solutionId}
                solutionId={solution.solutionId}
                solution={solution.solution}
                approvedBy={solution.approvedBy}
                disapprovedBy={solution.disapprovedBy}
                proposedBy={solution.proposedBy}
            />)}
        <form onSubmit={submitSolution}>
            <textarea className='input-solution' name="input-solution" placeholder="Add Solutions?"></textarea>
            <button className='submit-solution' type='submit'>Add Solution</button>
        </form>
        </article>
    );
}

export default Problem;