
import React from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Container, Row, Col } from "reactstrap";



import heroImg1 from "../../assets/images/i-background-13.jpg";

const HomeCarousel = () => {
    const year = new Date().getFullYear();
  var settings = {
    lazyLoad: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };
  return (


        <Slider {...settings} >
        <div className="slide__content" >
        <Container>
          <Row>
              

                <Col lg="6" md="6">
                  <div className="hero__content">
                    <p className="hero__subtitle"> Trending products in {year} </p>
                    <h2>Order your products from Cameroon</h2>
                    <p className="hero__desc">
                      Apple products at the best prices.
                    </p>
                    <Link to="/shop">
                        <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                        SHOP NOW
                        </motion.button>
                    </Link>
                  </div>
              </Col>
          </Row>
        </Container>
              <img
              className='d-block w-100 '
                
                src={
                heroImg1
                }
            />
        </div>
        <div className="slide__content">
        <Container>
          <Row>
              

                <Col lg="6" md="6">
                  <div className="hero__content">
                    <p className="hero__subtitle"> Trending products in {year} </p>
                    <h2>Orders processed in Canada</h2>
                    <p className="hero__desc">
                    All our products are Apple Canada certified.
                    </p>

                    <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                      <Link to="/shop">SHOP NOW</Link>
                    </motion.button>
                  </div>
              </Col>
          </Row>
        </Container>
        <img
              className='d-block w-100 '
                
                src={
                heroImg1
                }
            />
        </div>
        <div className="slide__content"> 
        <Container>
          <Row>
              
                <Col lg="6" md="6">
                  <div className="hero__content">
                    <p className="hero__subtitle"> Trending products in {year} </p>
                    <h2>You can track the status of your order</h2>
                    <p className="hero__desc">
                    We update your order status in real time.
                    </p>

                    <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                      <Link to="/shop">SHOP NOW</Link>
                    </motion.button>
                  </div>
               
              </Col>
          
          </Row>
        </Container>
        <img
              className='d-block w-100 '
                
                src={
                heroImg1
                }
            />
        </div>

        <div className="slide__content"> 
        <Container>
          <Row>
              
                <Col lg="6" md="6">
                  <div className="hero__content">
                    <p className="hero__subtitle"> Trending products in {year} </p>
                    <h2>Delivery anywhere in Cameroon</h2>
                    <p className="hero__desc">
                    Our deliverers will contact you to fix the place of delivery.
                    </p>

                    <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                      <Link to="/shop">SHOP NOW</Link>
                    </motion.button>
                  </div>
               
              </Col>
          
          </Row>
        </Container>
        <img
              className='d-block w-100 '
                
                src={
                heroImg1
                }
            />
        </div>
        
        </Slider>
  
  );
}
export default HomeCarousel;