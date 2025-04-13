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

app.get("/", async (req, res) => {
    // Send initial "Loading..." response
    res.write({
        message: "Loading... System check ho raha hai, thodi der ruk, bhai!"
    });

    // Simulate delay for dramatic effect (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Send the "hacked" prank with Meri Sakhi vibe
    res.json({
        message: "Haha, tera system toh hack ho gaya! 😜 Par chill, Meri Sakhi ne tujhe safe rakha hai!"
    });
});
// All Controllers import
import { googleLogin } from "./controllers/user.controller.js";
import { addCaller, deleteCaller, getCaller } from "./controllers/call-log.controller.js";
import { verifyUserJWT } from "./middlewares/auth.js";




// All Routes
app.post("/api/user/googleLogin",googleLogin)
app.post("/api/caller/add", verifyUserJWT, addCaller)
app.delete("/api/caller/delete", verifyUserJWT, deleteCaller)
app.get("/api/caller/get", verifyUserJWT, getCaller)






export {app}
