import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Routers from "./../../routers/Routers";
import AdminNav from "./../../admin/AdminNav";
import { useLocation } from "react-router-dom";
import ChatBox from '../chats/ChatBox';

const Layout = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname.startsWith("/dashboard") ? <AdminNav /> : <Header />}

    
      <div style={{marginTop: 70}}>
        <Routers />
      </div>
      
      {!location.pathname.startsWith("/dashboard") && <ChatBox />}
      
      <Footer />
    </>
  );
};

export default Layout;
