import express from 'express';
import { authenticateUser } from '../db.js';
const loginRouter = express.Router();

loginRouter.post('/', (req, res) => {
    //login user
    console.log(req.body)
    console.log(req.body.password)
    const id = validatePassword(req.body.username, req.body.password);
    console.log(id);
})

function validatePassword(username, password){
    const id = authenticateUser(username, password);
    console.log(id);
}

export default loginRouter;