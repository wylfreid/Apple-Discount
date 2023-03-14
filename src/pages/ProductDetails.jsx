import React, { useState, useRef, useEffect } from "react";

import { Row, Container, Col } from "reactstrap";

import { useParams } from "react-router-dom";
import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";

import "../styles/product-details.css";
import { motion } from "framer-motion";
import ProductList from './../components/UI/ProductList';
import { useDispatch } from 'react-redux';
import { cartActions } from './../redux/slices/cartSlice';
import { favoritesActions } from './../redux/slices/favoriteSlice';

import { toast } from 'react-toastify';

import { collection, addDoc } from "firebase/firestore";

import { db } from "../firebase.config";

import useGetData from "./../custom-hooks/useGetData";
import { doc, getDoc } from "firebase/firestore";
import UseAuth from './../custom-hooks/useAuth';

import {useSelector} from 'react-redux';



const ProductDetails = () => {

  const products = useSelector((state) => state.products.products);

  const { data: reviews} = useGetData("reviews");

  const [product, setProduct] = useState({});

  const { id } = useParams();

  const [tab, setTab] = useState("desc");
  const reviewUser = useRef('');
  const reviewMsg = useRef('')

  const dispatch = useDispatch();

  const { currentUser } = UseAuth();


  const [rating, setRating] = useState(0);

  const [color, setColor] = useState("default");
  const [storage, setStorage] = useState("default");

  const [colorPreview, setColorPreview] = useState(null);

  const [productReview, setProductReview] = useState(0);

  const [priceForSize, setPriceForSize] = useState(null);

  const docRef = doc(db, 'products', id);

  useEffect(() =>{
    const getProduct = async() =>{
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        setProduct(docSnap.data());
      }else{
        console.log('no products!');
      }
    }

    getProduct();
  }, [id])

  useEffect(()=>{

    if (reviews.length > 0) {
      
      let reviews_list = [];
  
      for (let index = 0; index < reviews.length; index++) {
        
        if(reviews[index].productId === id){
          reviews_list[index] = reviews[index];
        }
        
      }
  
      setProductReview(reviews_list);
    }

  },[reviews, id])


  const {
    imgUrl,
    productName,
    price,
    //avgRating,
    //reviews,
    description,
    shortDesc,
    category
  } = product;

  const relatedProducts = products.filter(item=> item.category === category).filter(item=> item.id !== id)

  const submitHandler = async (e) =>{
    e.preventDefault();

    if (rating > 0) {
      const reviewUserName = reviewUser.current.value;
      const reviewUserMsg = reviewMsg.current.value;
  
      // =========== add review to the firebase database ===========================
  
      try {
        const docRef = await collection(db, "reviews");
  
          const reviewObj = {
            userId: currentUser.uid,
            productId: id,
            author: reviewUserName,
            text: reviewUserMsg,
            rating: rating 
          }
  
          await addDoc(docRef,  reviewObj);
      
          toast.success('Review Submitted');
  
      } catch (error) {
        toast.error("Review not Submitted");
      }
    }else{
      toast.error("please rate!");
    }
    
    

  }

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id: id,
        productName: productName,
        storage: storage,
        color: color,
        price: priceForSize ? priceForSize : price,
        imgUrl: imgUrl,
      })
    );
    toast.success('product added to the cart');
  };

  useEffect(()=>{
    window.scrollTo(0, 0);
  }, [id])

  const handleChangeStorage = (e) =>{
    if (e.target.value === "64GO") {
      setPriceForSize(product.storage.size_64.price)
      setStorage(e.target.value)
    }else if (e.target.value === "128GO") {
      setPriceForSize(product.storage.size_128.price)
      setStorage(e.target.value)
    }else if (e.target.value === "256GO") {
      setPriceForSize(product.storage.size_256.price)
      setStorage(e.target.value)
    }
    else if (e.target.value === "512GO") {
      setPriceForSize(product.storage.size_512.price)
      setStorage(e.target.value)
    }else if (e.target.value === "1TO") {
      setPriceForSize(product.storage.size_1000.price)
      setStorage(e.target.value)
    }else{
      setPriceForSize(null)
    }
  }



  const [storageItem, setStorageItem] = useState(() => JSON.parse(localStorage.getItem("favourites") || "[]"))

  const isFavourited = storageItem.includes(id)

  const handleToggleFavourite = () => {
    if (!isFavourited) {

      const newStorageItem = [...storageItem, id]
      setStorageItem(newStorageItem);
      localStorage.setItem("favourites", JSON.stringify(newStorageItem))

      dispatch(
        favoritesActions.addItem({
          id: id,
          productName: productName,
          price: priceForSize ? priceForSize : price,
          imgUrl: imgUrl,
          category: category,
          storage: storage,
          color: color
        })
      );

      toast.success('product added to favorites');

    } else {

      const newStorageItem = storageItem.filter((savedId) => savedId !== id)
      setStorageItem(newStorageItem);
      localStorage.setItem("favourites", JSON.stringify(newStorageItem))
      dispatch(
        favoritesActions.deleteItem(id)
      );
      toast.success('product removed from favorites');
    }
  }
