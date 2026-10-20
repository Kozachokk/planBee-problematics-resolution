import { useNavigate } from "react-router-dom";
import type ISolution from "./ISolution";
import './solution.css'

function Solution(props: ISolution){
    const data: ISolution = {
        solution: props.solution,
        solutionId: props.solutionId,
        approvedBy: props.approvedBy,
        disapprovedBy: props.disapprovedBy,
        proposedBy: props.proposedBy
    }

    const navigate = useNavigate()

    const postReaction = (body: string) => {
        const post = () => {
            const headers: RequestInit = {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: body
            }

            fetch(`${import.meta.env.VITE_BASE_API_URL}/solution/reaction`, headers)
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

    const approve = () => {
        const body = {
            solutionId: data.solutionId,
            reaction: 1,
        }

        postReaction(JSON.stringify(body));
    }

    const disapprove = () => {
        const body = {
            solutionId: data.solutionId,
            reaction: -1,
        }

        postReaction(JSON.stringify(body));
    }

    return(
        <article className="solution">
            <h3>Proposed Solution: <span className="subtitle">{data.solution}</span></h3>
            <div className="details">
                <div className="feedback">
                    <button onClick={approve}>✅ {data.approvedBy.length}</button>
                    <button onClick={disapprove}>❌ {data.disapprovedBy.length}</button>
                </div>   
                <p>Proposed by: {data.proposedBy}</p>
            </div>
        </article>
    )
}

export default Solution;