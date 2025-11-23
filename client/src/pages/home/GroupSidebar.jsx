import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoSearch, IoAdd } from "react-icons/io5";
import { getUserGroupsThunk } from "../../store/slice/group/groupThunk";
import { setSelectedGroup } from "../../store/slice/group/groupSlice";
import CreateGroupModal from "./CreateGroupModal";
import JoinGroupModal from "./JoinGroupModal";

const GroupSidebar = () => {
    const dispatch = useDispatch();
    const { groups, selectedGroup } = useSelector((state) => state.group);
    const [searchValue, setSearchValue] = useState("");
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    useEffect(() => {
        dispatch(getUserGroupsThunk());
    }, [dispatch]);

    useEffect(() => {
        if (!searchValue) {
            setFilteredGroups(groups);
        } else {
            setFilteredGroups(
                groups.filter((group) =>
                    group.groupName.toLowerCase().includes(searchValue.toLowerCase())
                )
            );
        }
    }, [searchValue, groups]);

    const handleSelectGroup = (group) => {
        dispatch(setSelectedGroup(group));
    };

    return (
        <div className="max-w-[20em] w-full h-screen flex flex-col border-r border-white/10">
            <div className="p-3 border-b border-white/10">
                <h1 className="bg-black px-2 py-1 rounded-lg text-[#7480FF] text-xl font-semibold mb-3">
                    Groups
                </h1>
                <div className="flex gap-2 mb-3">
                    <label className="input input-sm input-bordered flex items-center gap-2 flex-1">
                        <IoSearch />
                        <input
                            type="search"
                            placeholder="Search groups"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </label>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn btn-sm btn-primary"
                        title="Create new group"
                    >
                        <IoAdd size={18} />
                    </button>
                </div>
                <button
                    onClick={() => setShowJoinModal(true)}
                    className="btn btn-sm btn-secondary w-full"
                    title="Join group with code"
                >
                    Join Group
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
                {filteredGroups.length === 0 ? (
                    <div className="text-center text-white/50 py-4">
                        <p>No groups found</p>
                    </div>
                ) : (
                    filteredGroups.map((group) => (
                        <div
                            key={group._id}
                            onClick={() => handleSelectGroup(group)}
                            className={`p-3 rounded-lg cursor-pointer transition ${
                                selectedGroup?._id === group._id
                                    ? "bg-[#7480FF] text-white"
                                    : "bg-black/30 hover:bg-black/50 text-white"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={group.groupIcon}
                                    alt={group.groupName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{group.groupName}</h3>
                                    <p className="text-sm text-white/60">{group.members.length} members</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreateModal && (
                <CreateGroupModal onClose={() => setShowCreateModal(false)} />
            )}

            {showJoinModal && (
                <JoinGroupModal onClose={() => setShowJoinModal(false)} />
            )}
        </div>
    );
};

export default GroupSidebar;
