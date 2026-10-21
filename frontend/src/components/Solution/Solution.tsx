import { useNavigate } from "react-router-dom";
import type ISolution from "./ISolution";
import './solution.css'
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import type { IUserContext } from "../../@types/UserContext";

function Solution(props: ISolution){
    const [approvedBy, setApprovedBy] = useState<string[]>(props.approvedBy)
    const [disapprovedBy, setDisapprovedBy] = useState<string[]>(props.disapprovedBy)

    const navigate = useNavigate()
    const { user } = useContext(UserContext) as IUserContext;

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
            solutionId: props.solutionId,
            reaction: 1,
        }

        if(approvedBy.includes(user!.username)) return;

        approvedBy.push(user!.username);
        const index = disapprovedBy.indexOf(user!.username);
        if(index > -1) disapprovedBy.splice(index, 1);


        setDisapprovedBy([...disapprovedBy])
        setApprovedBy([...approvedBy]);
        postReaction(JSON.stringify(body));
        console.log("approved: " + approvedBy)
    }

    const disapprove = () => {
        const body = {
            solutionId: props.solutionId,
            reaction: -1,
        }

        if(disapprovedBy.includes(user!.username)) return;

        disapprovedBy.push(user!.username);
        const index = approvedBy.indexOf(user!.username);
        if(index > -1) approvedBy.splice(index, 1);
        
        setDisapprovedBy([...disapprovedBy])
        setApprovedBy([...approvedBy])
        postReaction(JSON.stringify(body));
    }

    return(
        <article className="solution">
            <h3>Proposed Solution: <span className="subtitle">{props.solution}</span></h3>
            <div className="details">
                <div className="feedback">
                    <button onClick={approve} className={approvedBy.some((name) => name === user?.username) ? "highlighted" : ""}>✅ {approvedBy.length}</button>
                    <button onClick={disapprove} className={disapprovedBy.some((name) => name === user?.username) ? "highlighted" : ""}>❌ {disapprovedBy.length}</button>
                </div>   
                <p>Proposed by: {props.proposedBy}</p>
            </div>
        </article>
    )
}

export default Solution;