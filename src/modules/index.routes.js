import express from "express";
import cors from "cors";
import morgan from "morgan";
import { globalErrorHandling } from "../services/errorHandler.js";
import connectDB from "../../DB/connection.js";
import cloudinary from "../services/cloud.js"
import {upload} from "../services/multer.js";
import fs from 'fs'; 
import router from "./ex-prod/ex.prod.routes.js";

export const appRouter = function(app){
    //cors
    app.use(cors({}))

    //middlewares built in express.json , urlecoded  , cors
    app.use(express.json())
    app.use(express.urlencoded({extended:false}))


    //morgan
    if (process.env.MOOD === 'DEV') {
        app.use(morgan("dev"))
    } else {
        app.use(morgan("combined"))
    }

    const baseUrl = process.env.BASEURL


    //part 2
    app.use(`${baseUrl}/auth`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/users`,(req,res)=>res.send("hello"))
    //part 1
    app.use(`${baseUrl}/categories`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/subcategories`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/brands`,(req,res)=>res.send("hello"))

    //part 3
    app.use(`${baseUrl}/products`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/reviews`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/carts`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/coupons`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/stores`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/sellers`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/offers`,(req,res)=>res.send("hello"))
    app.use(`${baseUrl}/test`,router)


    app.use('*', (req, res, next) => {
        res.status(404).send({
            status: 404,
            message: "Invalid Route. Please check the URL or the HTTP method."
          });
    })


    //global err handler || err recived in next 
    app.use(globalErrorHandling);


    connectDB()
}