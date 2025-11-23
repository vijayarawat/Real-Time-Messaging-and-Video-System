import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setIncomingCall,
  resetCallState,
  setCallActive,
  setCallRole,
} from "../../store/slice/call/callSlice";

import { createPeerConnection, getLocalStream } from "../../utils/webrtc";

import IncomingCallPopup from "./IncomingCallPopup";
import VideoCallWindow from "./VideoCallWindow";
import User from "./user";
import Message from "./Message";
import SendMessage from "./sendMessage";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const socket = useSelector((s) => s.socketReducer.socket);

  const {messages} = useSelector((state)=>state.messageReducer)
  console.log(messages)

  const {selectedUser} = useSelector((state)=>state.user)
  // console.log("Selected User:", selectedUser);

  const {userProfile} = useSelector(state=>state.user)
  // console.log(userProfile)
  const { callActive } = useSelector(s => s.call);
  const pcRef = useRef(null);
  const targetRef = useRef(null); // store target user id safely

  
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);


  // wherever you get socket from redux (e.g., App.jsx useEffect)
  

  useEffect(() => {
    
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id, "handshake query:", socket.io?.opts?.query || socket.io?.uri);
    });
    socket.on("disconnect", () => console.log("Socket disconnected"));

    console.log("[socket] attaching listeners on client");

    socket.off("incoming-call").on("incoming-call", ({ from, offer, fromUserFullName }) => {
      console.log("[socket] incoming-call received from", from, "offer id:", offer?.sdp?.slice?.(0,50));
      dispatch(setIncomingCall({ fromUserId: from, fromUserFullName, offer }));
    });

    socket.off("call-rejected").on("call-rejected", ({ from }) => {
      console.log("[socket] call-rejected from", from);
      dispatch(resetCallState());
    });

    socket.off("call-accepted").on("call-accepted", async ({ from, answer }) => {
      console.log("[socket] call-accepted received from", from);
      const pc = pcRef.current;
      if (!pc) {
        console.warn("[socket] no pcRef to setRemoteDescription");
        return;
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("[webrtc] caller: setRemoteDescription(answer) done");
      } catch (err) {
        console.error("[webrtc] caller: setRemoteDescription(answer) error", err);
      }
    });

    socket.off("ice-candidate").on("ice-candidate", async ({ from, candidate }) => {
      console.log("[socket] ice-candidate received from", from, "candidate?", !!candidate);
      try {
        if (candidate && pcRef.current) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("[webrtc] addIceCandidate success");
        }
      } catch (err) {
        console.error("[webrtc] addIceCandidate error", err);
      }
    });

    socket.off("call-ended").on("call-ended", ({ from }) => {
      console.log("[socket] call-ended from", from);
      cleanupCall();
    });

    socket.off("end-call").on("end-call", ({ from }) => {
      console.log("[socket] end-call received from", from);
      cleanupCall();
    });

    return () => {
      if (!socket) return;
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("ice-candidate");
      socket.off("call-ended");
      socket.off("end-call");
      socket.off("call-rejected");
    };
  }, [socket]);

  const cleanupCall = () => {
    try { pcRef.current?.close(); } catch(e) {}
    pcRef.current = null;
    if (targetRef.current && socket) {
      // Notify the other user that the call ended
      socket.emit("end-call", { targetUserId: targetRef.current, fromUserId: userProfile?._id });
    }
    targetRef.current = null;
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    dispatch(resetCallState());
  };

  const startCall = async (targetUser) => {
    if (!socket) return console.warn("Socket missing");
    if (!userProfile?._id) return console.warn("User profile missing");

    try {
      const targetUserId = targetUser._id;
      targetRef.current = targetUserId;
       if (!targetUserId) {
          console.warn("Cannot start call: targetUserId missing", targetUser);
          return;
        }
        if (targetUserId === userProfile._id) {
          console.warn("Refusing to call self:", targetUserId);
          return;
        }
 
      const pc = createPeerConnection({
        onTrack: (stream) => {
          console.log("[webrtc] caller: onTrack stream id:", stream.id);
          setRemoteStream(stream);
        },
        onIceCandidate: (candidate) => {
          console.log("[webrtc] caller: sending ICE to", targetUserId);
          socket.emit("ice-candidate", { targetUserId, candidate });
        },
        onConnectionStateChange: (state) => {
          console.log("[webrtc] connection state:", state);
        }
      });

      pcRef.current = pc;

      const stream = await getLocalStream();
      console.log("[webrtc] caller: got local stream id:", stream.id);
      stream.getTracks().forEach(t => pc.addTrack(t, stream));
      setLocalStream(stream);

      dispatch(setCallRole("caller"));
      dispatch(setCallActive(true));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("[webrtc] caller: created offer, sending to server");

      socket.emit("call-user", { targetUserId, offer, fromUserId: userProfile._id, fromUserFullName: userProfile.fullName });
    } catch (err) {
      console.error("[webrtc] startCall error", err);
    }
  };

  return (
    <>
      <IncomingCallPopup
        pcRef={pcRef}
        setLocalStreamState={setLocalStream}
        setRemoteStreamState={setRemoteStream}
        targetRef={targetRef}
      />

      {/* show video only when callActive true */}
      {useSelector(s => s.call.callActive) && (
        <VideoCallWindow localStream={localStream} remoteStream={remoteStream} endCall={cleanupCall} />
      )}

      {!selectedUser ? (
        <div className="w-full flex items-center justify-center flex-col gap-5">  <h2>Welcome to Gupshup</h2>
          <p>Select a user to chat</p>
        </div>
      ) : (
        <div className="h-screen w-full flex flex-col border border-white/10">
          <div className="p-3 border-b border-white/10 flex items-center gap-3">
            <User userDetails={selectedUser} />
            <button className="btn btn-sm btn-primary ml-auto" onClick={() => startCall(selectedUser)}>Video Call</button>
          </div>

          <div className="h-full overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => <Message key={i} messageDetails={m} />)}
          </div>

          <SendMessage />
        </div>
      )}
    </>
  );
};

