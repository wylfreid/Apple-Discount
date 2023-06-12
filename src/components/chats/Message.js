import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import UseAuth from './../../custom-hooks/useAuth';

const Message = ({ message }) => {
  const { currentUser } = UseAuth();
  return (
    <div
      className={`chat-bubble ${message.uid === currentUser.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{message.text}</p>

        <p className="date">{message.createdAt && format(message.createdAt?.toDate(), "dd MMMM yyyy HH:mm", { locale: fr })}</p>

      </div>
    </div>
  );
};

export default Message;
