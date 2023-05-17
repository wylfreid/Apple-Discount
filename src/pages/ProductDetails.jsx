import React, { useState, useRef, useEffect } from "react";

import { Row, Container, Col } from "reactstrap";

import { useParams } from "react-router-dom";
import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";

import "../styles/product-details.css";
import { motion, AnimatePresence } from "framer-motion";
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


const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;


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

  const btnPreviewRef = useRef()
  const [rating, setRating] = useState(0);

  const [color, setColor] = useState(null);
  const [storage, setStorage] = useState(null);

  const [colorPreview, setColorPreview] = useState(null);

  const [productReview, setProductReview] = useState([]);

  const [priceForSize, setPriceForSize] = useState(null);

  

  const docRef = doc(db, 'products', id);

  useEffect(() =>{
    const getProduct = async() =>{
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        setProduct(docSnap.data());
      }else{
        console.log('no product!');
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

    if (product.colors?.length > 0 && product.storage) {
      if ((!color || color === "default") && product.colors?.length > 0) {
        toast.error('Veuillez choisir une couleur');
      }else if((!storage || storage === "default") && product.storage){
        toast.error('Veuillez choisir un stockage');
      }
      else{
        dispatch(
          cartActions.addItem({
            id: id,
            productName: productName,
            storage: storage ? storage : "Aucun",
            color: getColor(),
            price: priceForSize ? priceForSize : price,
            imgUrl: imgUrl,
          })
        );
        toast.success('produit ajouté au panier');
        
      }
    }else{
      dispatch(
        cartActions.addItem({
          id: id,
          productName: productName,
          price: priceForSize ? priceForSize : price,
          imgUrl: imgUrl,
        })
      );
      toast.success('produit ajouté au panier');
    }


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
      setStorage("default")
    }
  }

  const getColor = () =>{
    let colors = product?.colors;                                                      
    const result = colors?.filter(item=> item.code === color)

    return result[0].name;
  }

  const [isLoaded, setIsLoaded] = useState(false);

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
          storage: storage ? storage : "default",
          color: color ? getColor() : "default"
        })
      );

      toast.success('produit ajouté aux favories');

    } else {

      const newStorageItem = storageItem.filter((savedId) => savedId !== id)
      setStorageItem(newStorageItem);
      localStorage.setItem("favourites", JSON.stringify(newStorageItem))
      dispatch(
        favoritesActions.deleteItem(id)
      );
      toast.success('produit supprimé de la liste favorites!');
    }
  }

  return (
    <Helmet title={productName}>
      <CommonSection title=""/>

      <section className="pt-0 pb-0">
        <Container>
          <Row>
            <Col lg="6" whileTap={{scale: 1.2}}  className="d-flex align-items-center justify-content-lg-end justify-content-center">
              
              <motion.div className="img_product-details"
              
              initial={false}
              animate={
                isLoaded 
                  ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
                  : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
              }
              transition={{ duration: 1, delay: 1 }}
              onLoad={() => setIsLoaded(true)}>

                <motion.img whileTap={{scale: 0.95}} style={{cursor:"pointer"}} onClick={() => btnPreviewRef.current.click()} className="w-100" src={imgUrl} alt=""
                
                
                />
              </motion.div>
            </Col>
            <Col lg="6">
              <div className="product__details" >
                <h2>{productName}</h2>
                <div className="product__rating d-flex align-items-center mb-3">
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
                    {/* {<span>({productReview.length} ratings)</span>} */}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product__price"> { priceForSize ? priceForSize : price}XAF</span>
                  <span>Categorie : {category?.toUpperCase()} </span>
                </div>
                
                <p className="mt-3"> {shortDesc} </p>

                
                <div  className='d-flex align-items-center gap-4 pt-3'>

                    {product.storage && <div className="filter__widget">
                      <select onChange={handleChangeStorage} >
                      <option style={{fontSize: '16px'}} value="default">stockage</option>

                      {
                        Object.keys(product.storage).map(function(key, value) {
                          
                          return <option style={{fontSize: '16px'}} key={key} value={product.storage[key].storage}>{product.storage[key].storage}</option>
                          
                      })
                      }
                      
                      </select>
                    </div>}

                  {product.colors?.length > 0 && <div className="filter__widget">
                    <select onChange={e=> [setColor(e.target.value), setColorPreview(e.target.value)]} className="select-color">
                    <option style={{fontSize: '18px'}} value="default">Couleur</option>
                    {
                        (product.colors)?.map((color, index) =>(
                          
                          <option className=""  style={{fontSize: '18px'}} key={index} value={color.code}> {color.name}</option>
                        )
                      )
                      }
                    </select>

                  </div>}
                  <div className="d-flex align-items-center justify-content-center color__preview-container"> 

                    { colorPreview != null &&  colorPreview != "Couleur" && colorPreview != "default" && <div className="color__preview p-1" style={{background : colorPreview}}>

                    </div>}
                  </div>
                  
                </div>
                
                
                

                <div className="d-flex align-items-center gap-2">

                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn mt-4"
                    onClick={addToCart}
                  >
                    Ajouter au panier
                  </motion.button>

                  <div style={{color: isFavourited ? 'coral' : '#0a1d37'}} className="d-flex align-items-center justify-content-center pt-4 pointer"
                  
                  onClick={handleToggleFavourite}>

                    <span className="fav__icon">
                        <i className="ri-heart-fill"></i>
                    </span>
                    Ajouter aux favories
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
                  Commentaires ({productReview.length ? productReview.length : 0})
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
                      <h4>Laissez votre expérience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input type="text" placeholder="Votre nom..." ref ={reviewUser} required />
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
                          <textarea ref={reviewMsg} rows={4} placeholder="Votre commentaire..." required/>
                        </div>

                        <motion.button
                          type="submit"
                          whileTap={{ scale: 1.2 }}
                          className="buy__btn"
                        >
                          Envoyer
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            {relatedProducts.length > 0 && <Col lg='12' className="mt-4 mb-5">
              <h2 className="related__title">Vous pourriez aussi aimer</h2>
            </Col>}

            <ProductList data={relatedProducts} />
          </Row>
        </Container>
      </section>

      


      <button
        ref={btnPreviewRef}
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal1"
      ></button>
        

        <div
        className="modal fade auction__popup"
        id="exampleModal1"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog  modal-dialog-centered d-flex align-items-center justify-content-center" role="document">
          
        <div className="modal-content bg-transparent d-flex align-items-center justify-content-center" style={{border: "none"}}>

            <AnimatePresence>
          
            <motion.div className="tilt-box-wrap d-flex align-items-center justify-content-center">
		<span className="t_over"></span>
		<span className="t_over"></span>
		<span className="t_over"></span>
		<span className="t_over"></span>
		<span className="t_over"></span>
		<span className="t_over"></span>
		<span className="t_over"></span>
		<span className="t_over"></span>
		<span className="t_over"></span>
		<div className="tilt-box">
			
              <motion.img  className="product__img-preview h-100" src={imgUrl} alt="" style={{ width:"auto", zIndex: "10000" }}/>
		</div>
	</motion.div>
            

            
              
             
            
          
        </AnimatePresence>
          </div>
            
          </div>
        
      </div>
    </Helmet>
  );
};

export default ProductDetails;
