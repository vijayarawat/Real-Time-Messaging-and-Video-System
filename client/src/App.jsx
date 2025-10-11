
import { useEffect, useState } from 'react'
import './App.css'
import { Routes ,Route} from "react-router"
import Login  from './pages/authentication/login'
import Register from "./pages/authentication/signup"
import Signup from './pages/authentication/signup'
import Home from './pages/home/Home'
import {Toaster} from 'react-hot-toast'
import ProtectectedRoutes from './components/protectedRoutes.js'
import { useDispatch, useSelector } from 'react-redux'
import { login } from './store/slice/user/userSlice.js'
import { getUserProfileThunk, loginUserThunk } from './store/slice/user/userThunk.js'
import { initalizeSocket } from './store/slice/socket/socketSlice.js'
import { setOnlineUsers } from './store/slice/socket/socketSlice.js'
import {setNewMessage} from '../../client/src/store/slice/message/messageSlice.js'
function App() {
  
  const {isAuthenticated, userProfile} = useSelector(state=>state.user)
  // console.log(isAuthenticated)
  // // console.log(state)
  const {socket,onlineUsers,newMessage} = useSelector(state=>state.socketReducer)

  console.log(onlineUsers)
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(initalizeSocket(userProfile?._id));
  }, [isAuthenticated, dispatch]);


  
  useEffect(()=>{
    if(!socket)return;
    socket.on("onlineUsers",(onlineUsers)=>{
      console.log("Online Users Received:", onlineUsers); 
      dispatch (setOnlineUsers(onlineUsers))
    })
    // newMessage
    socket.on("newMessage",(newMessage)=>{
      // console.log(newMessage); 
      dispatch(setNewMessage(newMessage))
      // dispatch (setOnlineUsers(message))
    })
    return ()=>{
      socket.close();
      // socket.off("onlineUsers"); 
    }
  },[socket])


  useEffect(()=>{
    dispatch(login())
    dispatch(loginUserThunk())
  },[])
 
  useEffect(()=>{
    dispatch(getUserProfileThunk());

  },[])

  return (
  <>
    <Routes>
      <Route path="/" exact element = {<ProtectectedRoutes><Home/></ProtectectedRoutes>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
    </Routes> 
    <Toaster position='top-center' reverseOrder={false}/> 
    </>
  )
}

export default App

