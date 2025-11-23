// import dotenv from 'dotenv'
// dotenv.config()

// import {Server} from 'socket.io'
// import http from 'http';
// import express from "express";
// import { Socket } from 'dgram';


// const app = express()

// const server = http.createServer(app);
// console.log(process.env.CLIENT_URL)
// const io = new  Server(server, {
//     // cors:{origin:process.env.CLIENT_URL}
//     cors:{origin:["http://localhost:5173",
//     "http://localhost:5174"]}
// })
// const userSocketMap={
//     //userId: socketId
// }
// io.on("connection",(socket)=>{
//     // console.log("Socket ID")
//     // console.log(socket.id)
//     const userId = socket.handshake.query.userId;
//     if(!userId)
//         return
//     userSocketMap[userId] = socket.id
//     io.emit("onlineUsers", Object.keys(userSocketMap))
//     console.log("Emitting online users:", Object.keys(userSocketMap))

// //     socket.on("disconnect",()=>{
// //         delete userSocketMap[userId];
// //         io.emit("onlineUsers", Object.keys(userSocketMap))    
// //     })
// // })

// // const getSocketId  = (userId)=>{
// //     return userSocketMap[userId]
// // }
// // export {app,io,server,getSocketId}


// // import dotenv from 'dotenv'
// // dotenv.config()

// // import { Server } from 'socket.io'
// // import http from 'http'
// // import express from "express"

// // const app = express()
// // const server = http.createServer(app)

// // console.log("Frontend allowed CORS:", process.env.CLIENT_URL)

// // const io = new Server(server, {
// //   cors: {
// //     origin: process.env.CLIENT_URL,
// //     credentials: true
// //   }
// // })

// // // Store: userId → socketId
// // const userSocketMap = {}

// // // =====================
// // // SOCKET MAIN CONNECTION
// // // =====================
// // io.on("connection", (socket) => {
// //   const userId = socket.handshake.query.userId

// //   if (!userId) return

// //   userSocketMap[userId] = socket.id

// //   io.emit("onlineUsers", Object.keys(userSocketMap))
// //   console.log("User connected:", userId)
// //   console.log("Online Users:", Object.keys(userSocketMap))


//   // ========================================================
//   // 🔥🔥🔥 WEBRTC SIGNALING EVENTS (Add these)
//   // ========================================================