export default MessageContainer;

// import React, { useEffect }  from "react";
// import User from "./user";
// import Message from "./Message";
// import { IoIosSend } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";
// import { setSelectedUsers } from "../../store/slice/user/userSlice";
// import SendMessage from "./sendMessage";
// import { getMessageThunk } from "../../store/slice/message/messageThunk";

// const MessageContainer = () => {
  
  // const {selectedUser} = useSelector((state)=>state.user)
  // // console.log("Selected User:", selectedUser);

//   // const {userProfile} = useSelector(state=>state.user)
//   // console.log(userProfile)

//   const {messages} = useSelector((state)=>state.messageReducer)
//   console.log(messages)
//   const dispatch = useDispatch()
  
//   useEffect(()=>{
//     if(selectedUser?._id)
//     {dispatch(getMessageThunk({recieverId:selectedUser?._id}));}
//   },[selectedUser])


//   return (
//   <>
//     {!selectedUser ? (
//       <div className="w-full flex items-center justify-center flex-col gap-5">
//         <h2>Welcome to Gupshup</h2>
//         <p>Please select a person to continue your chat!</p>
//       </div>
//     ) : (
//       <div className="h-screen w-full border border-white/10 flex flex-col">
//         <div className="p-3 border-b border-b-white/10">
          
//           <User userDetails={selectedUser} />
//         </div>

//         <div className="h-full overflow-y-auto p-3 space-y-2">
//           {messages?.map((messageDetails, index)=>{
//             return <Message key = {messageDetails._id || index}messageDetails={messageDetails}/>
//           })}
//         </div>
//       <SendMessage /> 

//       </div>
//     )}
//   </>
// );
// };

// export default MessageContainer;

