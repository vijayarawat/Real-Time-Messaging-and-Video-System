import React, { useEffect }  from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const ProtectectedRoutes = ({children})=>{

    const navigate = useNavigate()
    const {isAuthenticated,screenLoading} = useSelector((state)=>state.user)

    // console.log("Is Authenticated", isAuthenticated)
    
    useEffect(()=>{
        console.log(isAuthenticated, screenLoading)
        if(!screenLoading &&  !isAuthenticated ){
            navigate('/login')
        }
    },[isAuthenticated,screenLoading])
 
    // const {isAuthenticated} = useSelector(state=>state.user)
    return children
}

export default ProtectectedRoutes