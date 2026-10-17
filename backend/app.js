import express from 'express';
import "dotenv/config"
import rootRouter from './routes/rootRouter.js';
import authRouter from './routes/authRouter.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { authenticate } from './middleware/authentication.js';
import problemRouter from './routes/problemRouter.js';
import solutionRouter from './routes/solutionRouter.js';

const logger = (req, res, next) => {
  console.log(new Date().toUTCString() + " ~ " + req.method + ": " + req.path)
  next();
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use("/auth", authRouter)
app.use(authenticate)
app.use("/", rootRouter)
app.use("/problem", problemRouter)
app.use("/solution", solutionRouter)

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});