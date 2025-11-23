// client/src/pages/home/IncomingCallPopup.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearIncomingCall, setCallActive, setCallRole } from "../../store/slice/call/callSlice";
import { createPeerConnection, getLocalStream } from "../../utils/webrtc";

const IncomingCallPopup = ({ pcRef, setLocalStreamState, setRemoteStreamState, targetRef }) => {
  const dispatch = useDispatch();
  const socket = useSelector(s => s.socketReducer.socket);
  const incomingCall = useSelector(s => s.call.incomingCall);

  
  if (!incomingCall) return null;

  const acceptCall = async () => {
    try {
      const callerId = incomingCall.fromUserId;
      console.log("[incoming] acceptCall from", callerId);

      targetRef.current = callerId;

      const pc = createPeerConnection({
        onTrack: (stream) => {
          console.log("[incoming] onTrack - got remote stream id:", stream.id);
          setRemoteStreamState(stream);
        },
        onIceCandidate: (candidate) => {
          console.log("[incoming] sending ICE to caller");
          socket.emit("ice-candidate", { targetUserId: callerId, candidate });
        }
      });

      pcRef.current = pc;

      // listen negotiationneeded for robustness
      pc.onnegotiationneeded = async () => {
        console.log("[incoming] negotiationneeded");
        try {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer-call", { targetUserId: callerId, answer });
          console.log("[incoming] negotiation answer sent");
        } catch (err) {
          console.error("[incoming] negotiation error", err);
        }
      };

      const local = await getLocalStream();
      console.log("[incoming] got local stream id:", local.id);
      local.getTracks().forEach(t => pc.addTrack(t, local));
      setLocalStreamState(local);

      // set remote offer (from caller)
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      console.log("[incoming] setRemoteDescription(offer)");

      // create + send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer-call", { targetUserId: callerId, answer });
      console.log("[incoming] answer created & sent");

      dispatch(clearIncomingCall());
      dispatch(setCallRole("callee"));
      dispatch(setCallActive(true));

    } catch (err) {
      console.error("[incoming] accept error", err);
    }
  };

  const rejectCall = () => {
    if (socket) socket.emit("end-call", { targetUserId: incomingCall.fromUserId });
    dispatch(clearIncomingCall());
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white p-3 rounded z-50 shadow">
      <p className="font-medium">{incomingCall.fromUserFullName || incomingCall.fromUserId} is calling...</p>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-success" onClick={acceptCall}>Accept</button>
        <button className="btn btn-error" onClick={rejectCall}>Reject</button>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
