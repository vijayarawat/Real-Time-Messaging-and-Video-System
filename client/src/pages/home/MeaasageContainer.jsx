import React, { useEffect }  from "react";
import User from "./user";
import Message from "./Message";
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsers } from "../../store/slice/user/userSlice";
import SendMessage from "./sendMessage";
import { getMessageThunk } from "../../store/slice/message/messageThunk";

const MessageContainer = () => {
  
  const {selectedUser} = useSelector((state)=>state.user)
  // console.log("Selected User:", selectedUser);

  // const {userProfile} = useSelector(state=>state.user)
  // console.log(userProfile)

  const {messages} = useSelector((state)=>state.messageReducer)
  console.log(messages)
  const dispatch = useDispatch()
  
  useEffect(()=>{
    if(selectedUser?._id)
    {dispatch(getMessageThunk({recieverId:selectedUser?._id}));}
  },[selectedUser])


  return (
  <>
    {!selectedUser ? (
      <div className="w-full flex items-center justify-center flex-col gap-5">
        <h2>Welcome to Gupshup</h2>
        <p>Please select a person to continue your chat!</p>
      </div>
    ) : (
      <div className="h-screen w-full border border-white/10 flex flex-col">
        <div className="p-3 border-b border-b-white/10">
          <User userDetails={selectedUser} />
        </div>

        <div className="h-full overflow-y-auto p-3 space-y-2">
          {messages?.map((messageDetails, index)=>{
            return <Message key = {messageDetails._id || index}messageDetails={messageDetails}/>
          })}
        </div>
      <SendMessage /> 

      </div>
    )}
  </>
);


  // return (
    
  //   <div className="h-screen w-full border border-white/10 flex flex-col">
  //     <div className="p-3 border-b border-b-white/10">
  //       <User userDetails={selectedUser}/>
  //     </div>
  //       <div className="h-full overflow-y-auto p-3">
  //           <Message/>
  //           <Message/>
  //           <Message/>
  //           <Message/>
  //           <Message/>
  //           </div>
  //        <div className="w-full p-3 border-t border-t-white/10 flex gap-2">
  //       <input
  //         type="text"
  //         placeholder="Type your message here..."
  //         className="input input-primary w-full"
  //       />
  //       <button className="btn btn-square btn-outline btn-primary">
  //           <IoIosSend />
  //       </button>
  //     </div>
  //   </div>
  // );


};

export default MessageContainer;

