import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsers } from "../../store/slice/user/userSlice";

const User = ({userDetails})=>{
    const dispatch = useDispatch()
    const {selectedUser} = useSelector((state)=>state.user)
    const {onlineUsers} = useSelector((state)=>state.socketReducer)
    
    const isUserOnline = onlineUsers?.map(String).includes(String(userDetails?._id));
    
    const handleUserClick =()=>{
        dispatch(setSelectedUsers(userDetails))
    }

    return(
        <div 
            onClick={handleUserClick} 
            className={`flex gap-3 items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                userDetails?._id === selectedUser?._id 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/30' 
                    : 'hover:bg-slate-700 bg-slate-800/50'
            }`}
        >
            <div className="relative flex-shrink-0">
                <img 
                    src={userDetails?.avatar}
                    alt={userDetails?.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/50"
                />
                {isUserOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-white truncate">{userDetails?.fullName}</h2>
                <p className="text-xs text-slate-400 truncate">@{userDetails?.userName}</p>
            </div>
            {isUserOnline && (
                <span className="text-xs font-semibold text-green-400">●</span>
            )}
        </div>
    )
}

export default User
