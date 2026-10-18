export default interface ISolution {
    solutionId: number,
    solutionPrompt: string,
    approvedBy: string[],
    disprovedBy: string[],
}