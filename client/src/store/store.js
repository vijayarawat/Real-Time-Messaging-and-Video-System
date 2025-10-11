import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user/userSlice.js";
import messageReducer from './slice/message/messageSlice.js'
import socketReducer from "./slice/socket/socketSlice.js"
const store = configureStore({
  reducer: {
    user: userSlice,
    messageReducer,
    socketReducer
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore the socket instance in your socket slice
          ignoredPaths: ["socketReducer.socket"],
        },
      }),
});

export default store;