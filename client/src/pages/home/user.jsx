import React  from "react";

const User = ()=>{
    return(
        <>
        <div className=" flex gap-5 items-center">
        <div class="avatar avatar-online">
        <div class="w-12 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
        </div>
        </div>
        <div>
        <h2 className="line-clamp-1">Full Name</h2>
        <p className="text-xs">User Name</p>
        </div>
        </div>
        </>
    )
}

export default User