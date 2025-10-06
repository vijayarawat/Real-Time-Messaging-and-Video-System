import express from "express"
import { isAuthenticated } from "../middlewares/authMiddleware.js"
import { getMessage, sendMessage } from "../controllers/messageController.js"

const messageRouter = express.Router()

messageRouter.post('/send/:recieverId',isAuthenticated,sendMessage)
messageRouter.get('/get-message/:otherParticipantId',isAuthenticated,getMessage)

export default messageRouter
