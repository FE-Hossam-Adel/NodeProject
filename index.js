import express from "express";
import path from "path";
import { fileURLToPath } from 'url'
import dotenv from "dotenv";
import { appRouter } from "./src/modules/index.routes.js";



const app = express();

//import.meta.url get current abs path file as url file protocol
//fileURLToPath(import.meta.url)) => get abs path as file without protocols
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, './configs/.env')});

const port = process.env.PORT || 8001;




appRouter(app);


app.listen(port , ()=>{console.log(`server runing in : http://localhost:${port}/`)})