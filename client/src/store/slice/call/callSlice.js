// client/src/store/slice/call/callSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incomingCall: null,   // { fromUserId, fromUserFullName, offer }
  callActive: false,
  callRole: null,       // "caller" or "callee"
  incomingGroupCall: null, // { from, fromUserFullName, offer, groupId }
  groupCallActive: false,
  groupCallRole: null, // "initiator" or "participant"
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setIncomingCall(state, action) {
      state.incomingCall = action.payload;
    },
    clearIncomingCall(state) {
      state.incomingCall = null;
    },

    setCallActive(state, action) {
      state.callActive = action.payload;
    },

    setCallRole(state, action) {
      state.callRole = action.payload;
    },

    resetCallState(state) {
      state.incomingCall = null;
      state.callActive = false;
      state.callRole = null;
    },

    setIncomingGroupCall(state, action) {
      state.incomingGroupCall = action.payload;
    },

    clearIncomingGroupCall(state) {
      state.incomingGroupCall = null;
    },

    setGroupCallActive(state, action) {
      state.groupCallActive = action.payload;
    },

    setGroupCallRole(state, action) {
      state.groupCallRole = action.payload;
    },

    resetGroupCallState(state) {
      state.incomingGroupCall = null;
      state.groupCallActive = false;
      state.groupCallRole = null;
    }
  }
});

export const {
  setIncomingCall,
  clearIncomingCall,
  setCallActive,
  setCallRole,
  resetCallState,
  setIncomingGroupCall,
  clearIncomingGroupCall,
  setGroupCallActive,
  setGroupCallRole,
  resetGroupCallState
} = callSlice.actions;

export default callSlice.reducer;
