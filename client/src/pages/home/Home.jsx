import React  from "react";
import { Routes } from "react-router"
import UserSidebar from "./UserSidebar";
import MessageContainer from "./MeaasageContainer";

const Home = ()=>{
    return(
        <div className="flex">
            <UserSidebar/>
            <MessageContainer/>
        </div>
    )
}

export default Home