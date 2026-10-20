import type ISolution from '../Solution/ISolution';

export default interface IProblem{
    problemId: number,
    problemPrompt: string,
    solutions: ISolution[],
    createdBy: string,
};