import dotenv from 'dotenv'
dotenv.config()

import express from "express"
import cookieParser from "cookie-parser";
import router from "./routes/user.route.js"
import messageRouter from "./routes/messageRoute.js"; 
import cors from 'cors'
import { connectDb } from "./db/connectionDb.js"
import {app,io,server} from "./socket/socket.js"
// const app = express()

connectDb();
const PORT=process.env.PORT
app.use(express.json())

app.use(cors({
    origin :[process.env.CLIENT_URL],credentials:true
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


//middlewares
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
app.use(errorMiddleware)


server.listen(PORT,()=>{
console.log(`Listening on PORT ${PORT}`)
})