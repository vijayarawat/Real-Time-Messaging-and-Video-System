import { createSlice } from "@reduxjs/toolkit";
import { createGroupThunk, getUserGroupsThunk, addGroupMessageThunk, getGroupMessagesThunk } from "./groupThunk";

const initialState = {
    groups: [],
    selectedGroup: null,
    groupMessages: [],
    loading: false,
    error: null
};

export const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
            state.groupMessages = []; // Clear messages when switching groups
        },
        addGroupMessage: (state, action) => {
            state.groupMessages.push(action.payload);
        },
        resetGroupState: (state) => {
            state.selectedGroup = null;
            state.groupMessages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGroupThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(createGroupThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.groups.push(action.payload.group);
            })
            .addCase(createGroupThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserGroupsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserGroupsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload.groups;
            })
            .addCase(getUserGroupsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getGroupMessagesThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGroupMessagesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.groupMessages = action.payload.messages;
            })
            .addCase(getGroupMessagesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addGroupMessageThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(addGroupMessageThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.groupMessages.push(action.payload.message);
            })
            .addCase(addGroupMessageThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSelectedGroup, addGroupMessage, resetGroupState } = groupSlice.actions;
export default groupSlice.reducer;
