// client/src/utils/webrtc.js
export const ICE_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
    // add TURN servers here for production
  ]
};

export const createPeerConnection = (callbacks = {}) => {
  const pc = new RTCPeerConnection(ICE_CONFIG);

  pc.ontrack = (event) => {
    const remoteStream = (event.streams && event.streams[0]) || new MediaStream();
    console.log("[webrtc] ontrack - remoteStream id:", remoteStream?.id);
    if (callbacks.onTrack) callbacks.onTrack(remoteStream);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("[webrtc] local ICE candidate generated");
      if (callbacks.onIceCandidate) callbacks.onIceCandidate(event.candidate);
    }
  };

  pc.onconnectionstatechange = () => {
    console.log("[webrtc] connectionState:", pc.connectionState);
    if (callbacks.onConnectionStateChange) callbacks.onConnectionStateChange(pc.connectionState);
  };

  pc.onnegotiationneeded = () => {
    console.log("[webrtc] negotiationneeded fired");
    if (callbacks.onNegotiationNeeded) callbacks.onNegotiationNeeded();
  };

  return pc;
};

export const getLocalStream = async () => {
  return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};
