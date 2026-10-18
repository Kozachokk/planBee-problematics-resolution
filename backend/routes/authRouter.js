import express from 'express';
import db from '../db.js';
import { generateJWTokens } from '../middleware/authentication.js';
import jwt from 'jsonwebtoken'

const sevenDaysInMs = 604800000;
const hourInMs = 3600000;

const authRouter = express.Router();
const getUser = db.prepare("SELECT userId FROM user WHERE username = ? AND password = ?;");

authRouter.post('/login', (req, res) => {
    //Check if credentials are valid
    const user = getUser.get(req.body.username, req.body.password);
    if(!user){
        res.status(400).send("Invalid username or password");
        return;
    }

    const { refreshToken, accessToken } = generateJWTokens(user.userId);

    // Set cookies
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + sevenDaysInMs)
    })
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: new Date(Date.now() + hourInMs)
    })

    res.status(200).send("Authenticated :thumbs_up:");
})

// TODO implement refresh token rotation
authRouter.get('/refresh', (req, res) => {
    try{
        const payload = jwt.verify(req.cookies.refreshToken, process.env.JWT_SECRET);
        if(!payload.userId){
            res.status(401).send("Not logged in");
            return;
        }
        
        const {refreshToken, accessToken} = generateJWTokens(payload.userId);

        // Set new cookies
        // New refresh token for future token rotation security measure(not implemented)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(Date.now() + sevenDaysInMs)
        })
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(Date.now() + hourInMs)
        })

        res.status(200).send("Refreshed :thumbs_up:");

    } catch(err){
        switch (err.name){
            case "JsonWebTokenError":
                res.status(401).send("Not logged in");
                break;
            case "TokenExpiredError":
                res.status(401).send("Not logged in");
                break;
            default:
                console.log(err);
                res.status(500).send("Server Error");
        }
    }

})

export default authRouter;