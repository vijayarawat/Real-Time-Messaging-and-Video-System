import React  from "react";
import User from "./user";
import Message from "./Message";
import { IoIosSend } from "react-icons/io";


const MessageContainer = () => {
  return (
    <div className="h-screen w-full border border-white/10 flex flex-col">
      <div className="p-3 border-b border-b-white/10">
        <User/>
      </div>
        <div className="h-full overflow-y-auto p-3">
            <Message/>
            <Message/>
            <Message/>
            <Message/>
            <Message/>
            <Message/>
            <Message/>
            <Message/>
            <Message/>
            </div>
         <div className="w-full p-3 border-t border-t-white/10 flex gap-2">
        <input
          type="text"
          placeholder="Type your message here..."
          className="input input-primary w-full"
        />
        <button class="btn btn-square btn-outline btn-primary">
            <IoIosSend />
        </button>
      </div>
    </div>
  );
};

export default MessageContainer;

