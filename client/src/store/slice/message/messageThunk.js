import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../../components/utilities/axiosInstance";

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ recieverId, message }, { rejectWithValue }) => {
    try {    
      // console.log("Sending login data:", { senderId, recieverId });
      const response = await axiosInstance.post(`/message/send/${recieverId}`,{message});
      
      // console.log("Response:", response.data);
      return response.data;
    } 
    catch (e) {
      console.log("Error response:", e?.response?.data);
      const errorOutput = e?.response?.data?.errMessage || "Something went wrong";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getMessageThunk = createAsyncThunk(
  "message/getMessage",
  async ({ recieverId }, { rejectWithValue }) => {
    try {

    //   console.log("Sending login data:", { senderId, recieverId });
      const response = await axiosInstance.get(`/message/get-message/${recieverId}`);
      
      // console.log("Response:", response.data);
      return response.data;
    } 
    catch (e) {
      console.log("Error response:", e?.response?.data);
      const errorOutput = e?.response?.data?.errMessage || "Something went wrong";
      toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);