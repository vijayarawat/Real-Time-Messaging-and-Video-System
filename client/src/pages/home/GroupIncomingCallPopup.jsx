import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPeerConnection, getLocalStream } from "../../utils/webrtc";
import { setGroupCallActive, setGroupCallRole, clearIncomingGroupCall } from "../../store/slice/call/callSlice";
import { IoCall, IoClose } from "react-icons/io5";

const GroupIncomingCallPopup = ({ pcRef, setLocalStreamState, setRemoteStreamsState, groupId, onAccept, onReject }) => {
    const dispatch = useDispatch();
    const { incomingGroupCall } = useSelector((s) => s.call);
    const socket = useSelector((s) => s.socketReducer.socket);
    const { userProfile } = useSelector((state) => state.user);

    if (!incomingGroupCall) return null;

    const handleAcceptCall = async () => {
        if (!socket || !groupId) return;

        try {
            const pc = createPeerConnection({
                onTrack: (stream) => {
                    console.log("[webrtc] group call: onTrack stream id:", stream.id);
                    setRemoteStreamsState((prev) => ({
                        ...prev,
                        [incomingGroupCall.from]: stream,
                    }));
                },
                onIceCandidate: (candidate) => {
                    console.log("[webrtc] group call: sending ICE");
                    socket.emit("group-ice-candidate", { groupId, candidate });
                },
                onConnectionStateChange: (state) => {
                    console.log("[webrtc] group connection state:", state);
                },
            });

            pcRef.current = pc;

            const stream = await getLocalStream();
            console.log("[webrtc] group call: got local stream id:", stream.id);
            stream.getTracks().forEach((t) => pc.addTrack(t, stream));
            setLocalStreamState(stream);

            // Set call as active immediately when accepting
            dispatch(setGroupCallRole("participant"));
            dispatch(setGroupCallActive(true));

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log("[webrtc] group call: created answer, sending to server");

            socket.emit("accept-group-call", {
                groupId,
                answer,
                fromUserId: userProfile._id,
            });

            dispatch(clearIncomingGroupCall());
            if (onAccept) onAccept();
        } catch (err) {
            console.error("[webrtc] acceptGroupCall error", err);
        }
    };

    const handleRejectCall = () => {
        dispatch(clearIncomingGroupCall());
        if (onReject) onReject();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-base-200 rounded-lg p-6 max-w-sm w-full mx-4 text-center">
                <h2 className="text-2xl font-bold mb-2">Incoming Group Call</h2>
                <p className="text-white/70 mb-4">
                    {incomingGroupCall.fromUserFullName} is calling...
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={handleAcceptCall}
                        className="btn btn-success btn-lg flex items-center gap-2"
                    >
                        <IoCall size={20} />
                        Accept
                    </button>
                    <button
                        onClick={handleRejectCall}
                        className="btn btn-error btn-lg flex items-center gap-2"
                    >
                        <IoClose size={20} />
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupIncomingCallPopup;
