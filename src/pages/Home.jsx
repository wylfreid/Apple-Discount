import React, { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

//import products from "../assets/data/products";

import Helmet from "./../components/Helmet/Helmet";
import "../styles/home.css";

import { Container, Row, Col } from "reactstrap";

import heroImg from "../assets/images/i-background-4.jpg";

import Services from "../services/Services";
import ProductList from "./../components/UI/ProductList";

import Clock from "./../components/UI/Clock";

import counterImg from "../assets/images/iPhone_13_Pro_max.png";

import { useSelector, useDispatch } from "react-redux";
import UseAuth from './../custom-hooks/useAuth';

import {doc,addDoc, updateDoc, serverTimestamp, collection } from "firebase/firestore";

import { db } from "../firebase.config";

import { toast } from 'react-toastify';
import useGetData from './../custom-hooks/useGetData';
import HomeCarousel from '../components/UI/HomeCarousel';
import CustomisedProductsCarousel from './../components/UI/CustomisedProductsCarousel';




const Home = () => {
  const products = useSelector((state) => state.products.products);

  //const auctionsList = useSelector((state) => state.auctions.auctionItems);
  const { data: auctionsList } = useGetData("auctions");

  const [auctions, setAuctions] = useState([]);

  const [isNewAuction, setIsNewAuction] = useState([]);

  const [activeAuctions, setActiveAuctions] = useState([]);

  const [allowAuction, setAllowAuction] = useState(false);

  const users = useSelector((state) => state.users.users);

  const attendees = useSelector((state) => state.attendees.attendees);

  const { currentUser } = UseAuth();

  const btnRef = useRef();

  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSalesProducts, setBestSalesProducts] = useState([]);
  const [mobileProducts, setMobileProducts] = useState([]);
  const [wirelessProducts, setWirelessProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const year = new Date().getFullYear();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const filteredTrendingProducts = products.filter(
      (item) => item.trending === true
    );
    const filteredBestSalesProducts = products.filter(
      (item) => item.category === "laptop"
    );

    const filteredMobileProducts = products.filter(
      (item) => item.category === "mobile"
    );

    const filteredWirelessProducts = products.filter(
      (item) => item.category === "wireless"
    );

    const filteredPopularProducts = products.filter(
      (item) => item.category === "watch"
    );

    setTrendingProducts(filteredTrendingProducts);
    setBestSalesProducts(filteredBestSalesProducts);
    setMobileProducts(filteredMobileProducts);
    setWirelessProducts(filteredWirelessProducts);
    setPopularProducts(filteredPopularProducts);
  }, [products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  });


  useEffect(() => {
    
    setAuctions(auctionsList)

    const newAuctions = auctions.filter(
      (item) => (new Date(item?.startDate)) > (new Date()) && (new Date(item?.endDate)) > (new Date())
    );

    if (newAuctions.length > 0) {
      setIsNewAuction(newAuctions)
    }


    if (attendees.length <= 20) {
      const activesAuctions = auctions.filter(
        (item) => item.active === true && (new Date(item?.startDate)) < (new Date())
      );
      if (activesAuctions.length > 0) {
        setActiveAuctions(activesAuctions)
        localStorage.setItem("AllowAuction", "true")
        setAllowAuction(true)
        btnRef.current.click();
      }else{
        localStorage.setItem("AllowAuction", "false")
        setAllowAuction(false)
        //console.log("test");
      }
    }
  }, [auctionsList, auctions]);

  const handleGoToAuction = () => {

    const attendee = attendees.filter(
      (item) => item.uid === currentUser.uid
    );


    if(attendees?.length > 20){
      toast.error("the maximum number of participants has been reached!");
    }else if(attendee.length !== 0){
      navigate('/auction')
    }
    else{
      if (currentUser) {
  
        handleSubscribe()
        
      }else{
        toast.warning("Please login!");
        navigate('/login')
      }
    }

  };
