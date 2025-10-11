import React, { useEffect, useRef }  from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsers } from "../../store/slice/user/userSlice";

const Message= ({messageDetails}) => {

  const {selectedUser,userProfile} = useSelector((state)=>state.user)  

  const messageRef  = useRef(null);
  
  useEffect(()=>{
    if(messageRef.current){
      messageRef.current.scrollIntoView({behaviour:"smooth"})
    }
  })
  // console.log(userProfile?._id === messageDetails?.senderId)
  // console.log(selectedUser)

  const isSender = messageDetails.senderId === userProfile?._id;


  return (
   <>
       <div 
       ref = {messageRef}
       className={`chat ${isSender ? "chat-end" : "chat-start"}`}>

   {/* <div className={`chat  ${userProfile?._id === messageDetails?.senderId ? 'chat-end':'chat-start'}`}> */}
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
      <img
        alt="Tailwind CSS chat bubble component"
        src={userProfile.avatar}
      />
    </div>
  </div>
  <div className="chat-header">
 
    {/* {selectedUser?.fullName} */}
    <time className="text-xs opacity-50">12:45</time>
  </div>
  <div className="chat-bubble">{messageDetails?.message}</div>

</div>
</>
  );
};

export default Message;
