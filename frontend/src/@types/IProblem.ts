import type ISolution from './ISolution';

export default interface IProblem {
    problemId: number,
    problemPrompt: string,
    solutions: ISolution[],
    createdBy: string,
};

export interface IProblemComponent extends IProblem {
    deleteProblem: (prob: number) => void;
}