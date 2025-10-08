import React  from "react";
import { IoSearch } from "react-icons/io5";
import User from "./user";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserThunk } from "../../store/slice/user/userThunk";
import { useNavigate } from "react-router-dom";

const UserSidebar = ()=>{

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {otherUsers} = useSelector((state)=>state.user)
    // console.log("other Users", otherUsers)

    const handleLogout= async ()=>{
        await dispatch(logoutUserThunk())

    }
    return(
        <>
     
        <div className="max-w-[20em] w-full h-screen flex flex-col">
            <h1 className="bg-black mx-3 px-2 py-1 rounded-lg mt-3 text-[#7480FF] text-xl font-semibold">Gup Shup</h1>
        <div className="p-3">
            <label className="input">
                <IoSearch />
            <input type="search" required placeholder="Search" />
            </label>
        </div>
        <div className="h-full overflow-y-auto px-3 flex flex-col gap-2">
            {otherUsers?.map(userDetails=>{
                return(
                <User key ={userDetails?._id} userDetails={userDetails}/>
                )
            })}
            

        </div>
        <div className="flex items-center justify-between p-3">
            <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
            </div>
            </div>
            <button onClick={handleLogout} className="btn btn-primary btn-sm px-4">Logout</button>
        </div>
        </div>
       </>
    )
}

export default UserSidebar