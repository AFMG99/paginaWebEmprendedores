import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import router from "./routes/Route.js";
import { getConnection } from "./conf/database.js";
dotenv.config()
const app = express()

app.use(cors());
app.use(express.json());
app.use('/', router);
app.listen(process.env.PORT, () => {
    getConnection()
    console.log(`Conectados a traves del puerto ${process.env.PORT}`)
});