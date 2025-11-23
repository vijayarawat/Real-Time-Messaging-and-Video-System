import React, { useState } from "react";
import { Routes } from "react-router"
import UserSidebar from "./UserSidebar";
import GroupSidebar from "./GroupSidebar";
import MessageContainer from "./MessageContainer";
import GroupChatContainer from "./GroupChatContainer";
import { IoPersonSharp, IoPeople } from "react-icons/io5";

const Home = ()=>{
    const [activeTab, setActiveTab] = useState("users"); // 'users' or 'groups'

    return(
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
            {/* Sidebar Navigation */}
            <div className="w-24 bg-gradient-to-b from-slate-900 to-black border-r border-purple-500/20 flex flex-col items-center py-4 gap-4 shadow-lg">
                <div className="text-2xl font-bold text-purple-400 mb-2">G</div>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 transform hover:scale-110 ${
                        activeTab === "users"
                            ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    title="Direct Messages"
                >
                    <IoPersonSharp size={24} />
                </button>
                <button
                    onClick={() => setActiveTab("groups")}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                        activeTab === "groups"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                    title="Group Chats"
                >
                    <IoPeople size={24} />
                </button>
            </div>

            {/* Main Content Area */}
            {activeTab === "users" ? (
                <>
                    <UserSidebar/>
                    <MessageContainer/>
                </>
            ) : (
                <>
                    <GroupSidebar/>
                    <GroupChatContainer/>
                </>
            )}
        </div>
    )
}

export default Home