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
import { motion, AnimatePresence } from "framer-motion";

import UseAuth from "./../../custom-hooks/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const ChatBox = () => {
  const { currentUser } = UseAuth();

  const [activeChat, setActiveChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const scroll = useRef();


  const navigate = useNavigate();

  const onChat = () => {
    if (!currentUser) {
      toast.warning("Please login!");
      navigate('/login');
    } else {
      
      setActiveChat(!activeChat);
    }
  };


  useEffect(()=>{
    if (activeChat) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  },[activeChat])

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


  return (
    <div className="wrapper_chat">
      <motion.div
        whileTap={{ scale: 1.2 }}
        className="chat_messenger rounded"
        style={{background: "transparent"}}
        onClick={() => onChat()}
      >
        <svg x="0" y="0" width="60px" height="60px">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g>
              <circle fill="#0a1d37" cx="30" cy="30" r="30"></circle>
              <svg x="10" y="10">
                <g transform="translate(0.000000, -10.000000)" fill="#FFFFFF">
                  <g id="logo" transform="translate(0.000000, 10.000000)">
                    <path
                      d="M20,0 C31.2666,0 40,8.2528 40,19.4 C40,30.5472 31.2666,38.8 
                      20,38.8 C17.9763,38.8 16.0348,38.5327 14.2106,38.0311 C13.856,37.9335 13.4789,37.9612 
                      13.1424,38.1098 L9.1727,39.8621 C8.1343,40.3205 6.9621,39.5819 6.9273,38.4474 L6.8184,34.8894 
                      C6.805,34.4513 6.6078,34.0414 6.2811,33.7492 C2.3896,30.2691 0,25.2307 0,19.4 C0,8.2528 8.7334,0 
                      20,0 Z M7.99009,25.07344 C7.42629,25.96794 8.52579,26.97594 9.36809,26.33674 L15.67879,21.54734 
                      C16.10569,21.22334 16.69559,21.22164 17.12429,21.54314 L21.79709,25.04774 C23.19919,26.09944 
                      25.20039,25.73014 26.13499,24.24744 L32.00999,14.92654 C32.57369,14.03204 31.47419,13.02404 
                      30.63189,13.66324 L24.32119,18.45264 C23.89429,18.77664 23.30439,18.77834 22.87569,18.45674 
                      L18.20299,14.95224 C16.80079,13.90064 14.79959,14.26984 13.86509,15.75264 L7.99009,25.07344 Z"
                    ></path>
                  </g>
                </g>
              </svg>
            </g>
          </g>
        </svg>
        
      </motion.div>
      {currentUser && activeChat && (

<AnimatePresence>
          

        <motion.div 
          initial={{ rotate: 180, scale: 0 }}
          animate={{ rotate: 0, scale: 1, ease: "easeOut" }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 50
          }}

          exit={{
            opacity: 0,
            scale: 0.75,
            transition: {
              ease: "easeIn",
              duration: 0.5,
            },
          }}
        
        className="active_chat" >

              <div style={{ width: "100%" }}>
                <div className="card card-bordered fix_boderChat">
                  <div className="card-header">
                    <h4 className="card-title">
                      <strong>Service client</strong>
                    </h4>
                    <span className="btn btn-xs btn-secondary">
                      laissez un commentaire
                    </span>
                  </div>
                  <div className="ps-container ps-theme-default ps-active-y fix_scoll">
                    <main className="chat-box ">
                      <div className="messages-wrapper">
                        {messages?.map((message) => (
                        (message.uid === currentUser.uid || (message.receiverId === currentUser.uid)) &&  <Message key={message.id} message={message} />
                        ))}
                      </div>
                      {/* when a new message enters the chat, the screen scrolls dowwn to the scroll div */}
                      <span ref={scroll}></span>
                    </main>
                  </div>

                  <SendMessage scroll={scroll} />
                </div>
              </div>
        </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ChatBox;
