import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateGroupThunk, addMemberToGroupThunk, removeMemberFromGroupThunk, deleteGroupThunk } from "../../store/slice/group/groupThunk";
import { IoClose, IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";

const GroupSettings = ({ group, onClose }) => {
    const dispatch = useDispatch();
    const { otherUsers } = useSelector((state) => state.user);
    const { userProfile } = useSelector((state) => state.user);
    const [groupName, setGroupName] = useState(group.groupName);
    const [description, setDescription] = useState(group.description);
    const [loading, setLoading] = useState(false);
    const isAdmin = group.admin._id === userProfile._id;

    const copyJoinCode = () => {
        navigator.clipboard.writeText(group.joinCode);
        toast.success("Join code copied to clipboard!");
    };

    const handleUpdateGroup = async () => {
        if (!groupName.trim()) {
            alert("Group name cannot be empty");
            return;
        }

        setLoading(true);
        try {
            await dispatch(
                updateGroupThunk({
                    groupId: group._id,
                    groupName,
                    description
                })
            );
            onClose();
        } catch (error) {
            console.error("Error updating group:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (userId) => {
        setLoading(true);
        try {
            await dispatch(
                addMemberToGroupThunk({
                    groupId: group._id,
                    memberId: userId
                })
            );
        } catch (error) {
            console.error("Error adding member:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (confirm("Are you sure you want to remove this member?")) {
            setLoading(true);
            try {
                await dispatch(
                    removeMemberFromGroupThunk({
                        groupId: group._id,
                        memberId
                    })
                );
            } catch (error) {
                console.error("Error removing member:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteGroup = async () => {
        if (confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
            setLoading(true);
            try {
                await dispatch(deleteGroupThunk(group._id));
                onClose();
            } catch (error) {
                console.error("Error deleting group:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const membersNotInGroup = otherUsers?.filter(
        (user) => !group.members.some((member) => member._id === user._id)
    ) || [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-200 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Group Settings</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-circle btn-sm"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Join Code */}
                    <div className="bg-base-300 p-4 rounded-lg">
                        <label className="label">
                            <span className="label-text font-semibold">Join Code</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-black px-3 py-2 rounded flex items-center justify-between">
                                <span className="text-lg font-bold text-[#7480FF] tracking-wider">{group.joinCode}</span>
                                <button
                                    onClick={copyJoinCode}
                                    className="btn btn-ghost btn-circle btn-xs"
                                    title="Copy join code"
                                >
                                    <IoCopy size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-white/60 mt-2">Share this code to let others join the group</p>
                    </div>

                    {/* Group Info - Only edit if admin */}
                    {isAdmin && (
                        <>
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Group Name</span>
                                </label>
                                <input
                                    type="text"
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
                                    className="textarea textarea-bordered w-full"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                />
                            </div>

                            <button
                                onClick={handleUpdateGroup}
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Group"}
                            </button>
                        </>
                    )}

                    {!isAdmin && (
                        <div className="bg-base-300 p-3 rounded-lg">
                            <p className="font-semibold text-white">Group Info</p>
                            <p className="text-sm text-white/70 mt-1"><strong>Admin:</strong> {group.admin.fullName}</p>
                            <p className="text-sm text-white/70"><strong>Members:</strong> {group.members.length}</p>
                            <p className="text-sm text-white/70 mt-2">{description}</p>
                        </div>
                    )}

                    {/* Members */}
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Members ({group.members.length})</span>
                        </label>
                        <div className="border border-base-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                            {group.members.map((member) => (
                                <div key={member._id} className="flex items-center justify-between bg-base-300 p-2 rounded">
                                    <div className="flex items-center gap-2 flex-1">
                                        <img
                                            src={member.avatar}
                                            alt={member.fullName}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm truncate">{member.fullName}</p>
                                            {group.admin._id === member._id && (
                                                <p className="text-xs text-yellow-400">Admin</p>
                                            )}
                                        </div>
                                    </div>
                                    {isAdmin && group.admin._id !== member._id && (
                                        <button
                                            onClick={() => handleRemoveMember(member._id)}
                                            className="btn btn-xs btn-error"
                                            disabled={loading}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Members */}
                    {isAdmin && membersNotInGroup.length > 0 && (
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Add Members</span>
                            </label>
                            <div className="border border-base-300 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                                {membersNotInGroup.map((user) => (
                                    <div key={user._id} className="flex items-center justify-between bg-base-300 p-2 rounded">
                                        <div className="flex items-center gap-2 flex-1">
                                            <img
                                                src={user.avatar}
                                                alt={user.fullName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate">{user.fullName}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddMember(user._id)}
                                            className="btn btn-xs btn-primary"
                                            disabled={loading}
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Delete Group */}
                    {isAdmin && (
                        <button
                            onClick={handleDeleteGroup}
                            className="btn btn-error w-full"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete Group"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupSettings;
