import React, {useState} from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";

import { Col } from "reactstrap";
import { Link, useNavigate} from "react-router-dom";
import Logo from "../../assets/images/logo.png";

/* import { toast } from "react-toastify";

import { useDispatch } from "react-redux";

import { cartActions } from "../../redux/slices/cartSlice"; */

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;


const ProductCard = ({ item }) => {
 /*  const dispatch = useDispatch(); */
 const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate()

  const addToCart = () => {
    /* dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: item.price,
        imgUrl: item.imgUrl,
      })
    );
    toast.success('produit ajouté au panier'); */

    navigate(`/shop/${item.id}`)
    
  };

  return (
    <Col lg="3" md="4" className="mb-5" style={{height: isLoaded ? "auto" : "369.13px"}}>
      <div className="product__item h-100 ">
        <div className="product__img" style={{height: "60%"}}
        onLoad={() => setIsLoaded(true)}>
        
      
          <Link to={`/shop/${item.id}`}>
            {item.imgUrl ? 
              <motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt='' />
            
              : <div className="spinner-grow" role="status"></div>
            }
          </Link>
        </div>

        <div className="p-2 product__info" style={{height: "25%"}}>
          <h3 className="product__name">
            <Link to={`/shop/${item.id}`}> {item.productName} </Link>
          </h3>
          <span> {item.category} </span>
        </div>

        <div
          className="product__card-bottom d-flex align-items-center
         justify-content-between p-2"
         style={{height: item.imgUrl ? "15%" : "50%"}}
        >
          <span className="price"> {Number(item.price?.split(".").join("")).toLocaleString('fr-FR')}XAF </span>
          <motion.span whileTap={{ scale: 1.2 }} onClick={addToCart}>
            <i className="ri-add-line"></i>
          </motion.span>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
