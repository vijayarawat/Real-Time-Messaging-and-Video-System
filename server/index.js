import express from "express"
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
dotenv.config()

import { connectDb } from "./db/connectionDb.js"
const app = express()

connectDb();
const PORT=process.env.PORT
app.use(express.json())
app.use(cookieParser());
// routes
import router from "./routes/user.route.js"
app.use('/api/v1/user',router)

//middlewares
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
app.use(errorMiddleware)


app.listen(PORT,()=>{
console.log(`Listening on PORT ${PORT}`)
})