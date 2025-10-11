import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client"

const initialState = {
    socket:null,
    onlineUsers:[]
}

export const socketSlice = createSlice({
    name:"socket",
    initialState,
    reducers:{
        initalizeSocket:(state,action)=>{
            const socket =  io (import.meta.env.VITE_DB_ORIGIN,{
                query:{
                    userId:action.payload
                }
            })
            // socket.on('connect',()=>{
            //     console.log("connected to the server")
            // })
            state.socket = socket;

            
        },
        setOnlineUsers : (state,action)=>{
            state.onlineUsers = action.payload
        }
    },
   
})

export const {initalizeSocket, setOnlineUsers} = socketSlice.actions
export default socketSlice.reducer