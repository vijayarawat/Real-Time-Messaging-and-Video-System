import React  from "react";
import { IoSearch } from "react-icons/io5";
import User from "./user";

const UserSidebar = ()=>{
    return(
        <>
     
        <div className="max-w-[20em] w-full h-screen flex flex-col">
            <h1 className="bg-black mx-3 px-2 py-1 rounded-lg mt-3 text-[#7480FF] text-xl font-semibold">Gup Shup</h1>
        <div className="p-3">
            <label class="input">
                <IoSearch />
            <input type="search" required placeholder="Search" />
            </label>
        </div>
        <div className="h-full overflow-y-auto px-3">
            <User/>
            <User/>
            <User/>

        </div>
        <div className="flex items-center justify-between p-3">
            <div class="avatar">
            <div class="ring-primary ring-offset-base-100 w-10 rounded-full ring-2 ring-offset-2">
                <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
            </div>
            </div>
            <button class="btn btn-primary btn-sm px-4">Logout</button>
        </div>
        </div>
       </>
    )
}

export default UserSidebar