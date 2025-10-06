// import { createSlice } from "@reduxjs/toolkit";
// import { loginUserThunk } from "./userThunk";

// const initialState = {
//     isAuthenticated : false,
//     screenLoading:false,
// }

// export const userSlice = createSlice({
//     name:"user",
//     initialState,
//     reducers:{
//         // login:(e)=>{console.log("Hello login")}

//     },
//     extraReducers:(builder)=>{

//         builder.addCase(loginUserThunk.pending,(state,action)=>{
//             console.log("Pending")
//         })

//         builder.addCase(loginUserThunk.fulfilled,(state,action)=>{
//             console.log("Fulfilled")
//         })

//         builder.addCase(loginUserThunk.rejected,(state,action)=>{
//             console.log("Rejected")
//         })
        
//     }
// })

// // export const{login} = userSlice.actions
// // export const{loginUserThunk} = userSlice.actions

// export default userSlice.reducer