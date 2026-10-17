
import express from 'express';
const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
    res.status(418).send("I don't know what to do, i'm just a teapot");
})

export default rootRouter;