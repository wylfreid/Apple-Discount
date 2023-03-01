import React, { useState,useEffect } from "react";
import { auth, db } from './../../firebase.config';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from 'react-toastify';
import useGetData from './../../custom-hooks/useGetData';
import UseAuth from './../../custom-hooks/useAuth';

const SendMessage = ({ scroll }) => {


  const { currentUser } = UseAuth();

  const { data: usersData, loading } = useGetData("users");

  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState();



  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      toast.warning("Enter valid message");
      return;
    }
    
    
    await addDoc(collection(db, "messages"), {
      text: message,
      name: currentUser.displayName,
      avatar: currentUser.photoURL,
      createdAt: serverTimestamp(),
      uid: currentUser.uid,
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;
