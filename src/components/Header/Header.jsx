import React, { useRef, useEffect } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";

import { motion } from "framer-motion";

import logo from "../../assets/images/eco-logo.png";
import userIcon from "../../assets/images/user-icon.png";

import { Container, Row } from "reactstrap";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import UseAuth from "./../../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from './../../firebase.config';
import { toast } from "react-toastify";



const nav__links = [
  {
    path: "home",
    display: "Home",
  },
  {
    path: "shop",
    display: "Shop",
  },
  {
    path: "cart",
    display: "Cart",
  },
];

const Header = () => {
  const navigate = useNavigate();

  const { currentUser } = UseAuth();

  const headerRef = useRef(null);

  const menuRef = useRef(null);

  const totalQuantity = useSelector((state) => state.cart.totalQuantity);


  const profileActionsRef = useRef(null);

  const logOut = () =>{
    signOut(auth).then(()=>{
      toast.success('Logged out');
      navigate('/home');
    }).catch(error=>{
      toast.error(error.message);
    })
  }


  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();

    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  });

  const menuToggle = () => menuRef.current.classList.toggle("active__menu");

  const NavigateToCart = () => {
    navigate("/cart");
  };

  const toggleProfileActions = () =>{
     profileActionsRef.current.classList.toggle("show__profileActions")
    console.log(profileActionsRef.current);  
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div>
                <Link to="/home">
                  <h1>Apple Discount</h1>
                </Link>
              </div>
            </div>

            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__icons">
              <span className="fav__icon">
                <i className="ri-heart-line"></i>
                <span className="badge">1</span>
              </span>
              <span className="cart__icon" onClick={NavigateToCart}>
                <i className="ri-shopping-bag-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>
              <div className="profile">
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={currentUser ? currentUser.photoURL : userIcon}
                  alt=""
                  onClick={toggleProfileActions}
                />

                <div className="profile__actions text-center" 
                ref={profileActionsRef} 
                onClick={toggleProfileActions}>
                  {
                    currentUser ? <div> 
                                    <Link to="/history" className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-history-line"></i><span >History</span></Link>
                                    <div className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-logout-circle-line"></i><span onClick={logOut}>Lougout</span></div> 
                                  </div> : 
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <Link to="/login" className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-login-circle-line"></i><span >Login</span></Link>
                      <Link to="/signup" className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-account-circle-line"></i><span >Signup</span></Link>
                      <Link to="/dashboard" className="icon-span d-flex align-items-center justify-content-center gap-1"><span >Dashboard</span></Link>
                      
                    </div>
                  }
                </div>
                
              </div>
            </div>

            <div className="mobile__menu">
              <span onClick={menuToggle}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
