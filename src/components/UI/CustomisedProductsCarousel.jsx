
import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Container, Row, Col } from "reactstrap";
import '../../styles/carousel-Product-page.css'
import customisedProducts from './../../assets/data/customisedProducts';



const CustomisedProductsCarousel = () => {
    const btnCustomRef = useRef()

    const isClient = typeof window === "object";
  
    function getSize() {
      return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
      };
    }
  
    const [windowSize, setWindowSize] = useState(getSize);
  
    useEffect(() => {
      if (!isClient) {
        return false;
      }
  
      function handleResize() {
        setWindowSize(getSize());
      }
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount
  

  const [diplayNumber, setDiplayNumber] = useState(5);

  useEffect(() =>{
    //console.log(windowSize);
    if (windowSize.width <= 400) {
      setDiplayNumber(1)
    }else if (windowSize.width <= 576 && windowSize.width >= 400) {
      setDiplayNumber(2)
    }else if (windowSize.width <= 793 && windowSize.width >= 576) {
      setDiplayNumber(3)
    }else if (windowSize.width <= 992 && windowSize.width >= 793) {
      setDiplayNumber(4)
    }else{
      setDiplayNumber(5)
    }

  }, [windowSize])

  var settings = {
    lazyLoad: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: diplayNumber,
    slidesToScroll: 1,
    autoplay:true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    centerMode: true
  };

  return (

    <div>

      <button
        ref={btnCustomRef}
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal1"
      ></button>

      { customisedProducts.length > 0 && <section>
          
            <Container>
              <Row>
              <Col lg="12" className="text-center">
                <h2 className="section__title mb-5"> Produits Customisés </h2>
              </Col>
              <Slider {...settings} >
          
                {customisedProducts.map((product, index)=>(
              <div onClick={e => btnCustomRef.current.click()} key={index} className='custom__product d-flex align-items-center justify-content-center'>
  
                <img style={{cursor: "pointer"}}   src={product.image} alt="" />
              </div>
                ))}
              
              </Slider>
              </Row>
            </Container>
        </section>}
    </div>


        
  
  );
}
export default CustomisedProductsCarousel;