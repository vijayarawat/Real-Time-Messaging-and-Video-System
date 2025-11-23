import React, { useEffect, useState }  from "react";
import { IoSearchSharp, IoLogOut } from "react-icons/io5";
import User from "./user";
import { useDispatch, useSelector } from "react-redux";
import { getOtherUsersThunk, logoutUserThunk } from "../../store/slice/user/userThunk";
import { useNavigate } from "react-router-dom";

const UserSidebar = ()=>{

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {otherUsers, userProfile} = useSelector((state)=>state.user)

    const [searchValue, setSearchValue] = useState('')
    const [users, setUsers] = useState([])

    useEffect(()=>{
        if(!searchValue)
            setUsers(otherUsers)
        else{
            setUsers(
                otherUsers.filter((user)=>{
                    return(
                        user.userName.toLowerCase().includes(searchValue.toLowerCase())||
                        user.fullName.toLowerCase().includes(searchValue.toLowerCase())   
                    )
                })
            )
        }
    },[searchValue, otherUsers])

    const handleLogout= async ()=>{
        await dispatch(logoutUserThunk())
        navigate('/login')
    }

    useEffect(()=>{
        (async()=>{
            await dispatch(getOtherUsersThunk())
        }
        )()
    },[])
    
    
    return(
        <div className="w-80 h-screen flex flex-col bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700/50 shadow-xl">
            {/* Header */}
            <div className="border-b border-slate-700/50 px-4 py-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Gupshup</h1>
                <p className="text-xs text-slate-400 mt-1">Direct Messages</p>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-slate-700/50">
                <div className="relative">
                    <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        onChange={(e)=>setSearchValue(e.target.value)} 
                        type="search" 
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-700">
                <div className="flex flex-col gap-2 px-3 py-3">
                    {users?.length > 0 ? (
                        users.map(userDetails=>{
                            return(
                                <User key={userDetails?._id} userDetails={userDetails}/>
                            )
                        })
                    ) : (
                        <div className="flex items-center justify-center py-8 text-slate-400">
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* User Profile Footer */}
            <div className="border-t border-slate-700/50 px-4 py-4 bg-slate-800/50 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                            src={userProfile?.avatar} 
                            alt={userProfile?.userName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-400/50"
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{userProfile?.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">@{userProfile?.userName}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="btn btn-ghost btn-circle btn-sm hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                        title="Logout"
                    >
                        <IoLogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserSidebar