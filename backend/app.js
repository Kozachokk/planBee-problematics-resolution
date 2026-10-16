import express from 'express';
import "dotenv/config"
import rootRouter from './routes/rootRouter.js';
import loginRouter from './routes/loginRouter.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const logger = (req, res, next) => {
  console.log(Date.now() + "~" + req.method + ": " + req.path)
  next();
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use("/", rootRouter)
app.use("/login", loginRouter)

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});