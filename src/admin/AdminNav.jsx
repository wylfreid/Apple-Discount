import React, { useRef } from "react";
import { Row, Container } from "reactstrap";
import UseAuth from "./../custom-hooks/useAuth";

import "../styles/admin-nav.css";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import logo from "../../src/assets/images/logo.png";

import { signOut } from "firebase/auth";
import { auth } from "./../firebase.config";

const admin__nav = [
  {
    display: "Dashboard",
    path: "/dashboard",
  },
  {
    display: "All-Products",
    path: "/dashboard/all-products",
  },
  {
    display: "Orders",
    path: "/dashboard/orders",
  },
  {
    display: "Users",
    path: "/dashboard/users",
  },
];

const AdminNav = () => {
  const navigate = useNavigate();
  const { currentUser } = UseAuth();

  const profileActionsRef = useRef(null);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out");
        navigate("/home");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const toggleProfileActions = () => {
    profileActionsRef.current.classList.toggle("show__profileActions");
    //console.log(profileActionsRef.current);
  };

  return (
    <>
      <header className="admin__header">
        <div className="admin__nav-top">
          <Container>
            <div className="admin__nav-wrapper-top">
              <div className="logo">
                <Link to="/home">
                  <h2>Apple Discount</h2>
                </Link>
              </div>

              <div className="search__box">
                <input type="text" placeholder="Search..." />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>

              <div className="admin__nav-top-right">
                <Link to="/dashboard/chats">
                  <motion.span whileTap={{ scale: 1.2 }}>
                    <i className="ri-message-2-line"></i>
                  </motion.span>
                </Link>

                <Link to="/dashboard/auction">

                  <motion.span whileTap={{ scale: 1.2 }}>
                    <i className="ri-auction-line"></i>
                  </motion.span>
                </Link>

                <div className="profile">
                  <motion.img
                    whileTap={{ scale: 1.2 }}
                    src={currentUser && currentUser.photoURL}
                    alt=""
                    onClick={toggleProfileActions}
                  />

                  <div
                    className="profile__actions text-center"
                    ref={profileActionsRef}
                    onClick={toggleProfileActions}
                  >
                    <div className="icon-span d-flex align-items-center justify-content-center gap-1">
                      <i className="ri-logout-circle-line"></i>
                      <span onClick={logOut}>Lougout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>

      <section className="admin__menu p-0">
        <Container>
          <Row>
            <div className="admin__navigation">
              <ul className="admin__menu-list">
                {admin__nav.map((item, index) => (
                  <li className="admin__menu-item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__admin-menu" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdminNav;
