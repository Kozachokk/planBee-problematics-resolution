import express from 'express'
import db from '../db.js'
import { validateIdParam, validateIntegerId } from '../middleware/dataValidation.js';

const solutionRouter = express.Router();
solutionRouter.param("id", validateIdParam)

export const getAllSolutionOnProblem = db.prepare("SELECT solutionId, solution, proposedBy FROM solution WHERE problemId = ?;")
const getSolution = db.prepare("SELECT solution, proposedBy FROM solution WHERE solutionId = ?;")
const getFeedbackOnSolution = db.prepare("SELECT username, opinion FROM solution_user INNER JOIN user ON solution_user.userId = user.userId WHERE solutionId = ?;")
const addSolution = db.prepare("INSERT INTO solution(solution, proposedBy, problemId) VALUES ( ?, ?, ? );")
const addReaction = db.prepare("INSERT INTO solution_user(solutionId, userId, opinion) VALUES ( ?, ?, ? );")

export const deleteSolution = db.transaction((solution) => {
    const deleteSolutionFromSolution_UserTable = db.prepare("DELETE FROM solution_user WHERE solutionId = ?;")
    const deleteSolutionFromTable = db.prepare("DELETE FROM solution WHERE solutionId = ?;")

    deleteSolutionFromTable.run(solution)
    deleteSolutionFromSolution_UserTable.run(solution)
})


function createSolutionObject(solution){
    // Get every reaction on the solution
    const solutionFeedback = getFeedbackOnSolution.all(solution.solutionId);

    // Get a list of all user that approve/disapprove solution
    const approvedBy = solutionFeedback.filter(userFeedback => userFeedback.opinion == 1).map(user => user.username)
    const disapprovedBy = solutionFeedback.filter(userFeedback => userFeedback.opinion == -1).map(user => user.username)

    // Construct the final solution object
    return {
        solutionId: solution.solutionId,
        proposedBy: solution.proposedBy,
        solution: solution.solution,
        approvedBy: approvedBy,
        disapprovedBy: disapprovedBy
    }
}
// TODO TEST IT
// Get all solutions of a problem
solutionRouter.get("/", (req, res) => {
    if(!req.query.problemId){
        res.status(400).send("Please provide a problemId to which fetch the solutions to.");
        return;
    }
    if(validateIntegerId(req.query.problemId)){
        res.status(400).send("Invalid Id");
        return;
    }

    // Gets all the proposed solution for a given problemId
    const allProposedSolutions = getAllSolutionOnProblem.all(req.query.problemId)

    // Constructs 
    const problemFeedback = allProposedSolutions.map(solution => createSolutionObject(solution))
    res.status(200).json(problemFeedback);
})

// Get specific solution
solutionRouter.get("/:id", (req, res) => {
    const solution = getSolution.get(req.params.id);

    if(!solution){
        res.status(400).send("Invalid Id");
        return;
    }

    res.status(200).json(solution);
})

// Post a solution
solutionRouter.post("/add", (req, res) => {
    if(!req.body.problemId || !req.body.solution){
        res.status(400).send("Please do provide a solution to post");
        return;
    }

    const info = addSolution.run(req.body.solution, req.userData.username, req.body.problemId)

    return {
        solutionId: info.lastInsertRowid,
        proposedBy: req.userData.username,
        solution: req.body.solution,
        approvedBy: [],
        disapprovedBy: []
    }
})

// Delete solution
solutionRouter.delete("/:id", (req, res) => {
    const solution = getSolution.get(req.params.id)

    if(!req.userData.isAdmin || solution.proposedBy != req.userData.username){
        res.status(403).send("Cannot delete");
        return;
    }

    try{
        deleteSolution(req.params.id);
        res.status(200).send("Successfully ignored yet another solution!");
    }
    catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})

// React to solution
solutionRouter.post("/reaction", (req, res) => {
    if(!req.body.solutionId || !req.body.reaction){
        res.status(400).send("Please do provide a solutionId and a reaction");
        return;
    }

    if(validateIdParam(req.body.solutionId) || [-1, 0, 1].includes(req.body.reaction)){
        res.status(400).send("Please do provide a valid solutionId and/or reaction");
        return;
    }

    try{
        addReaction.run(req.body.solutionId, req.userData.userId, req.body.reaction);
        res.send(200).send("Successfully reacted!");
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})




export default solutionRouter;