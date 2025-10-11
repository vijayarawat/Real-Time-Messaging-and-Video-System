import React, { useEffect, useState }  from "react";
import { IoSearch } from "react-icons/io5";
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
    // console.log("other Users", otherUsers)

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
    },[searchValue])

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
        <>
     
        <div className="max-w-[20em] w-full h-screen flex flex-col">
            <h1 className="bg-black mx-3 px-2 py-1 rounded-lg mt-3 text-[#7480FF] text-xl font-semibold">Gup Shup</h1>
        <div className="p-3">
            <label className="input">
                <IoSearch />
            <input onChange={(e)=>setSearchValue(e.target.value)} type="search" required placeholder="Search" />
            </label>
        </div>
        <div className="h-full overflow-y-auto px-3 flex flex-col gap-2">
            {users?.map(userDetails=>{
                return(
                <User key ={userDetails?._id} userDetails={userDetails}/>
                )
            })}
            

        </div>
        <div className="flex items-cente justify-between p-3">
            <div className="flex items-center  gap-3">
            <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                <img src={userProfile?.avatar} />
            </div>
            </div>
            <h2>{userProfile?.userName}</h2>
       
        </div>
            <button onClick={handleLogout} className="btn btn-primary btn-sm px-4">Logout</button>
        </div>
        </div>
       </>
    )
}

export default UserSidebar