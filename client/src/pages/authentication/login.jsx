import React, { useState } from "react";
import {toast} from "react-hot-toast"
const Login = () => {

  const [loginData, setLoginData] = useState({
    username:"",password:""
  })

  const handleInputChange=(e)=>{
    setLoginData((prev)=>({
      ...prev,
      [e.target.name]:e.target.value,
    }))
  }

    const handleLogin=()=>{
      console.log("login")
      toast.success("login Successful")
    }

    return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[40rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold">Please Login..!!</h2>

        <label className="input input-bordered flex items-center gap-2 w-full h-12">
       
          <input
            type="text"
            name="username"
            className="grow"
            placeholder="Username"
            
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full h-12">
     
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="grow"
          
          />
        </label>

        
        <button onClick={handleLogin} className="btn btn-primary flex items-center gap-2 w-full h-12">
          Login
        </button>

        <p>
          Don't have an account? &nbsp;
          {/* <Link to="/signup" className="text-blue-400 underline">
            Sign Up
          </Link> */}
        </p>
      </div>
    </div>
  );
};

export default Login;
