import { useNavigate } from "react-router-dom";
import './solution.css'
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import type { IUserContext } from "../../@types/UserContext";
import type { ISolutionComponent } from "../../@types/ISolution";
import { fetchDelete, fetchPost } from "../../util/fetch";

function Solution(props: ISolutionComponent) {
    const [approvedBy, setApprovedBy] = useState<string[]>(props.approvedBy)
    const [disapprovedBy, setDisapprovedBy] = useState<string[]>(props.disapprovedBy)

    const navigate = useNavigate()
    const { user } = useContext(UserContext) as IUserContext;

    const postReaction = (body: string) => {
        const handleError = (error: string) => {
            switch (error) {
                case "Not logged in":
                    navigate("/login");
                    break;
                default:
                    if (import.meta.env.DEV) {
                        console.error("Reaction error: " + error);
                    }
            }
        }
        fetchPost("/solution/reaction", body, () => { }, handleError);
    }

    const approve = () => {
        const body = {
            solutionId: props.solutionId,
            reaction: 1,
        }

        // should unreact
        const approveIndex = approvedBy.indexOf(user!.username);
        if (approveIndex > -1) {
            body.reaction = 0;
            approvedBy.splice(approveIndex, 1);
        } // If user react's removes the disapprove
        else {
            approvedBy.push(user!.username);
            const index = disapprovedBy.indexOf(user!.username);
            if (index > -1) disapprovedBy.splice(index, 1);
        }

        setDisapprovedBy([...disapprovedBy])
        setApprovedBy([...approvedBy]);
        postReaction(JSON.stringify(body));
    }

    const disapprove = () => {
        const body = {
            solutionId: props.solutionId,
            reaction: -1,
        }

        // shoul unreact
        const disapproveIndex = disapprovedBy.indexOf(user!.username);
        if (disapproveIndex > -1) {
            body.reaction = 0;
            disapprovedBy.splice(disapproveIndex, 1);
        } // If the user reacts, remove the approve reaction
        else {
            disapprovedBy.push(user!.username);
            const index = approvedBy.indexOf(user!.username);
            if (index > -1) approvedBy.splice(index, 1);
        }

        setDisapprovedBy([...disapprovedBy])
        setApprovedBy([...approvedBy])
        postReaction(JSON.stringify(body));
    }

    const deleteSolution = () => {
        if(import.meta.env.MODE === "CSS") props.deleteSolution(props.solutionId)

        const handleResponse = () => {
            props.deleteSolution(props.solutionId)
        }
        const handleError = (error: string) => {
            switch (error) {
                case "Not logged in":
                    navigate("/login");
                    break;
                default:
                    if (import.meta.env.DEV) {
                        console.error("Reaction error: " + error);
                    }
            }
        }
        fetchDelete("/solution", props.solutionId, handleResponse, handleError)
    }

    return (
        <article className="solution">
            <section>
                <h3>Proposed Solution: <span className="subtitle">{props.solution}</span></h3>
                {(user?.isAdmin || props.proposedBy === user?.username) && <button onClick={deleteSolution}></button>}
            </section>
            <div className="details">
                <div className="feedback">
                    <button onClick={approve} className={"reaction " + (approvedBy.some((name) => name === user?.username) ? "highlighted" : "")}>✅ {approvedBy.length}</button>
                    <button onClick={disapprove} className={"reaction " + (disapprovedBy.some((name) => name === user?.username) ? "highlighted" : "")}>❌ {disapprovedBy.length}</button>
                </div>
                <p>Proposed by: {props.proposedBy}</p>
            </div>
        </article>
    )
}

export default Solution;