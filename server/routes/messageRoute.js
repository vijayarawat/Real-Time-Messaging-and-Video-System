import express from "express"
import { isAuthenticated } from "../middlewares/authMiddleware.js"
import { getMessage, sendMessage, sendGroupMessage } from "../controllers/messageController.js"

const messageRouter = express.Router()

messageRouter.post('/send/:recieverId',isAuthenticated,sendMessage)
messageRouter.get('/get-message/:otherParticipantId',isAuthenticated,getMessage)
messageRouter.post('/send-group-message',isAuthenticated,sendGroupMessage)

export default messageRouter
