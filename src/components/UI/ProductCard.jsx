import React from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";

import { Col } from "reactstrap";
import { Link, useNavigate} from "react-router-dom";

/* import { toast } from "react-toastify";

import { useDispatch } from "react-redux";

import { cartActions } from "../../redux/slices/cartSlice"; */

const ProductCard = ({ item }) => {
 /*  const dispatch = useDispatch(); */

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
    <Col lg="3" md="4" className="mb-5">
      <div className="product__item h-100 ">
        <div className="product__img" style={{height: "60%"}}>
          <Link to={`/shop/${item.id}`}>
            <motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt="" />
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
         style={{height: "15%"}}
        >
          <span className="price"> {item.price}XAF </span>
          <motion.span whileTap={{ scale: 1.2 }} onClick={addToCart}>
            <i className="ri-add-line"></i>
          </motion.span>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
