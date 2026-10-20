import type IProblem from "./IProblem";
import Solution from "../Solution/Solution";
import './problem.css'


function Problem(props: IProblem){
    
    const data:IProblem = {
        problemId: props.problemId,
        problemPrompt: props.problemPrompt,
        solutions: props.solutions,
        createdBy: props.createdBy
    }

    const submitSolution = () => {
        //
    }

    console.log(data.solutions)

    return(
        <article className="problem">
            <h2>Problematic: <span className="subtitle">{data.problemPrompt}</span><br/>Added by: {data.createdBy}</h2>
            {data.solutions.map(solution => <Solution
                key={solution.solutionId}
                solutionId={solution.solutionId}
                solution={solution.solution}
                approvedBy={solution.approvedBy}
                disapprovedBy={solution.disapprovedBy}
                proposedBy={solution.proposedBy}
            />)}
        <form onSubmit={submitSolution}>
            <input className='input-solution' type='text' placeholder="Add Solutions?"></input>
            <button className='submit-solution'>Add Solution</button>
        </form>
        </article>
    );
}

export default Problem;