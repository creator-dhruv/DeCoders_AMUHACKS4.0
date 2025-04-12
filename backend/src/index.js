import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import dbconnect from "./utility/db-connection.js";


dotenv.config({
    path: "./.env"
})
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: "*" ,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

dbconnect()


app.listen(process.env.PORT || 3000,() => {
    console.log(`http://localhost:${process.env.PORT}`)
})

app.get("/", (req,res) => {
    res.send({
        message: "I am connected."
    })
})

// All Controllers import
import { googleLogin } from "./controllers/user.controller.js";
import { addCaller } from "./controllers/call-log.controller.js";
import { verifyUserJWT } from "./middlewares/auth.js";




// All Routes
app.post("/api/user/googleLogin",googleLogin)
app.post("/api/call/addCaller", verifyUserJWT, addCaller)




export {app}