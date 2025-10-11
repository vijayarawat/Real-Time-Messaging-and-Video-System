import { createSlice } from "@reduxjs/toolkit";
import { sendMessageThunk ,getMessageThunk} from "./messageThunk";


const initialState = {
    buttonLoading:false,
    messages:[],
    screenLoading:false
}

export const messageSlice = createSlice({
    name:"message",
    initialState,
    reducers:{
        setNewMessage: (state, action) => {
      const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload];
    },
    },
    extraReducers:(builder)=>{
        //Send message Functionality
        builder.addCase(sendMessageThunk.pending,(state,action)=>{
            state.buttonLoading = true
        })

        builder.addCase(sendMessageThunk.fulfilled,(state,action)=>{
            state.buttonLoading = false

            const oldMessages = state.messages ?? [];
      state.messages = [...oldMessages, action.payload?.responseData];
            // const newMsg = action?.payload?.responseData?.message;
            // // console.log(newMsg)
            // state.messages = [...state.messages, newMsg];

            // console.log(action.payload)
        })

        builder.addCase(sendMessageThunk.rejected,(state,action)=>{
 
            state.buttonLoading = true
        })

        //get Messages
        builder.addCase(getMessageThunk.pending,(state,action)=>{
            state.buttonLoading = true
        })

        builder.addCase(getMessageThunk.fulfilled,(state,action)=>{
            state.buttonLoading = false
            // console.log(action.payload)

            state.messages = action?.payload?.responseData?.messages
        })

        builder.addCase(getMessageThunk.rejected,(state,action)=>{
 
            state.buttonLoading = true
        })

        
    }
})


export const {setNewMessage} = messageSlice.actions;
export default messageSlice.reducer