import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { joinGroupByCodeThunk, getUserGroupsThunk } from "../../store/slice/group/groupThunk";
import { IoClose } from "react-icons/io5";

const JoinGroupModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinGroup = async () => {
        if (!joinCode.trim()) {
            alert("Please enter a join code");
            return;
        }

        setLoading(true);
        try {
            await dispatch(joinGroupByCodeThunk(joinCode.toUpperCase()));
            // Refresh the groups list
            await dispatch(getUserGroupsThunk());
            setJoinCode("");
            onClose();
        } catch (error) {
            console.error("Error joining group:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleJoinGroup();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-200 rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Join Group</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-circle btn-sm"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Group Join Code</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter join code (e.g., ABC12345)"
                            className="input input-bordered w-full uppercase"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            maxLength="8"
                            disabled={loading}
                        />
                        <p className="text-sm text-white/60 mt-2">
                            Ask the group admin for the join code
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="btn btn-ghost flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleJoinGroup}
                            className="btn btn-primary flex-1"
                            disabled={loading || !joinCode.trim()}
                        >
                            {loading ? "Joining..." : "Join Group"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGroupModal;
