import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import Message from "./Message";
import { db } from "../../firebase.config";
import { motion } from "framer-motion";

import UseAuth from "../../custom-hooks/useAuth";
import { toast } from "react-toastify";
import useGetData from "./../../custom-hooks/useGetData";
import { addDoc, serverTimestamp } from "firebase/firestore";
import "../../styles/admin-chatBox.css";

const AdminChatBox = () => {
  const { currentUser } = UseAuth();

  const { data: users, loading } = useGetData("users");

  const [usersData, setUsersData] = useState([]);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const scroll = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe;
  }, []);

  useEffect(()=>{
    if (activeChat) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  },[activeChat])

  const activeModal = (uid) => {
    setActiveChat(uid);
  };

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
      receiverId: activeChat,
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };



useEffect(() => {
  if (users.length > 0) {
    let result = [];
    for (let index = 0; index < users.length; index++) {
      const msgNumber = messages.filter(
        (msg) => msg.uid === users[index].uid || msg.receiverId === users[index].uid
      );
      result.push({ data: users[index], msg: msgNumber });
    }

    for (let index = 0; index < result.length; index++) {
      if (result[index].msg[result[index].msg.length - 1]?.receiverId != undefined) {
        result[index].msg = [];
      }
    }

    result.sort((a, b) => {
      if (a.msg.length === 0 && b.msg.length === 0) {
        return 0;
      } else if (a.msg.length === 0) {
        return 1;
      } else if (b.msg.length === 0) {
        return -1;
      } else {
        const aDate = new Date(a.msg[a.msg.length - 1].createdAt.toDate())
        const bDate = new Date(b.msg[b.msg.length - 1].createdAt.toDate())
        
        return  bDate - aDate;
      }
    });

    setUsersData(result);
  }
}, [users, messages]);

console.log(messages);


  return (
    <div>
      {!loading ?
      
      usersData.length > 0 ?
      usersData.map(
        (user, index) =>
          !user.admin && user.msg.length > 0 && (
            <div
              key={index}
              className="card p-3 m-0 border pointer user__card d-flex flex-row"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={(e) => activeModal(user.data.uid)}
            >
              <div className="w-25 d-flex justify-content-center align-items-center"> <img className="rounded-pill" style={{width: "50px", height: "50px"}} src={user.data.photoURL} /> </div>

              <div className="w-50 d-flex justify-content-center align-items-center">
                <span>{user.data.displayName}</span>
              </div>

              <div className="w-25 d-flex justify-content-center align-items-center">
                <span className="msg__number rounded-pill"> {user.msg.length} </span>
              </div>
            </div>
          )
      ) : 
      <div className="text-center w-100">
      <h5 className="p-5">Aucun nouveau message!</h5>
    </div>

    : <div className="text-center w-100">
    <h5 className="p-5">chargement....</h5>
  </div>
    
    
    }

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Customer Feedback
              </h5>
              <div
                type="button"
                className="close text-end fs-1" 
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </div>
            </div>
            <div className="modal-body">
              <main className="chat-box ">
                <div className="messages-wrapper ">
                  {messages?.map(
                    (message) =>
                      (message.uid === activeChat ||
                        (message.uid === currentUser.uid &&
                          message.receiverId === activeChat)) && (
                        <Message key={message.id} message={message} />
                      )
                  )}
                </div>
                {/* when a new message enters the chat, the screen scrolls dowwn to the scroll div */}
                <span ref={scroll}></span>
              </main>
            </div>
            <div className="modal-footer">
              <form
                onSubmit={(event) => sendMessage(event)}
                className="send-message"
              >
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatBox;
