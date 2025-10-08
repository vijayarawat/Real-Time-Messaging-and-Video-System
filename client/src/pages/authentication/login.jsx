import React, { useState } from "react";
import {toast} from "react-hot-toast"
import { loginUserThunk } from "../../store/slice/user/userThunk";
import { useDispatch,useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";


const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const {isAuthenticated} = useSelector((state)=>state.user)

    // console.log("Is Authenticated", isAuthenticated)
    
  useEffect(()=>{
        console.log(isAuthenticated)
        if(isAuthenticated ){
            navigate('/')
        }
  },[isAuthenticated])


  const [loginData, setLoginData] = useState({
    username:"",password:""
  })

  const handleInputChange=(e)=>{
    setLoginData((prev)=>({
      ...prev,
      [e.target.name]:e.target.value,
    }))
  }

    const handleLogin= async()=>{
    //   if(!loginData.username || !loginData.password){
    //     toast.error("Please enter username and password");
    // return;
      // }

      // console.log("login")
      toast.success("login Successful")
      const response = await dispatch(loginUserThunk(loginData))
      if(response?.payload?.success){
        navigate('/')
    }
    }

    return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[40rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold">Please Login..!!</h2>

        <label className="input input-bordered flex items-center gap-2 w-full h-12">
       
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleInputChange}
            className="grow"
            placeholder="Username"
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full h-12">
     
          <input
    type="password"
    name="password"
    value={loginData.password}
    onChange={handleInputChange}
    placeholder="Password"
    className="grow"
  />
        </label>

        
        <button onClick={handleLogin} className="btn btn-primary flex items-center gap-2 w-full h-12">
          Login
        </button>

        <p>
          Don't have an account? &nbsp;
          <Link to="/signup" className="text-blue-400 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
