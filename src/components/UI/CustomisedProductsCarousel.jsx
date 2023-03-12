
import React, { useState, useEffect } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Container, Row, Col } from "reactstrap";
import '../../styles/carousel-Product-page.css'


import heroImg1 from "../../assets/images/i-background-13.jpg";
import products from './../../assets/data/products';

const CustomisedProductsCarousel = () => {
    const year = new Date().getFullYear();
  var settings = {
    lazyLoad: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay:true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    centerMode: true
  };
  return (


        <Slider {...settings} >
        
          {products.filter(
        (item) => item.category === "mobile"
      ).map((product, index)=>(
        <div className='custom__product d-flex align-items-center justify-content-center'>

          <img key={index}  src={product.imgUrl} alt="" />
        </div>
          ))}
        
        </Slider>
  
  );
}
export default CustomisedProductsCarousel;