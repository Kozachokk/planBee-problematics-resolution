import type ISolution from "./ISolution";
import './solution.css'

function Solution(props: ISolution){
    const approve = () => {
        //Update db to approve this
    }

    const disapprove = () => {
        //Update db to disapprove this
    }


    return(
        <article>
            <h3>Proposed Solution: <span className="subtitle">{props.solution}</span><br/>Proposed by: {props.proposedBy}</h3>
            <div className="feedback">
                <button onClick={approve}>✅ {props.approvedBy.length}</button>
                <button onClick={disapprove}>❌ {props.disapprovedBy.length}</button>
            </div>
        </article>
    )
}

export default Solution;