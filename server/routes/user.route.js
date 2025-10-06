import {getProfile, login,logout,register} from "../controllers/user.controller.js"
import express from "express"
import { isAuthenticated } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/get-profile',isAuthenticated,getProfile)
router.post('/logout',isAuthenticated,logout)

export default router
