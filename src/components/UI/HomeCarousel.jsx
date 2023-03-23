
import React, { useState, useEffect} from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Container, Row, Col } from "reactstrap";



import heroImg1 from "../../assets/images/i-background-13.jpg";

const HomeCarousel = () => {
  const [play, setPlay] = useState(false);

  useEffect(()=>{
    setPlay(true)
  })
    const year = new Date().getFullYear();
  var settings = {
    lazyLoad: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: play,
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
                    <p className="hero__subtitle"> Produits tendance en {year} </p>
                    <h2>Commandez vos produits depuis le Cameroun</h2>
                    <p className="hero__desc">
                      Produits Apple aux meilleurs prix.
                    </p>
                    <Link to="/shop">
                        <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                        ACHETEZ MAINTENANT
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
                    <p className="hero__subtitle"> Produits tendance en {year} </p>
                    <h2>Commandes traitées au Canada</h2>
                    <p className="hero__desc">
                    Tous nos produits sont certifiés Apple Canada.
                    </p>

                    <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                      <Link to="/shop">ACHETEZ MAINTENANT</Link>
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
                    <p className="hero__subtitle"> Produits tendance en {year} </p>
                    <h2>Vous pouvez suivre l'état de votre commande</h2>
                    <p className="hero__desc">
                    Nous mettons à jour l'état de votre commande en temps réel.
                    </p>

                    <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                      <Link to="/shop">ACHETEZ MAINTENANT</Link>
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
                    <p className="hero__subtitle"> Produits tendance en {year} </p>
                    <h2>Livraison partout au Cameroun</h2>
                    <p className="hero__desc">
                    Nos livreurs vous contacteront pour fixer le lieu de livraison.
                    </p>

                    <motion.button whileTap={{ scale: 1.2 }} className="buy__btn mt-3">
                      <Link to="/shop">ACHETEZ MAINTENANT</Link>
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