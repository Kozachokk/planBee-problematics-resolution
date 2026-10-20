export default interface ISolution {
    solutionId: number,
    solution: string,
    approvedBy: string[],
    disapprovedBy: string[],
    proposedBy: string,
}