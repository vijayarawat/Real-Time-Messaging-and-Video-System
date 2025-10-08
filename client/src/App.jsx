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
import { getOtherUsersThunk, getUserProfileThunk, loginUserThunk } from './store/slice/user/userThunk.js'

function App() {
  
  const {isAuthenticated} = useSelector(state=>state.user)
  // console.log(isAuthenticated)
  // console.log(state)
  const dispatch = useDispatch();


  useEffect(()=>{
    dispatch(login())
    dispatch(loginUserThunk())
  },[])
 
  useEffect(()=>{
    dispatch(getUserProfileThunk());
    dispatch(getOtherUsersThunk());
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
