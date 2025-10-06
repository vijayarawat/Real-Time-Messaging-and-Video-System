import mongoose from "mongoose";
import User from "./userModel.js";
import Message from "./messageModel.js";
const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }
    ]

},{timestamps:true})

const Conversation = mongoose.model('Conversation', conversationSchema)
export default Conversation