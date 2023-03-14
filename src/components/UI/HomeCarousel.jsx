
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
                    <h2>Apple products at the best prices</h2>
                    <p className="hero__desc">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatem, magni.
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
                    <h2>Apple products at the best prices</h2>
                    <p className="hero__desc">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatem, magni.
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
                    <h2>Apple products at the best prices</h2>
                    <p className="hero__desc">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatem, magni.
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