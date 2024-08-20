import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import appRouter from './routes/appRoutes'


import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', appRouter)

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.log(error));
export { app };
