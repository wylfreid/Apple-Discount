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

  const { data: usersData, loading } = useGetData("users");

  const [activeChat, setActiveChat] = useState(false);
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

  useEffect(() => {
    let result = [];
    for (let index = 0; index < messages.length; index++) {
      if (messages[index].uid === activeChat) {
        result.push(messages[index]);
      }
    }

    //setMessages(result);
  }, [activeChat]);

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

  return (
    <div>
      {usersData.map(
        (user, index) =>
          !user.admin && (
            <div
              key={index}
              className="card p-3 m-0 border text-center pointer user__card"
              type="button"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={(e) => activeModal(user.uid)}
            >
              <span>{user.displayName}</span>
            </div>
          )
      )}

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
