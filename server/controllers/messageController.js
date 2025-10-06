import Message  from "../models/messageModel.js"
import Conversation from "../models/conversationModel.js"
import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";


export const sendMessage = asyncHandler (async (req,res,next)=>{
           
   const senderId = req.user.id
   const recieverId = req.params.recieverId
   const message = req.body.message
    console.log(senderId, recieverId,message)

   if(!senderId || !recieverId || !message)
        return next(new errorHandler("All fields are required",400))

    let conversation = await Conversation.findOne({
        participants: {$all:[senderId,recieverId]}
    })

    if(!conversation){
        conversation = await Conversation.create({
            participants:[senderId, recieverId]
        })
    }

    console.log(conversation)

    const newMessage = await Message.create({
        senderId,recieverId,message
    })
    console.log("new message", newMessage)

    if(newMessage){
        conversation.messages.push(newMessage._id);
        await conversation.save();
    }

    res.status(200)
        .json({
            success:true,
            responseData:newMessage})
   
})


export const getMessage = asyncHandler (async (req,res,next)=>{
           
   const myID = req.user.id
   const otherParticipantId = req.params.otherParticipantId
//    const message = req.body.message
    console.log(myID, otherParticipantId)

   if(!myID || !otherParticipantId )
        return next(new errorHandler("All fields are required",400))

    let conversation = await Conversation.findOne({
        participants: {$all:[myID,otherParticipantId]}
    }).populate("messages")

    if(!conversation){
        conversation = await Conversation.create({
            participants:[myID, otherParticipantId]
        })
    }

    // console.log(conversation)

    res.status(200)
        .json({
            success:true,
            responseData:conversation})
   
})