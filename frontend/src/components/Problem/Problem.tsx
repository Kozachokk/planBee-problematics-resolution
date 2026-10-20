import type IProblem from "./IProblem";
import Solution from "../Solution/Solution";
import './problem.css'
import { useNavigate } from "react-router-dom";


function Problem(props: IProblem){
    const navigate = useNavigate()

    const data:IProblem = {
        problemId: props.problemId,
        problemPrompt: props.problemPrompt,
        solutions: props.solutions,
        createdBy: props.createdBy
    }

    const postSolution = (body: string) => {
        const post = () => {
            const headers: RequestInit = {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: body
            }

            fetch(`${import.meta.env.VITE_BASE_API_URL}/solution/add`, headers)
            .then(async response => {
                if(!response.ok){
                    return Promise.reject(await response.text())
                }
            })
            .catch(error => {
                console.error(error);
                if(error == "Not logged in"){
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
        const body = {
            problemId: data.problemId,
            solution: (e.target.elements.namedItem("input-solution") as HTMLInputElement).value
        }

        postSolution(JSON.stringify(body))
    }

    console.log(data.solutions)

    return(
        <article className="problem">
            <h2>{data.createdBy}: <span className="subtitle">{data.problemPrompt}</span></h2>
            {data.solutions.map(solution => <Solution
                key={solution.solutionId}
                solutionId={solution.solutionId}
                solution={solution.solution}
                approvedBy={solution.approvedBy}
                disapprovedBy={solution.disapprovedBy}
                proposedBy={solution.proposedBy}
            />)}
        <form onSubmit={submitSolution}>
            <textarea className='input-solution' name="input-solution" placeholder="Add Solutions?"></textarea>
            <button className='submit-solution'>Add Solution</button>
        </form>
        </article>
    );
}

export default Problem;