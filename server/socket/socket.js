import dotenv from 'dotenv'
dotenv.config()

import {Server} from 'socket.io'
import http from 'http';
import express from "express";
import { Socket } from 'dgram';


const app = express()

const server = http.createServer(app);
console.log(process.env.CLIENT_URL)
const io = new  Server(server, {
    cors:{origin:process.env.CLIENT_URL}
})
const userSocketMap={
    //userId: socketId
}
io.on("connection",(socket)=>{
    // console.log("Socket ID")
    // console.log(socket.id)
    const userId = socket.handshake.query.userId;
    if(!userId)
        return
    userSocketMap[userId] = socket.id
    io.emit("onlineUsers", Object.keys(userSocketMap))
    console.log("Emitting online users:", Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("onlineUsers", Object.keys(userSocketMap))    
    })
})

const getSocketId  = (userId)=>{
    return userSocketMap[userId]
}
export {app,io,server,getSocketId}