import { use } from "react";
import User  from "../models/userModel.js"
import { asyncHandler } from "../utilities/asyncHandlerUtility.js";
import { errorHandler } from "../utilities/errorHandlerUtility.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

export const register = asyncHandler (async (req,res,next)=>{
   
        const {fullName,userName,password,gender} = req.body;
        if(!fullName || !userName || !password || !gender){     
            return next(new errorHandler("All fields are required",400))
        }

        const user = await User.findOne({userName})
        const hashedPassword = await bcrypt.hash(password,10)

        if(user){
            return next(new errorHandler("User already exists",400))
        }
        const avatarType = gender==='male'?"boy":"girl"
        const avatar =`https://avatar.iran.liara.run/public/${avatarType}?username=${userName}`
        const newUser =  await User.create({ fullName,userName,password:hashedPassword,gender,avatar })
        
        const tokenData ={
            _id:newUser?._id
        }
        const token = jwt.sign(tokenData,process.env.JWT_SECRET,{ expiresIn: "1d"})
        
   
        res.status(200)
        .cookie("token",token,{
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES *24*20*20*1000
            ),
            httpOnly:true,
            secure:true,
            // secure:process.env.NODE_ENV === 'PRODUCTION',
            sameSite:"None"
        })
        .json({
            success:true,
            responseData:{
                newUser,token
            },
            message:"Registered Successfully"})
   
})
// -----------------------------without asyncHandler and errorHandler-----------------------------
// try catch likhna pdega multiple times and error bhi handle karna pdega
// export const register = (req,res)=>{
//     try{
//         const {fullName,userName,password,gender} = req.body;
//         if(!fullName || !userName || !password || !gender){
//             res.status(400).json({
//             success:false,
//             message:"Field value is missing"
//             })
//         res.send("Registered Successfully")
//         }
//     }
//     catch(e){
//         console.log(e)
//     }
// }

export const login = asyncHandler ( async (req,res,next)=>{
   
        const {userName,password} = req.body;
        // console.log("Login request body:", req.body);

        if(!userName || !password ){     
            return next(new errorHandler("Enter valid username and password",400))
        }

        const user = await User.findOne({userName})
        
        if(!user){
            return next(new errorHandler("Enter valid username and password",400))
        }
        
        const isValidPassword = await bcrypt.compare(password,user.password)

        if(!isValidPassword){
            return next(new errorHandler("Enter valid username and password",400))
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            // domain:process.env.CLIENT_URL,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        });

        res.status(200).json({
            success: true,
            responseData: user,
            message: "Login successful",
            token
        });
})

export const getProfile = asyncHandler ( async (req,res,next)=>{
   
        const userId = req.user.id;
        // console.log(userId)

        const profile = await User.findById(userId)

        res.status(200).json({
            success:true,
            responseData: profile
        })

})

export const logout = asyncHandler ( async (req,res,next)=>{   
        res.status(200)
        .cookie("token","",{
            expires:new Date(Date.now()),
            httpOnly:true,
        })
        .json({
            success:true,
            responseData:"Logged out successfully"
        })
})

export const getAllUsers = asyncHandler(async(req,res,next)=>{

    const otherUser = await User.find({_id:{$ne:req.user.id}})

    res.status(200).json({
        success:true,
        responseData:otherUser
    })
})