import Solution from "../Solution/Solution";
import './problem.css'
import { useNavigate } from "react-router-dom";
import type ISolution from "../../@types/ISolution";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import type { IUserContext } from "../../@types/UserContext";
import type { IProblemComponent } from "../../@types/IProblem";
import { fetchDelete, fetchPost } from "../../util/fetch";


function Problem(props: IProblemComponent) {
    const [solutions, setSolutions] = useState<ISolution[]>(props.solutions);
    const navigate = useNavigate()
    const { user } = useContext(UserContext) as IUserContext;

    const postSolution = (solution: ISolution) => {
        // Update the ui on the solution adding
        solutions.push(solution);
        setSolutions([...solutions]);

        const solutionInfo = {
            problemId: props.problemId,
            solution: solution.solution
        }

        const handleResponse = (data: any) => {
            // Update solution on its backend's id
            const updated: ISolution[] = solutions.map((sol) => {
                if (sol.solutionId === solution.solutionId) {
                    sol.solutionId = data.solutionId;
                }
                return sol;
            })

            setSolutions(updated);
        }

        const handleError = (error: string) => {
            switch (error) {
                case "Not logged in":
                    navigate("/login");
                    break;
                default:
                    if (import.meta.env.DEV) {
                        console.error("Post solution: " + error);
                    }
            }
        }

        fetchPost("/solution/add", JSON.stringify(solutionInfo), handleResponse, handleError)
    }

    const submitSolution = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const solution: ISolution = {
            solution: (e.target.elements.namedItem("input-solution") as HTMLInputElement).value,
            solutionId: Date.now(), // Create a temporary solutionId
            approvedBy: [],
            disapprovedBy: [],
            proposedBy: user!.username
        }

        postSolution(solution)
    }

    const deleteProblem = () => {
        props.deleteProblem(props.problemId);

        const handleError = (error: string) => {
            switch (error) {
                case "Not logged in":
                    navigate("/login")
                    break;
                default:
                    if (import.meta.env.DEV) {
                        console.error("Delete problem error: " + error);
                    }
            }
        }

        fetchDelete("/problem", props.problemId, () => {}, handleError)
    }

    const deleteSolution = (solutionId: number) => {
        const updated: ISolution[] = solutions.filter(sol => sol.solutionId !== solutionId)

        setSolutions([...updated])
    }

    return (
        <article className="problem">
            <section>
                <h2>{props.createdBy}: <span className="subtitle">{props.problemPrompt}</span></h2>
                {(user?.isAdmin || props.createdBy === user?.username) && <button onClick={deleteProblem}></button>}
            </section>
            {solutions.map(solution => <Solution
                key={solution.solutionId}
                solutionId={solution.solutionId}
                solution={solution.solution}
                approvedBy={solution.approvedBy}
                disapprovedBy={solution.disapprovedBy}
                proposedBy={solution.proposedBy}
                deleteSolution={deleteSolution}
            />)}
            <form onSubmit={submitSolution}>
                <textarea className='input-solution' name="input-solution" placeholder="Add Solutions?"></textarea>
                <button className='submit-solution' type='submit'>Add Solution</button>
            </form>
        </article>
    );
}

export default Problem;