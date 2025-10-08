import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../../components/utilities/axiosInstance";

export const loginUserThunk = createAsyncThunk(
  "users/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Log the payload you actually received
      console.log("Sending login data:", { username, password });

      // Send request using payload
      const response = await axiosInstance.post("/user/login", {
        userName: username, // match backend field
        password: password
      });
      toast.success("Login successfull")
      console.log("Response:", response.data);
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

export const registerUserThunk = createAsyncThunk(
  "users/register",
  async ({ fullName, username, password , gender}, { rejectWithValue }) => {
    try {
      // Log the payload you actually received
      console.log("Sending login data:", {fullName, username, password , gender});

      // Send request using payload
      const response = await axiosInstance.post("/user/register", {
        fullName:fullName,
        userName: username, // match backend field
        password: password,
        gender
      });
      toast.success("Registeration successfull")
      console.log("Response:", response.data);
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

export const logoutUserThunk = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Send request using payload
      const response = await axiosInstance.post("/user/logout");
      toast.success("Logout successfull")
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


export const getUserProfileThunk = createAsyncThunk(
  "users/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      // Log the payload you actually received
      // console.log("Sending login data:", { username, password });

      // Send request using payload
      const response = await axiosInstance.get("/user/get-profile");
      
      // console.log("Response:", response.data);
      return response.data;
    } 
    catch (e) {
      console.log("Error response:", e?.response?.data);
      const errorOutput = e?.response?.data?.errMessage || "Something went wrong";
      // toast.error(errorOutput);
      return rejectWithValue(errorOutput);
    }
  }
);

export const getOtherUsersThunk = createAsyncThunk(
  "users/getOtherUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-All-Users");
      return response.data;
    } 
    catch (e) {
      console.log("Error response:", e?.response?.data);
      const errorOutput = e?.response?.data?.errMessage || "Something went wrong";
      return rejectWithValue(errorOutput);
    }
  }
);


