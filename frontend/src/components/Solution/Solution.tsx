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

    const approve = () => {
        //Update db to approve this
    }

    const disapprove = () => {
        //Update db to disapprove this
    }

    return(
        <article>
            <h3>Proposed Solution: <span className="subtitle">{data.solution}</span><br/>Proposed by: {data.proposedBy}</h3>
            <div className="feedback">
                <button onClick={approve}>✅ {data.approvedBy.length}</button>
                <button onClick={disapprove}>❌ {data.disapprovedBy.length}</button>
            </div>
        </article>
    )
}

export default Solution;