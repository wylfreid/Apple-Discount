import React from "react";
import { Row, Container } from "reactstrap";
import UseAuth from "./../custom-hooks/useAuth";

import "../styles/admin-nav.css";
import { NavLink, Link } from "react-router-dom";
import { motion } from 'framer-motion';



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
  const { currentUser } = UseAuth();

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
                <Link to='/dashboard/chats'>
                  <motion.span whileTap={{scale: 1.2}}>
                    <i className="ri-message-2-line"></i>
                  </motion.span>
                </Link>
                <motion.span whileTap={{scale: 1.2}}>
                  <i className="ri-message-3-line"></i>
                </motion.span>
                <motion.img whileTap={{scale: 1.2}} src={currentUser && currentUser.photoURL} alt="" />
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
