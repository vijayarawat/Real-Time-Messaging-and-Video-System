import Message  from "../models/messageModel.js"
import Conversation from "../models/conversationModel.js"
import Group from "../models/groupModel.js"
import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";
import {io,getSocketId} from "../socket/socket.js"

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
        senderId,recieverId,message,messageType:'direct'
    })
    console.log("new message", newMessage)

    if(newMessage){
        conversation.messages.push(newMessage._id);
        await conversation.save();
    }

    const socketId = getSocketId(recieverId)
    io.to(socketId).emit("newMessage",newMessage)


    res.status(200)
        .json({
            success:true,
            responseData:newMessage})
   
})

export const sendGroupMessage = asyncHandler(async (req, res, next) => {
    const senderId = req.user.id;
    const { groupId, message } = req.body;

    if (!senderId || !groupId || !message) {
        return next(new errorHandler("All fields are required", 400));
    }

    const group = await Group.findById(groupId);
    
    if (!group) {
        return next(new errorHandler("Group not found", 404));
    }

    if (!group.members.includes(senderId)) {
        return next(new errorHandler("You are not a member of this group", 403));
    }

    const newMessage = await Message.create({
        senderId,
        groupId,
        message,
        messageType: 'group'
    });

    // Populate after creation
    const populatedMessage = await newMessage.populate('senderId', 'userName fullName avatar');

    if (populatedMessage) {
        group.messages.push(populatedMessage._id);
        await group.save();
    }

    // Emit message to all group members
    group.members.forEach(memberId => {
        const socketId = getSocketId(memberId.toString());
        if (socketId) {
            io.to(socketId).emit("newGroupMessage", populatedMessage);
        }
    });

    res.status(200).json({
        success: true,
        message: populatedMessage
    });
});



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