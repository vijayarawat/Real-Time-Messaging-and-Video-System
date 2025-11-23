import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupMessagesThunk, addGroupMessageThunk } from "../../store/slice/group/groupThunk";
import { addGroupMessage } from "../../store/slice/group/groupSlice";
import { createPeerConnection, getLocalStream } from "../../utils/webrtc";
import { setGroupCallActive, setGroupCallRole, setIncomingGroupCall, resetGroupCallState, clearIncomingGroupCall } from "../../store/slice/call/callSlice";
import GroupSettings from "./GroupSettings";
import GroupVideoCallWindow from "./GroupVideoCallWindow";
import GroupIncomingCallPopup from "./GroupIncomingCallPopup";
import { IoSend, IoSettings, IoCall, IoClose } from "react-icons/io5";

const GroupChatContainer = () => {
    const dispatch = useDispatch();
    const { selectedGroup, groupMessages } = useSelector((state) => state.group);
    const { userProfile } = useSelector((state) => state.user);
    const socket = useSelector((s) => s.socketReducer.socket);
    const { groupCallActive } = useSelector((s) => s.call);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    const messagesEndRef = useRef(null);
    const pcRef = useRef(null);

    useEffect(() => {
        if (selectedGroup?._id) {
            dispatch(getGroupMessagesThunk(selectedGroup._id));
        }
    }, [selectedGroup, dispatch]);

    useEffect(() => {
        if (!socket) return;

        const handleNewGroupMessage = (message) => {
            if (message.senderId._id !== userProfile._id) {
                dispatch(addGroupMessage(message));
            }
        };

        socket.on("newGroupMessage", handleNewGroupMessage);

        return () => {
            socket.off("newGroupMessage", handleNewGroupMessage);
        };
    }, [socket, userProfile._id, dispatch]);

    // Group call listeners
    useEffect(() => {
        if (!socket) return;

        socket.on("incoming-group-call", ({ groupId, offer, from, fromUserFullName }) => {
            console.log("[socket] incoming-group-call in", groupId);
            if (selectedGroup?._id === groupId) {
                dispatch(setIncomingGroupCall({ from, fromUserFullName, offer, groupId }));
            }
        });

        socket.on("user-joined-group-call", ({ userId, answer }) => {
            console.log("[socket] user-joined-group-call:", userId);
            if (pcRef.current) {
                pcRef.current.setRemoteDescription(new RTCSessionDescription(answer)).catch(e => console.error("Error setting remote description:", e));
            }
        });

        socket.on("group-ice-candidate", ({ from, candidate, groupId }) => {
            if (selectedGroup?._id === groupId && pcRef.current && candidate) {
                pcRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error("Error adding ICE candidate:", e));
            }
        });

        socket.on("group-call-ended", ({ groupId }) => {
            if (selectedGroup?._id === groupId) {
                cleanupGroupCall();
            }
        });

        socket.on("group-call-accepted", ({ groupId, userId }) => {
            console.log("[socket] group-call-accepted by", userId);
            if (selectedGroup?._id === groupId && !groupCallActive) {
                // Someone accepted the call, activate it even if we're not the initiator
                dispatch(setGroupCallActive(true));
            }
        });

        return () => {
            socket.off("incoming-group-call");
            socket.off("user-joined-group-call");
            socket.off("group-ice-candidate");
            socket.off("group-call-ended");
            socket.off("group-call-accepted");
        };
    }, [socket, selectedGroup?._id, dispatch, groupCallActive]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [groupMessages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedGroup) return;

        setLoading(true);
        try {
            await dispatch(
                addGroupMessageThunk({
                    groupId: selectedGroup._id,
                    message: messageText
                })
            );
            setMessageText("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const startGroupCall = async () => {
        if (!socket || !selectedGroup) return console.warn("Socket or group missing");

        try {
            const pc = createPeerConnection({
                onTrack: (stream) => {
                    console.log("[webrtc] group call: onTrack stream id:", stream.id);
                    setRemoteStreams((prev) => ({
                        ...prev,
                        [stream.id]: stream,
                    }));
                },
                onIceCandidate: (candidate) => {
                    console.log("[webrtc] group call: sending ICE");
                    socket.emit("group-ice-candidate", { groupId: selectedGroup._id, candidate });
                },
                onConnectionStateChange: (state) => {
                    console.log("[webrtc] group connection state:", state);
                },
            });

            pcRef.current = pc;

            const stream = await getLocalStream();
            console.log("[webrtc] group call: got local stream id:", stream.id);
            stream.getTracks().forEach((t) => pc.addTrack(t, stream));
            setLocalStream(stream);

            dispatch(setGroupCallRole("initiator"));
            dispatch(setGroupCallActive(true));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            console.log("[webrtc] group call: created offer, sending to server");

            socket.emit("initiate-group-call", {
                groupId: selectedGroup._id,
                offer,
                fromUserId: userProfile._id,
                fromUserFullName: userProfile.fullName,
            });
        } catch (err) {
            console.error("[webrtc] startGroupCall error", err);
        }
    };

    const cleanupGroupCall = () => {
        try {
            pcRef.current?.close();
        } catch (e) {
            console.error("Error closing PC:", e);
        }
        pcRef.current = null;
        if (localStream) localStream.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
        setRemoteStreams({});
        dispatch(resetGroupCallState());
    };

    const endGroupCall = () => {
        if (socket && selectedGroup) {
            socket.emit("end-group-call", { groupId: selectedGroup._id });
        }
        cleanupGroupCall();
    };

    if (!selectedGroup) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-white/70">Select a group to start chatting</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-screen w-full flex flex-col border border-white/10">
            {/* Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={selectedGroup.groupIcon}
                        alt={selectedGroup.groupName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="font-semibold text-white">{selectedGroup.groupName}</h2>
                        <p className="text-sm text-white/60">{selectedGroup.members.length} members</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!groupCallActive ? (
                        <button
                            onClick={startGroupCall}
                            className="btn btn-primary btn-sm flex items-center gap-2"
                        >
                            <IoCall size={18} />
                            Start Call
                        </button>
                    ) : (
                        <button
                            onClick={endGroupCall}
                            className="btn btn-error btn-sm flex items-center gap-2"
                        >
                            <IoClose size={18} />
                            End Call
                        </button>
                    )}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="btn btn-ghost btn-circle btn-sm"
                    >
                        <IoSettings size={20} />
                    </button>
                </div>
            </div>

            {/* Video Call Window */}
            {groupCallActive && (
                <GroupVideoCallWindow
                    localStream={localStream}
                    remoteStreams={remoteStreams}
                    endCall={endGroupCall}
                />
            )}

            {/* Incoming Call Popup */}
            <GroupIncomingCallPopup
                pcRef={pcRef}
                setLocalStreamState={setLocalStream}
                setRemoteStreamsState={setRemoteStreams}
                groupId={selectedGroup._id}
                onAccept={() => dispatch(clearIncomingGroupCall())}
                onReject={() => dispatch(clearIncomingGroupCall())}
            />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {groupMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-white/50">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    groupMessages.map((msg, idx) => (
                        <div
                            key={msg._id || idx}
                            className={`flex ${
                                msg.senderId._id === userProfile._id ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    msg.senderId._id === userProfile._id
                                        ? "bg-[#7480FF] text-white"
                                        : "bg-black/30 text-white"
                                }`}
                            >
                                {msg.senderId._id !== userProfile._id && (
                                    <p className="text-xs font-semibold text-white/70 mb-1">
                                        {msg.senderId.fullName}
                                    </p>
                                )}
                                <p className="break-words">{msg.message}</p>
                                <p className="text-xs text-white/50 mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-white/10 flex gap-2">
                <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="textarea textarea-bordered flex-1"
                    rows="1"
                    disabled={loading}
                />
                <button
                    onClick={handleSendMessage}
                    className="btn btn-primary btn-circle"
                    disabled={loading || !messageText.trim()}
                >
                    <IoSend size={20} />
                </button>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <GroupSettings
                    group={selectedGroup}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
};

export default GroupChatContainer;
