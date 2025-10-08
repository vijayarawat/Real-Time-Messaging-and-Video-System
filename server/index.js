import express from "express"
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import { connectDb } from "./db/connectionDb.js"
const app = express()

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

import router from "./routes/user.route.js"
import messageRouter from "./routes/messageRoute.js"; 
app.use('/api/v1/user',router)
app.use('/api/v1/message',messageRouter)


//middlewares
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
app.use(errorMiddleware)


app.listen(PORT,()=>{
console.log(`Listening on PORT ${PORT}`)
})