console.log(colorPreview);
  return (
    <Helmet title={productName}>
      <CommonSection title=""/>

      <section className="pt-0 pb-0">
        <Container>
          <Row>
            <Col lg="6" className="d-flex align-items-center justify-content-lg-end justify-content-md-center justify-content-sm-center">
              <img className="img_product-details" src={imgUrl} alt=""/>
            </Col>
            <Col lg="6">
              <div className="product__details" >
                <h2>{productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-half-s-line"></i>
                    </span>
                  </div>

                  <p>
                    {<span>({productReview.length} ratings)</span>}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product__price"> { priceForSize ? priceForSize : price}XAF</span>
                  <span>Category : {category?.toUpperCase()} </span>
                </div>
                
                <p className="mt-3"> {shortDesc} </p>

                
                <div  className='d-flex align-items-center gap-4 pt-3'>

                    {product.storage && <div className="filter__widget">
                      <select onChange={handleChangeStorage} >
                      <option style={{fontSize: '16px'}}>storage</option>

                      {
                        Object.keys(product.storage).map(function(key, value) {
                          
                          return <option style={{fontSize: '16px'}} key={key} value={product.storage[key].storage}>{product.storage[key].storage}</option>
                          
                      })
                      }
                      
                      </select>
                    </div>}

                  {product.colors?.length > 0 && <div className="filter__widget">
                    <select onChange={e=> [setColor(e.target.value), setColorPreview(e.target.value)]} className="select-color">
                    <option style={{fontSize: '18px'}}>Color</option>
                    {
                        (product.colors)?.map((color, index) =>(
                          
                          <option className=""  style={{fontSize: '18px'}} key={index} value={color.name}> {color.name}</option>
                        )
                      )
                      }
                    </select>

                  </div>}
                  <div className="d-flex align-items-center justify-content-center color__preview-container"> 

                    { colorPreview != null &&  colorPreview != "Color" && <div className="color__preview p-1" style={{background : colorPreview}}>

                    </div>}
                  </div>
                  
                </div>
                
                
                

                <div className="d-flex align-items-center gap-2">

                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn mt-4"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </motion.button>

                  <div style={{color: isFavourited ? 'coral' : '#0a1d37'}} className="d-flex align-items-center justify-content-center pt-4 pointer"
                  
                  onClick={handleToggleFavourite}>

                    <span className="fav__icon">
                        <i className="ri-heart-fill"></i>
                    </span>
                    Add to favorites
                  </div>
                </div>
                
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="12" className="col__tab-wrapper mt-md-5">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews ({productReview.length ? productReview.length : 0})
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p> {description} </p>
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                    <ul>
                      {productReview?.map((review, index) => (
                        <li key={index} className="mb-4">
                          <h6>{review.author}</h6>
                          <div className="d-flex align-items-center justify-content-start gap-1">
                            <span>{review.rating}</span> 
                            <i style={{color: "coral"}} className="ri-star-s-fill"></i>
                            <span>(rating)</span>
                          </div> 
                        
                          <p> {review.text} </p>
                        </li>
                      ))}
                    </ul>

                    <div className="review__form">
                      <h4>Leave your experience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input type="text" placeholder="Enter name" ref ={reviewUser} required />
                        </div>

                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span whileTap={{scale: 1.2}} onClick={() => setRating(1)} className={rating >= 1 ? "star__active" : "" } >
                            1<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{scale: 1.2}} onClick={() => setRating(2)} className={rating >= 2 ? "star__active" : "" }>
                            2<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{scale: 1.2}} onClick={() => setRating(3)} className={rating >= 3 ? "star__active" : "" }>
                            3<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{scale: 1.2}} onClick={() => setRating(4)} className={rating >= 4 ? "star__active" : "" }>
                            4<i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span whileTap={{scale: 1.2}} onClick={() => setRating(5)} className={rating >= 5 ? "star__active" : "" }>
                            5<i className="ri-star-s-fill"></i>
                          </motion.span>
                        </div>

                        <div className="form__group">
                          <textarea ref={reviewMsg} rows={4} placeholder="Review Message..." required/>
                        </div>

                        <motion.button
                          type="submit"
                          whileTap={{ scale: 1.2 }}
                          className="buy__btn"
                        >
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            <Col lg='12' className="mt-5">
              <h2 className="related__title">You might also like</h2>
            </Col>

            <ProductList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
