import mongoose,{mongo} from "mongoose";

export const connectDb=async()=>{
    const MONGODB_URL= process.env.MONGODB_URL
    const instance=  await mongoose.connect(MONGODB_URL)
    console.log(`Mongo DB connected:${instance.connection.host}`)
}