
import express from 'express';
const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
    res.send("<h1>Hiiiii</h1>");
})

export default rootRouter;