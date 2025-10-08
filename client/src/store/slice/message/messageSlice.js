import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk,getOtherUsersThunk,logoutUserThunk,getUserProfileThunk,registerUserThunk } from "./userThunk.js";

const initialState = {
    isAuthenticated : false,
    screenLoading:true,
    otherUsers:null,
    selectedUser:null,
    userProfile:null,
    buttonLoading:false
    
}

export const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        login:(e)=>{},
        setSelectedUsers:(state,action)=>{
            state.selectedUser = action.payload
        }

    },
    extraReducers:(builder)=>{
        //Login Functionality
        builder.addCase(loginUserThunk.pending,(state,action)=>{
            // console.log("Pending")
            state.buttonLoading = true
        })

        builder.addCase(loginUserThunk.fulfilled,(state,action)=>{
            // console.log("Fulfilled")
            state.userProfile = action.payload?.responseData
            // console.log(state.userProfile)
            state.buttonLoading = false
            state.isAuthenticated = true
        })

        builder.addCase(loginUserThunk.rejected,(state,action)=>{
            // console.log("Rejected")
            state.buttonLoading = true
        })


        //Register Functionality
        builder.addCase(registerUserThunk.pending,(state,action)=>{
            // console.log("Pending")
            state.buttonLoading = true
        })

        builder.addCase(registerUserThunk.fulfilled,(state,action)=>{
            // console.log("Fulfilled")
            state.userProfile = action.payload?.responseData
            // console.log(state.userProfile)
            state.isAuthenticated = true

            state.buttonLoading = false
        })

        builder.addCase(registerUserThunk.rejected,(state,action)=>{
            // console.log("Rejected")
            state.buttonLoading = true
        })

        //Logout successfull 
        builder.addCase(logoutUserThunk.pending,(state,action)=>{
            // console.log("Pending")
            state.buttonLoading = true
        })

        builder.addCase(logoutUserThunk.fulfilled,(state,action)=>{
            // console.log("Fulfilled")
            // console.log(state.userProfile)
            state.buttonLoading = false;
            state.isAuthenticated = false;
            state.userProfile = false;

        })

        builder.addCase(logoutUserThunk.rejected,(state,action)=>{
            // console.log("Rejected")
            state.screenLoading = true
        })

        //Get User profile successfull 
        builder.addCase(getUserProfileThunk.pending,(state,action)=>{
            // console.log("Pending")
        })

        builder.addCase(getUserProfileThunk.fulfilled,(state,action)=>{
            // console.log("Fulfilled")
            // console.log(state.userProfile)
            state.screenLoading = false;
            state.isAuthenticated = true;
            // state.userProfile = false;
            console.log(action.payload)

        })

        builder.addCase(getUserProfileThunk.rejected,(state,action)=>{
            // console.log("Rejected")
            state.screenLoading = true
        })

        //Get other Users successfull 
        builder.addCase(getOtherUsersThunk.pending,(state,action)=>{
            // console.log("Pending")
        })

        builder.addCase(getOtherUsersThunk.fulfilled,(state,action)=>{
            // console.log("Fulfilled")
            // console.log(state.userProfile)
            state.screenLoading = false;
            state.otherUsers = action.payload?.responseData;
            // state.userProfile = false;
            // console.log(action.payload)

        })

        builder.addCase(getOtherUsersThunk.rejected,(state,action)=>{
            // console.log("Rejected")
            state.screenLoading = true
        })
        
    }
})
//getOtherUsersThunk
export const{login, setSelectedUsers} = userSlice.actions
// export const{loginUserThunk}  = userSlice.actions

export default userSlice.reducer