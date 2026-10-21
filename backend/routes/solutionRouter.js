import express from 'express'
import db from '../db.js'
import { validateIdParam, isIdValid } from '../middleware/dataValidation.js';

const solutionRouter = express.Router();
solutionRouter.param("id", validateIdParam)

export const getAllSolutionOnProblem = db.prepare("SELECT solutionId, solution, username FROM solution INNER JOIN user ON solution.proposedBy = user.userId WHERE problemId = ?;")
export const getSolution = db.prepare("SELECT solutionId, solution, username FROM solution INNER JOIN user ON solution.proposedBy = user.userId WHERE solutionId = ?;")
const getFeedbackOnSolution = db.prepare("SELECT username, opinion FROM solution_user INNER JOIN user ON solution_user.userId = user.userId WHERE solutionId = ?;")
const addSolution = db.prepare("INSERT INTO solution(solution, proposedBy, problemId) VALUES ( ?, ?, ? );")
const addReaction = db.prepare("INSERT INTO solution_user(solutionId, userId, opinion) VALUES ( ?, ?, ? );")
const getReaction = db.prepare("SELECT * FROM solution_user WHERE solutionId = ? AND userId = ?;")
const setReaction =db.prepare("UPDATE solution_user SET opinion = ? WHERE solutionId = ? AND userId = ?;")

export const deleteSolution = db.transaction((solution) => {
    const deleteSolutionFromSolution_UserTable = db.prepare("DELETE FROM solution_user WHERE solutionId = ?;")
    const deleteSolutionFromTable = db.prepare("DELETE FROM solution WHERE solutionId = ?;")

    deleteSolutionFromSolution_UserTable.run(solution)
    deleteSolutionFromTable.run(solution)
})

export function createSolutionObject(solution){
    // Get every reaction on the solution
    const solutionFeedback = getFeedbackOnSolution.all(solution.solutionId);

    // Get a list of all user that approve/disapprove solution
    const approvedBy = solutionFeedback.filter(userFeedback => userFeedback.opinion == 1).map(user => user.username)
    const disapprovedBy = solutionFeedback.filter(userFeedback => userFeedback.opinion == -1).map(user => user.username)

    // Construct the final solution object
    return {
        solutionId: solution.solutionId,
        proposedBy: solution.username,
        solution: solution.solution,
        approvedBy: approvedBy,
        disapprovedBy: disapprovedBy
    }
}

// Get specific solution
solutionRouter.get("/:id", (req, res) => {
    const solution = createSolutionObject(getSolution.get(req.params.id));

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

    const info = addSolution.run(req.body.solution, req.userData.userId, req.body.problemId)

    res.status(200).json({solutionId: info.lastInsertRowid})
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
    if(isIdValid(req.body.solutionId) || ![-1, 0, 1].includes(req.body.reaction)){
        res.status(400).send("Please do provide a valid solutionId and/or reaction");
        return;
    }

    try{
        const reaction = getReaction.get(req.body.solutionId, req.userData.userId)
        if(reaction){
            setReaction.run(req.body.reaction, req.body.solutionId, req.userData.userId)
        }
        else{
            addReaction.run(req.body.solutionId, req.userData.userId, req.body.reaction);
        }
        res.status(200).send("Successfully reacted!");
    }catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
})




export default solutionRouter;