import dotenv from 'dotenv'
dotenv.config()

import express from "express"
import cookieParser from "cookie-parser";
import router from "./routes/user.route.js"
import messageRouter from "./routes/messageRoute.js";
import groupRouter from "./routes/groupRoute.js";
import cors from 'cors'
import { connectDb } from "./db/connectionDb.js"
import {app,io,server} from "./socket/socket.js"
// const app = express()

connectDb();
const PORT=process.env.PORT
app.use(express.json())

const allowedOrigins = process.env.CLIENT_URL.split(",");



app.use(cors({
    origin :allowedOrigins,
            credentials:true
}))
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log("Body:", req.body);
//   console.log("Headers:", req.headers);
//   next();
// });


// routes
app.use('/api/v1/user',router)
app.use('/api/v1/message',messageRouter)
app.use('/api/v1/group',groupRouter)


//middlewares
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
app.use(errorMiddleware)


server.listen(PORT,()=>{
console.log(`Listening on PORT ${PORT}`)
})