import jwt from 'jsonwebtoken';
import db from '../db.js';

export function authenticate(req, res, next){
    if(!req.cookies.accessToken){
        res.status(401).send("Not logged in");
    }

    try{
        const decoded = jwt.verify(req.cookies.accessToken, process.env.JWTSECRET, {complete: false});
        req.userData = {
            userId: decoded.userId,
            username: decoded.username,
            isAdmin: decoded.isAdmin,
            canCreateProblems: decoded.canCreateProblems
        }
        next();
    }
    catch(err){
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
}

/**
 * Generates JWT refresh and access tokens for a specific user
 * @param {number} userId - The user to which generate the jwt tokens
 * @returns object composed of refresh and access tokens
 */
export function generateJWTokens(userId){
    const getUserData = db.prepare("SELECT userId, username, isAdmin, canCreateProblems FROM user WHERE userId = ?;");
    const userData = getUserData.get(userId);

    const refreshPayload = {
        userId: userData.userId
    }

    const accessPayload = userData;

    //TODO do refresh token rotation
    const refreshToken = jwt.sign(refreshPayload, process.env.JWTSECRET, {
        expiresIn: "7d"
    });

    const accessToken = jwt.sign(accessPayload, process.env.JWTSECRET, {
        expiresIn: "1h"
    })

    return {refreshToken, accessToken}
}