//console.log(new Date());

  const handleSubscribe = async () => {

    // =========== add bidInfos to the firebase database ===========================
      
      try {


        const docRef = await collection(db, "attendees");
  
        const attendee = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          createdAt: serverTimestamp(),
        }
  
            
        await addDoc(docRef, attendee);
        toast.success("you are currently participating in the auction!");
  
        navigate('/auction')
        
  
      } catch (error) {
        toast.error("something went wrong: " + error );
        console.log(error);
      }
    
    


  };


  const handleToggleSubscribe = async (user) => {
    await updateDoc(doc(db, "users", user.uid), { participant: !user.participant });
    toast.success("you are currently participating in the auction!");
  };

  return (
    <Helmet title={"Home"}>
      <section className="hero__section p-0">
        
            <HomeCarousel />
            {/* <Container>
          <Row>
              <Col lg="12" className="position-absolute" style={{top: "20%", zIndex: 1000}}>

                <Col lg="6" md="6">
                  <div className="hero__content">
                    <p className="hero__subtitle"> Trending products in {year} </p>
                    <h2>Apple products at the best prices</h2>
                    <p className="hero__desc">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatem, magni.
                    </p>

                    <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                      <Link to="/shop">SHOP NOW</Link>
                    </motion.button>
                  </div>
                </Col>
                <Col lg="6" md="6">
                  <div className="hero__img">
                    <img src={heroImg} alt="" />
                  </div>
                </Col>
              </Col>
          </Row>
        </Container> */}

      </section>

      <Services />

      {trendingProducts.length > 0 && (
        <section className="trending__products">
          <Container>
            <Row>
              <Col lg="12" className="text-center">
                <h2 className="section__title"> Trending Products </h2>
              </Col>

              {products.length < 0 ? (
                <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                  loading.....
                </h5>
              ) : (
                <ProductList data={trendingProducts} />
              )}
            </Row>
          </Container>
        </section>
      )}

      {bestSalesProducts.length > 0 && (
        <section className="best__sales">
          <Container>
            <Row>
              <Col lg="12" className="text-center">
                <h2 className="section__title"> Best Sales </h2>
              </Col>

              {products.length < 0 ? (
                <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                  loading.....
                </h5>
              ) : (
                <ProductList data={bestSalesProducts} />
              )}
            </Row>
          </Container>
        </section>
      )}

      {auctions.length > 0 && allowAuction && (
        <section className="timer_count">
          <Container>
            <Row>
              <Col lg="6" md="12" className="count__down-col">
                <div className="clock__top-content">
                  <h4 className="text-white fs-6 mb-2">Limited Offer</h4>
                  <h3 className="text-white fs-5 mb-3">
                    {auctions[auctions.length -1]?.productName}
                  </h3>
                </div>

                <Clock stopTime={auctions[auctions.length -1]?.endDate} />

                <Link to="/auction">
                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn store__btn mt-4"
                    onClick={handleGoToAuction}
                  >
                    Go to Auction
                  </motion.button>
                </Link>
              </Col>

              <Col lg="6" md="12" className="text-end counter__img">
                <img src={auctions[0]?.imgUrl} alt="" />
              </Col>
            </Row>
          </Container>
        </section>
      )}


      {!allowAuction && isNewAuction.length > 0 && (
        <section className="timer_count">
          <Container>
            <Row>
              <Col lg="6" md="12" className="count__down-col">
                <div className="clock__top-content">
                  <h4 className="text-white fs-6 mb-2">New Limited Offer</h4>
                  
                  <h3 className="text-white fs-5 mb-3">
                    {isNewAuction[isNewAuction.length -1]?.productName}
                  </h3>
                </div>

                <Clock stopTime={isNewAuction[isNewAuction.length -1]?.startDate} />

                <h2 className="text-white fs-5 mb-2 mt-4">The auction will start at the end of the countdown</h2>
              </Col>

              <Col lg="6" md="12" className="text-end counter__img">
                <img src={isNewAuction[isNewAuction.length -1]?.imgUrl} alt="" />
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {mobileProducts.length > 0 && <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5 ">
              <h2 className="section__title"> New Arrivals </h2>
            </Col>

            {products.length < 0 ? (
              <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                loading.....
              </h5>
            ) : (
              <ProductList data={mobileProducts} />
            )}

            {products.length < 0 ? (
              <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                loading.....
              </h5>
            ) : (
              <ProductList data={wirelessProducts} />
            )}
          </Row>
        </Container>
      </section>}

      {popularProducts.length > 0 && <section className="popular__category">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title"> Popular in Category </h2>
            </Col>

            {products.length < 0 ? (
              <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                loading.....
              </h5>
            ) : (
              <ProductList data={popularProducts} />
            )}
          </Row>
        </Container>
      </section>}

      <button
        ref={btnRef}
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal"
      ></button>

      <div
        className="modal fade auction__popup "
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div
              type="button"
              className="close  position-absolute text-end fs-1"
              data-dismiss="modal"
              aria-label="Close"
              style={{ right: 10, top: 0, zIndex: 1000 }}
            >
              <span aria-hidden="true">&times;</span>
            </div>
            <div className="modal-body p-4">
              <div className="text-center">
                <h5>Une nouvelle vente aux enchères a démarrée!</h5>
              </div>

              <div className="d-flex justify-content-center p-2">
                <img src={activeAuctions[activeAuctions.length -1]?.imgUrl} alt="" />
              </div>

              <h6 className="text-center">
                {activeAuctions[activeAuctions.length -1]?.productName}
              </h6>

              <p className="text-center">
                {activeAuctions[activeAuctions.length -1]?.shortDesc}
              </p>

              <div className="d-flex justify-content-center mb-2 mt-1">
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                  className="buy__btn"
                  onClick={handleGoToAuction}
                >
                  Go to Auction
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        
          <Container>
            <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title mb-5"> customised Products </h2>
            </Col>
            <CustomisedProductsCarousel />
            </Row>
          </Container>
      </section>
    </Helmet>
  );
};

export default Home;
