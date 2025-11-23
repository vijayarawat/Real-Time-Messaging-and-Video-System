import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroupThunk, getUserGroupsThunk } from "../../store/slice/group/groupThunk";
import { IoClose } from "react-icons/io5";

const CreateGroupModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { otherUsers } = useSelector((state) => state.user);
    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleMemberToggle = (userId) => {
        setSelectedMembers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            alert("Please enter a group name");
            return;
        }

        if (selectedMembers.length === 0) {
            alert("Please select at least one member");
            return;
        }

        setLoading(true);
        try {
            await dispatch(
                createGroupThunk({
                    groupName,
                    description,
                    memberIds: selectedMembers
                })
            );
            await dispatch(getUserGroupsThunk());
            onClose();
        } catch (error) {
            console.error("Error creating group:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-200 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create Group</h2>
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
                            <span className="label-text font-semibold">Group Name *</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            className="input input-bordered w-full"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Description</span>
                        </label>
                        <textarea
                            placeholder="Enter group description"
                            className="textarea textarea-bordered w-full"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Select Members *</span>
                        </label>
                        <div className="border border-base-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                            {otherUsers && otherUsers.length > 0 ? (
                                otherUsers.map((user) => (
                                    <label key={user._id} className="flex items-center gap-3 cursor-pointer hover:bg-base-300 p-2 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(user._id)}
                                            onChange={() => handleMemberToggle(user._id)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <div className="flex items-center gap-2 flex-1">
                                            <img
                                                src={user.avatar}
                                                alt={user.fullName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate">{user.fullName}</p>
                                                <p className="text-xs text-white/50 truncate">@{user.userName}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <p className="text-center text-white/50">No users available</p>
                            )}
                        </div>
                        <p className="text-sm text-white/60 mt-2">
                            Selected: {selectedMembers.length} member(s)
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
                            onClick={handleCreateGroup}
                            className="btn btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
