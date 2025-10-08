import React  from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsers } from "../../store/slice/user/userSlice";
const User = ( {userDetails})=>{
//
    const dispatch = useDispatch()
    const {selectedUser} = useSelector((state)=>state.user)
    console.log(selectedUser)

    const handleUserClick =()=>{
        dispatch(setSelectedUsers(userDetails))
    }

    return(
        <>
        <div onClick={handleUserClick} 
        className={`flex gap-5 items-center hover:bg-gray-700 rounded-lg px-2 py-1cursor-pointer ${userDetails?._id === selectedUser?._id && 'bg-gray-700'}`}>
        <div className="avatar avatar-online">
        <div className="w-12 rounded-full">
            <img src={userDetails?.avatar}/>
        </div>
        </div>
        <div>
        <h2 className="line-clamp-1">{userDetails?.fullName}</h2>
        <p className="text-xs">{userDetails?.userName}</p>
        </div>
        </div>
        </>
    )
}

export default User