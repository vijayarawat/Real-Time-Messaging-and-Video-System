import mongoose from "mongoose";
import User from "./userModel.js";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        default:null
    },
    message:{
        type:String,
        required:true
    },
    messageType:{
        type:String,
        enum:['direct','group'],
        default:'direct'
    }
},{timestamps:true})

const Message = mongoose.model('Message', messageSchema)
export default Message