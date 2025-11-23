import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IoClose, IoMic, IoMicOff, IoVideocam, IoVideocamOff, IoGrid, IoExit } from "react-icons/io5";

const GroupVideoCallWindow = ({ localStream, remoteStreams, endCall }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const { userProfile } = useSelector((state) => state.user);
    const [remoteUserData, setRemoteUserData] = useState({});

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        Object.keys(remoteStreams).forEach((userId) => {
            if (remoteVideoRefs.current[userId] && remoteStreams[userId]) {
                remoteVideoRefs.current[userId].srcObject = remoteStreams[userId];
            }
        });
    }, [remoteStreams]);

    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [layout, setLayout] = useState("grid"); // 'grid' or 'spotlight'

    // sync mute state to local audio tracks
    useEffect(() => {
        if (!localStream) return;
        try {
            localStream.getAudioTracks().forEach((t) => {
                t.enabled = !muted;
            });
        } catch (e) {
            console.error("Error toggling audio tracks:", e);
        }
    }, [muted, localStream]);

    // sync camera state to local video tracks
    useEffect(() => {
        if (!localStream) return;
        try {
            localStream.getVideoTracks().forEach((t) => {
                t.enabled = !cameraOff;
            });
        } catch (e) {
            console.error("Error toggling video tracks:", e);
        }
    }, [cameraOff, localStream]);

    const totalParticipants = Object.keys(remoteStreams).length + 1; // +1 for self
    const isSingleCall = totalParticipants === 2;
    const isMultipleCall = totalParticipants > 2;
    

    return (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-50">
            {/* Header */}
            <div className="w-full bg-black/80 p-4 flex justify-between items-center border-b border-white/10">
                <div className="text-white">
                    <h2 className="text-xl font-semibold">Group Video Call</h2>
                    <p className="text-sm text-white/60">{totalParticipants} participant{totalParticipants > 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={endCall}
                    className="btn btn-error btn-sm flex items-center gap-2"
                >
                    <IoClose size={18} /> End Call
                </button>
            </div>

            {/* Video Container */}
            <div className="flex-1 w-full flex items-center justify-center p-4 overflow-auto">
                {isSingleCall ? (
                    // Single Remote User - Large View
                    <div className="flex flex-col gap-4 w-full h-full max-w-6xl">
                        {/* Remote Video - Large */}
                        <div className="flex-1 relative bg-black rounded-lg overflow-hidden shadow-2xl">
                            {Object.keys(remoteStreams).length > 0 ? (
                                <>
                                    <video
                                        ref={(ref) => {
                                            const userId = Object.keys(remoteStreams)[0];
                                            if (ref) remoteVideoRefs.current[userId] = ref;
                                        }}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded text-sm font-semibold">
                                        Remote User
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-white/50">Waiting for remote user...</p>
                                </div>
                            )}
                        </div>

                        {/* Local Video - Small (Picture in Picture) */}
                        <div className="relative bg-black rounded-lg overflow-hidden shadow-lg" style={{ width: "260px", height: "190px" }}>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">
                                You
                            </div>
                        </div>
                    </div>
                ) : isMultipleCall ? (
                    // Multiple Remote Users - Grid View
                    <div className="w-full h-full flex flex-col gap-4">
                        {/* Grid of all participants */}
                        <div className="flex-1 grid gap-4 auto-rows-fr" style={{
                            gridTemplateColumns: layout === 'spotlight' ? '1fr 350px' : `repeat(auto-fit, minmax(280px, 1fr))`
                        }}>
                            {/* Local Video */}
                            <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded font-semibold">
                                    You (Local)
                                </div>
                            </div>

                            {/* Remote Videos */}
                            {Object.keys(remoteStreams).map((userId, index) => (
                                <div
                                    key={userId}
                                    className="relative bg-black rounded-lg overflow-hidden shadow-lg"
                                >
                                    <video
                                        ref={(ref) => {
                                            if (ref) remoteVideoRefs.current[userId] = ref;
                                        }}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded font-semibold">
                                        Participant {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Only Local - Waiting for others
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl" style={{ width: "400px", height: "500px" }}>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-sm px-3 py-1 rounded font-semibold">
                                You (Local)
                            </div>
                        </div>
                        <p className="text-white/60 text-center">Waiting for other participants to join...</p>
                    </div>
                )}
            </div>

            {/* Controls - bottom center */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
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

                    <button
                        onClick={() => setLayout((l) => (l === 'grid' ? 'spotlight' : 'grid'))}
                        className="btn btn-sm btn-ghost"
                        title="Toggle layout"
                    >
                        <IoGrid size={18} />
                    </button>

                    <button onClick={endCall} className="btn btn-error btn-sm" title="End call">
                        <IoExit size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupVideoCallWindow;
