import React, { useEffect, useRef, useState } from "react";
import { IoMic, IoMicOff, IoVideocam, IoVideocamOff, IoExit } from "react-icons/io5";

const VideoCallWindow = ({ localStream, remoteStream, endCall }) => {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  useEffect(() => {
    if (localRef.current && localStream) localRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) remoteRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !muted));
  }, [muted, localStream]);

  useEffect(() => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((t) => (t.enabled = !cameraOff));
  }, [cameraOff, localStream]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="bg-slate-900/80 p-4 rounded-xl shadow-2xl w-full max-w-4xl flex gap-6 items-start">
        <div className="flex-1 relative bg-black rounded-lg overflow-hidden">
          {remoteStream ? (
            <video ref={remoteRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-72 flex items-center justify-center text-slate-400">Waiting for remote...</div>
          )}
        </div>

        <div className="w-64 flex flex-col items-center gap-4">
          <div className="relative w-56 h-40 bg-black rounded-lg overflow-hidden">
            <video ref={localRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">You</div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setMuted((m) => !m)}
                className={`btn btn-sm ${muted ? 'btn-warning' : 'btn-ghost'}`}
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <IoMicOff size={18} /> : <IoMic size={18} />}
              </button>

              <button
                onClick={() => setCameraOff((c) => !c)}
                className={`btn btn-sm ${cameraOff ? 'btn-warning' : 'btn-ghost'}`}
                title={cameraOff ? 'Turn camera on' : 'Turn camera off'}
              >
                {cameraOff ? <IoVideocamOff size={18} /> : <IoVideocam size={18} />}
              </button>
            </div>

            <button className="btn btn-error w-full" onClick={endCall}>
              <IoExit className="mr-2" /> End Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallWindow;
