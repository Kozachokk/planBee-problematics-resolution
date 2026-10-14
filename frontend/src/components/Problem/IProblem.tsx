import type { ISolution } from '../Solution/ISolution';

export interface IProblem{
    problemId: number,
    problemPrompt: string,
    solutions: ISolution[];
};