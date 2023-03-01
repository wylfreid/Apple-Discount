import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import Message from "./Message";
import SendMessage from "./SendMessage";
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
      receiverId: activeChat
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {usersData.map(
        (user, index) =>
          !user.admin && (
            <motion.div
              key={index}
              className="card p-3 m-0 border text-center pointer user__card"
              onClick={(e) => activeModal(user.uid)}
            >
              <span>{user.displayName}</span>
            </motion.div>
          )
      )}

      {activeChat && (
        <div
          class="modal fade show"
          id="staticBackdrop"
          style={{ display: "block" }}
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
          role="dialog"
        >
          <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">
                  customer feedback
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={(e) => setActiveChat(null)}
                ></button>
              </div>
              <div class="modal-body">
                <main className="chat-box ">
                  <div className="messages-wrapper ">
                    {messages?.map(
                      (message) =>
                        (message.uid === activeChat ||
                          (message.uid === currentUser.uid && message.receiverId === activeChat)) && (
                          <Message key={message.id} message={message} />
                        )
                    )}
                  </div>
                  {/* when a new message enters the chat, the screen scrolls dowwn to the scroll div */}
                  <span ref={scroll}></span>
                </main>
              </div>
              <div class="modal-footer">
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
      )}
    </div>
  );
};

export default AdminChatBox;
