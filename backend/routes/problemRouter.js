import express from 'express'
import db from '../db.js'
import { validateIdParam } from '../middleware/dataValidation.js';
import { createSolutionObject, deleteSolution, getAllSolutionOnProblem } from './solutionRouter.js';

const problemRouter = express.Router();

const getAllProblems = db.prepare("SELECT problemId, problem, username FROM problem INNER JOIN user ON problem.createdBy = user.userId;")
const getSpecificProblem = db.prepare("SELECT problem, username FROM problem INNER JOIN user ON problem.createdBy = user.userId WHERE problemId = ?;")
const addProblem = db.prepare("INSERT INTO problem(problem, createdBy) VALUES ( ?, ? );")
/**
 * Transaction that deletes problem's dependants and the problem itself
 */
const deleteProblem = db.transaction((problemId) => {
    const deleteProblemFromTable = db.prepare("DELETE FROM problem WHERE problemId = ?;")
    const solutions = getAllSolutionOnProblem.all(problemId);
    solutions.forEach(solution => deleteSolution(solution.solutionId));

    deleteProblemFromTable.run(problemId);
})

problemRouter.param("id", validateIdParam)

// get all problems
problemRouter.get("/", (req, res) => {
    const problems = getAllProblems.all()
    const problems_solutions = problems.map((problem) => ({
        problemId: problem.problemId,
        problem: problem.problem,
        createdBy: problem.username,
        solutions: getAllSolutionOnProblem.all(problem.problemId).map((solution) => createSolutionObject(solution)),
    }))
    res.status(200).json(problems_solutions);
})

// get specific post
problemRouter.get("/:id", (req, res) => {
    const problem = getSpecificProblem.get(req.params.id);

    // If the queried problem couldn't be fetched
    if(!problem){
        res.status(400).send("The problem with id: " + req.params.id + " doesn't exist.")
        return;
    }

    res.status(200).json(problem);
})

// post another problem
problemRouter.post("/add", (req, res) => {
    // Check if user has permissions to do so
    if(!req.userData.canCreateProblems && !req.userData.isAdmin){
        res.status(403).send("Cannot post");
        return;
    }

    // Check if the request has a problem to post
    if(!req.body.problem){
        res.status(400).send("Where da post?");
        return;
    }

    try{
        const info = addProblem.run(req.body.problem, req.userData.userId);

        res.status(200).json({
            problemId: info.lastInsertRowid,
            problem: req.body.problem,
            username: req.userData.username
        })
    }
    catch(err){
        switch (err.code){
            case "SQLITE_CONSTRAINT_UNIQUE":
                res.status(400).send("This problem already exists");
                break;
            default:
                console.log(err);
                res.status(500).send("server error");
        }
    }
})

// delete post
problemRouter.delete("/delete/:id", (req, res) => {
    const problem = getSpecificProblem.get(req.params.id);

    // Check if user has permissions to do so
    if(!req.userData.isAdmin && problem.username != req.userData.username){
        res.status(403).send("Cannot delete");
        return;
    }

    try{
        deleteProblem(req.params.id);
        res.status(200).send("Successfully ignored problem!");
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})


export default problemRouter;