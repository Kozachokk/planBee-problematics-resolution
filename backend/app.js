import express from 'express';
import "dotenv/config"
import rootRouter from './routes/rootRouter.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const logger = (req, res) => {
  console.log(Date.now() + "~" + req.method + ": " + req.route)
}

const app = express();
app.use(helmet);
app.use(cors);
app.use(express.json());
app.use(cookieParser);
app.use(logger);

app.use("/", rootRouter)

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});