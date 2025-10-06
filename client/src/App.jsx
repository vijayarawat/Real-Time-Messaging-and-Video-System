import { useEffect, useState } from 'react'
import './App.css'
import { Routes ,Route} from "react-router"
import Login  from './pages/authentication/login'
import Signup from './pages/authentication/signup'
import Home from './pages/home/Home'

import { useDispatch, useSelector } from 'react-redux'
// import { login } from './store/slice/user/userSlice'
// import { loginUserThunk } from './store/slice/user/userThunk'

function App() {
  
  // const {isAuthenticated} = useSelector(state=>state.userSlice)
  // console.log(isAuthenticated)
  // // console.log(state)
  // const dispatch = useDispatch();

  // useEffect(()=>{
  //   // dispatch(login())
  //   dispatch(loginUserThunk())
  // })
 
  return (
  <>
    <Routes>
      <Route path="/" exact element = {<Home/>}></Route>

      <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
    </Routes> 
    
    </>
  )
}

export default App
