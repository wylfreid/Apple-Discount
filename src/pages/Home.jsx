import React, { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

//import products from "../assets/data/products";

import Helmet from "./../components/Helmet/Helmet";
import "../styles/home.css";

import { Container, Row, Col } from "reactstrap";

import Services from "../services/Services";
import ProductList from "./../components/UI/ProductList";

import Clock from "./../components/UI/Clock";


import { useSelector} from "react-redux";
import UseAuth from './../custom-hooks/useAuth';

import {doc,addDoc, updateDoc, serverTimestamp, collection } from "firebase/firestore";

import { db } from "../firebase.config";

import { toast } from 'react-toastify';
import useGetData from './../custom-hooks/useGetData';
import HomeCarousel from '../components/UI/HomeCarousel';
import CustomisedProductsCarousel from './../components/UI/CustomisedProductsCarousel';
import { Modal } from './../components/UI/Modal';



const Home = () => {
  const products = useSelector((state) => state.products.products);

  //const auctionsList = useSelector((state) => state.auctions.auctionItems);
  const { data: auctionsList } = useGetData("auctions");

  const [auctions, setAuctions] = useState([]);

  const [isNewAuction, setIsNewAuction] = useState([]);

  const [activeAuctions, setActiveAuctions] = useState([]);

  const [allowAuction, setAllowAuction] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const attendees = useSelector((state) => state.attendees.attendees);

  const { currentUser } = UseAuth();

  const btnRef = useRef();

  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSalesProducts, setBestSalesProducts] = useState([]);
  const [IpadProducts, setIpadProducts] = useState([]);
  const [macbookProducts, setMacbookProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    const filteredTrendingProducts = products.filter(
      (item) => item.trending === true
    );
    const filteredBestSalesProducts = products.filter(
      (item) => item.category === "iphone"
    );

    const filteredIpadProducts = products.filter(
      (item) => item.category === "ipad"
    );

    const filteredMacbookProducts = products.filter(
      (item) => item.category === "macbook"
    );

    const filteredPopularProducts = products.filter(
      (item) => item.category === "accessory"
    );

    setTrendingProducts(filteredTrendingProducts);
    setBestSalesProducts(filteredBestSalesProducts);
    setIpadProducts(filteredIpadProducts);
    setMacbookProducts(filteredMacbookProducts);
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
           

      </section>

      <Services />

      {trendingProducts.length > 0 && (
        <section className="trending__products">
          <Container>
            <Row>
              <Col lg="12" className="text-center">
                <h2 className="section__title mb-5"> Trending Products </h2>
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
                <h2 className="section__title mb-5"> Best Sales </h2>
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

      {IpadProducts.length > 0 && <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5 ">
              <h2 className="section__title mb-5"> New Arrivals </h2>
            </Col>

            {products.length < 0 ? (
              <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                loading.....
              </h5>
            ) : (
              <ProductList data={IpadProducts} />
            )}

            {products.length < 0 ? (
              <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                loading.....
              </h5>
            ) : (
              <ProductList data={macbookProducts} />
            )}
          </Row>
        </Container>
      </section>}

      {popularProducts.length > 0 && <section className="popular__category">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title mb-5"> Popular in Category </h2>
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
                <h5>A new auction has started!</h5>
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




      

      <div
        className="modal fade auction__popup"
        id="exampleModal1"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
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
            <div className="modal-body p-3">
              <div className="text-justify mt-3 mb-3 ps-2">
                <h6 style={{lineHeight: "30px"}}>For customized products, please contact customer service via the message button. You can also write to us on <span className="fw-bold text-dark"> <a href="https://instagram.com/apple_discount_237?igshid=YmMyMTA2M2Y=">Instagram</a></span>, we are available 24 hours a day, 7 days a week.</h6>
              </div>

          
            </div>
          </div>
        </div>
      </div>


      


      <CustomisedProductsCarousel isOpen={isOpen} setIsOpen={setIsOpen} />

      
    </Helmet>
  );
};

export default Home;