//   //
//   // 1️⃣ Caller → Server → Receiver (Offer)
//   //
//   socket.on("call-user", ({ targetUserId, offer }) => {
//     const targetSocketId = userSocketMap[targetUserId]
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("incoming-call", {
//         from: userId,
//         offer
//       })
//       console.log(`Call offer sent from ${userId} → ${targetUserId}`)
//     }
//   })

//   //
//   // 2️⃣ Receiver → Server → Caller (Answer)
//   //
//   socket.on("answer-call", ({ targetUserId, answer }) => {
//     const targetSocketId = userSocketMap[targetUserId]
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("call-accepted", {
//         from: userId,
//         answer
//       })
//       console.log(`Call answer sent from ${userId} → ${targetUserId}`)
//     }
//   })

//   //
//   // 3️⃣ Exchange ICE candidates (both sides)
//   //
//   socket.on("ice-candidate", ({ targetUserId, candidate }) => {
//     const targetSocketId = userSocketMap[targetUserId]
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("ice-candidate", {
//         from: userId,
//         candidate
//       })
//     }
//   })

//   //
//   // 4️⃣ End / reject call
//   //
//   socket.on("end-call", ({ targetUserId }) => {
//     const targetSocketId = userSocketMap[targetUserId]
//     if (targetSocketId) {
//       io.to(targetSocketId).emit("call-ended", {
//         from: userId
//       })
//     }
//   })

//   // =================
//   // DISCONNECT
//   // =================
//   socket.on("disconnect", () => {
//     delete userSocketMap[userId]
//     io.emit("onlineUsers", Object.keys(userSocketMap))
//     console.log("User disconnected:", userId)
//   })
// })

// const getSocketId = (userId) => {
//   return userSocketMap[userId]
// }

// export { app, io, server, getSocketId }



// server/socket.js  (or wherever your socket logic lives)
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map(s => s.trim());

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  }
});

// store userId => socketId
const userSocketMap = {};



io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  console.log("socket connected, id:", socket.id, "userId:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(userSocketMap));
  }

  // caller sends offer -> forward to callee as incoming-call
  socket.on("call-user", (payload) => {
    const { targetUserId, offer, fromUserId, fromUserFullName } = payload || {};
    console.log("call-user from", fromUserId, "to", targetUserId);
    const targetSocket = userSocketMap[targetUserId];
    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", { from: fromUserId, offer, fromUserFullName });
    } else {
      console.warn("target not online:", targetUserId);
      socket.emit("user-offline", { targetUserId });
    }
  });

  // callee sends answer -> forward to caller as call-accepted
  socket.on("answer-call", (payload) => {
    const { targetUserId, answer } = payload || {};
    console.log("answer-call forwarding to", targetUserId);
    const targetSocket = userSocketMap[targetUserId];
    if (targetSocket) {
      io.to(targetSocket).emit("call-accepted", { from: userId, answer });
    }
  });

  // ICE candidates both ways
  socket.on("ice-candidate", (payload) => {
    const { targetUserId, candidate } = payload || {};
    // debug log
    console.log("ice-candidate from", userId, "to", targetUserId, candidate ? "candidate present" : "no candidate");
    const targetSocket = userSocketMap[targetUserId];
    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { from: userId, candidate });
    }
  });

  // // end call (user sent)
  // socket.on("end-call", ({ targetUserId }) => {
  //   console.log("end-call from", userId, "to", targetUserId);
  //   const targetSocket = userSocketMap[targetUserId];
  //   if (targetSocket) {
  //     io.to(targetSocket).emit("call-ended", { from: userId });
  //   }
  // });


  // end call (user sent)
socket.on("end-call", ({ targetUserId }) => {
  console.log("end-call from", userId, "to", targetUserId);
  const targetSocket = userSocketMap[targetUserId];
  if (targetSocket) {
    io.to(targetSocket).emit("call-ended", { from: userId });
    io.to(targetSocket).emit("call-rejected", { from: userId });
  }
});

  // ========================================================
  // GROUP CALL EVENTS
  // ========================================================

  // Initiate group call
  socket.on("initiate-group-call", ({ groupId, offer, fromUserId, fromUserFullName }) => {
    console.log(`Group call initiated in ${groupId} by ${fromUserId}`);
    io.emit("incoming-group-call", { groupId, offer, from: fromUserId, fromUserFullName });
  });

  // Accept group call
  socket.on("accept-group-call", ({ groupId, answer, fromUserId }) => {
    console.log(`User ${userId} accepted group call in ${groupId}`);
    // Notify the initiator that someone accepted
    io.emit("group-call-accepted", { groupId, userId });
    // Notify all users in the group that the call is active
    io.to(groupId).emit("user-joined-group-call", { userId, answer, fromUserId });
  });

  // Group call ICE candidate
  socket.on("group-ice-candidate", ({ groupId, candidate }) => {
    console.log(`Group ICE candidate from ${userId} in ${groupId}`);
    socket.broadcast.emit("group-ice-candidate", { from: userId, candidate, groupId });
  });

  // End group call
  socket.on("end-group-call", ({ groupId }) => {
    console.log(`Group call ended in ${groupId} by ${userId}`);
    io.to(groupId).emit("group-call-ended", { from: userId, groupId });
  });

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
    console.log("socket disconnected", socket.id, "userId:", userId);
  });



});

  const getSocketId = (userId) => {
  return userSocketMap[userId]
}


export { app, server, io,getSocketId };

