import React, { useRef, useEffect, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";

import { motion } from "framer-motion";

import logo from "../../assets/images/logo.png";
import userIcon from "../../assets/images/user-icon.png";

import { Container, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import UseAuth from "./../../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from './../../firebase.config';
import { toast } from "react-toastify";

import useGetData from './../../custom-hooks/useGetData';

import { db } from "./../../firebase.config";

import { doc,collection, addDoc, updateDoc, query, orderBy, onSnapshot, limit } from "firebase/firestore";

import { favoritesActions } from './../../redux/slices/favoriteSlice';
import { auctionsActions } from './../../redux/slices/auctionSlice';
import { productActions } from './../../redux/slices/productSlice';
import { usersActions } from './../../redux/slices/userSlice';
import { attendeesActions } from './../../redux/slices/attendeeSlice';






const nav__links = [
  {
    path: "home",
    display: "Accueil",
    icon: "ri-home-2-line"
  },
  {
    path: "shop",
    display: "Boutique",
    icon: "ri-store-3-line"
  },
  {
    path: "cart",
    display: "Panier",
    icon: "ri-shopping-bag-line"
  },
];

const Header = () => {
  const navigate = useNavigate();

  const { currentUser } = UseAuth();

  const { data: products, loading } = useGetData("products");

  const { data: auctionsData } = useGetData("auctions");

  const { data: users} = useGetData("users");


  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const totalFavouritesQuantity = useSelector((state) => state.favorites.totalQuantity);

  const [isSticky, setIsSticky] = useState(false);

  const headerRef = useRef(null);

  const menuRef = useRef(null);
  
  const dispatch = useDispatch();

  const [storageItem, setStorageItem] = useState(() => JSON.parse(localStorage.getItem("favourites") || "[]"))

  useEffect(() => {
    
    const user = users.filter(
      (item) => item?.uid === currentUser?.uid && item?.admin === true
    );

    if (user.length > 0) {
      localStorage.setItem("admin", "true")
    }else{
      localStorage.setItem("admin", "false")
    }

  }, [users]);
  

  useEffect(()=>{
    for (let index = 0; index < products.length; index++) {
      dispatch(
        productActions.addItem({
          id: products[index].id,
          productName: products[index].productName,
          shortDesc: products[index].shortDesc,
          description: products[index].description,
          price: products[index].price,
          imgUrl: products[index].imgUrl,
          category: products[index].category,
          trending: products[index].trending,
          bestSales: products[index].bestSales,
          newProduct: products[index].newProduct,
          popular: products[index].popular
        })
      );
      
    }

    let favouriteList = [];
        for (let i = 0; i < storageItem.length; i++) {
            for (let index = 0; index < products.length; index++) {
                if (storageItem[i] === products[index].id) {
                    favouriteList.push(products[index]);
                }
                
            }
        }

    for (let index = 0; index < favouriteList.length; index++) {
      
      dispatch(
        favoritesActions.addItem({
          id: favouriteList[index].id,
          productName: favouriteList[index].productName,
          price: favouriteList[index].price,
          imgUrl: favouriteList[index].imgUrl,
          category: favouriteList[index].category,
          storage: "default",
          color: "default"
        })
      );
      
    }
  },[products, storageItem])


  const profileActionsRef = useRef(null);

  const logOut = () =>{
    signOut(auth).then(()=>{
      toast.success('Logged out');
      navigate('/home');
    }).catch(error=>{
      toast.error(error.message);
    })
  }


  /* const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 0 ||
        document.documentElement.scrollTop > 0
      ) {
        headerRef.current?.classList.add("sticky__header");
        setIsSticky(true);
      } else {
        headerRef.current?.classList.remove("sticky__header");
        setIsSticky(false);
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();

    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  }); */

  const menuToggle = () => menuRef.current.classList.toggle("active__menu");

  const NavigateToCart = () => {
    navigate("/cart");
  };

  const NavigateToFavourites = () => {
    navigate("/favourites");
  };

  const toggleProfileActions = () =>{
     profileActionsRef.current.classList.toggle("show__profileActions")
    //console.log(profileActionsRef.current);  
  };


  useEffect(() => {
    const filteredAuctions = auctionsData.filter((item) => item.active === true);

    if (filteredAuctions.length > 0) {
      
      for (let index = 0; index < filteredAuctions.length; index++) {
        dispatch(
          auctionsActions.addItem({
            id: filteredAuctions[index].id,
            productName: filteredAuctions[index].productName,
            shortDesc: filteredAuctions[index].shortDesc,
            description: filteredAuctions[index].description,
            category: filteredAuctions[index].category,
            startPrice: filteredAuctions[index].startPrice,
            currentPrice: filteredAuctions[index].currentPrice,
            step: filteredAuctions[index].step,
            endDate: filteredAuctions[index].endDate,
            imgUrl: filteredAuctions[index].imgUrl,
            active: filteredAuctions[index].active
          })
        );
        
      }

    }
  }, [auctionsData]);


  useEffect(() => {

      for (let index = 0; index < users.length; index++) {
        dispatch(
          usersActions.addUser({
            admin: users[index].admin,
            participant: users[index].participant,
            uid: users[index].uid,
            displayName: users[index].displayName,
            email: users[index].email,
            photoURL: users[index].photoURL,
          })
        );
    }
  }, [users]);


  useEffect(() => {
    const q = query(
      collection(db, "attendees"),
      orderBy("createdAt"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let participants = [];
      QuerySnapshot.forEach((doc) => {
        participants.push({ ...doc.data(), id: doc.id });
        //console.log(doc.data());
        dispatch(
          attendeesActions.addAttendee({
            uid: doc.data().uid,
            displayName: doc.data().displayName,
            email: doc.data().email,
            photoURL: doc.data().photoURL,
            createdAt: doc.data().createdAt
          })
        );
      });
    });
    return () => unsubscribe;
  }, []);

  return (
    <header className="header sticky__header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              
              <div>
                <Link to="/home">
                <img src={logo} alt="logo" />
                </Link>
              </div>
            </div>

            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu p-0">
                {nav__links.map((item, index) => (
                  <li className="nav__item w-100 d-flex align-items-center justify-content-center" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active icon-span d-flex align-items-center justify-content-center gap-1" : "icon-span d-flex align-items-center justify-content-center gap-1"
                      }
                    >
                      <i className={item.icon} ></i>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__icons">
              <motion.span whileTap={{scale: 1.2}} className="fav__icon" onClick={NavigateToFavourites}>
                <i className="ri-heart-line"></i>
                <span className="badge"> {totalFavouritesQuantity} </span>
              </motion.span>
              <motion.span whileTap={{scale: 1.2}} className="cart__icon" onClick={NavigateToCart}>
                <i className="ri-shopping-bag-line"></i>
                <span className="badge">{totalQuantity}</span>
              </motion.span>
              <div className="profile">
                <div className="profil__img">
                  <motion.img
                    whileTap={{ scale: 1.2 }}
                    src={currentUser ? currentUser.photoURL : userIcon}
                    alt=""
                    onClick={toggleProfileActions}
                  />
                </div>

                <div className="profile__actions text-center" 
                ref={profileActionsRef} 
                onClick={toggleProfileActions}>
                  {
                    currentUser ? <div> 
                                    <Link to="/history" className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-history-line"></i><span >Historique</span></Link>
                                    <div className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-logout-circle-line"></i><span onClick={logOut}>Déconnexion</span></div> 
                                  </div> : 
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <Link to="/login" className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-login-circle-line"></i><span >Connexion</span></Link>
                      <Link to="/signup" className="icon-span d-flex align-items-center justify-content-center gap-1"><i className="ri-account-circle-line"></i><span >Inscription</span></Link>
                   
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
