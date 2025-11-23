import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../components/utilities/axiosInstance";
import toast from "react-hot-toast";

export const createGroupThunk = createAsyncThunk(
    "group/createGroup",
    async ({ groupName, description, memberIds }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/group/create", {
                groupName,
                description,
                memberIds
            });
            toast.success("Group created successfully");
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to create group";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

export const getUserGroupsThunk = createAsyncThunk(
    "group/getUserGroups",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/group/user-groups");
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to fetch groups";
            return rejectWithValue(errorOutput);
        }
    }
);

export const getGroupMessagesThunk = createAsyncThunk(
    "group/getGroupMessages",
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/group/${groupId}/messages`);
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to fetch messages";
            return rejectWithValue(errorOutput);
        }
    }
);

export const addGroupMessageThunk = createAsyncThunk(
    "group/addGroupMessage",
    async ({ groupId, message }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/message/send-group-message", {
                groupId,
                message
            });
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to send message";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

export const addMemberToGroupThunk = createAsyncThunk(
    "group/addMember",
    async ({ groupId, memberId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/group/add-member", {
                groupId,
                memberId
            });
            toast.success("Member added successfully");
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to add member";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

export const removeMemberFromGroupThunk = createAsyncThunk(
    "group/removeMember",
    async ({ groupId, memberId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/group/remove-member", {
                groupId,
                memberId
            });
            toast.success("Member removed successfully");
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to remove member";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

export const deleteGroupThunk = createAsyncThunk(
    "group/deleteGroup",
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/group/delete/${groupId}`);
            toast.success("Group deleted successfully");
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to delete group";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

export const updateGroupThunk = createAsyncThunk(
    "group/updateGroup",
    async ({ groupId, groupName, description }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/group/update/${groupId}`, {
                groupName,
                description
            });
            toast.success("Group updated successfully");
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to update group";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);

export const joinGroupByCodeThunk = createAsyncThunk(
    "group/joinByCode",
    async (joinCode, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/group/join-by-code", {
                joinCode
            });
            toast.success("Successfully joined the group!");
            return response.data;
        } catch (e) {
            const errorOutput = e?.response?.data?.errMessage || "Failed to join group";
            toast.error(errorOutput);
            return rejectWithValue(errorOutput);
        }
    }
);
