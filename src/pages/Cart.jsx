import React,{useEffect} from "react";
import "../styles/cart.css";
import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "./../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';

import { toast } from "react-toastify";


const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);


  const navigate = useNavigate();

  useEffect(()=>{
    window.scrollTo(0, 0);
  })

  const goToCheckOut = () =>{
    if (cartItems.length > 0) {
      navigate("/checkout");
    }else{
      toast.error("Veuillez ajouter un article au panier!")
    }
  }

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />

      <section>
        <Container>
          <Row>
            <Col lg="9" className="cart__table">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No item in the cart!</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Storage</th>
                      <th>Color</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div className="cart__subTotal">
                <h6 className="d-flex align-items-center justify-content-between">
                  SubTotal
                  <span className="fs-4 fw-bold">{totalAmount}XAF</span>
                  </h6>
                
              </div>
              <p className="fs-6 mt-2 blink_me">Payment will be made on delivery</p>
              <p className="fs-6 mt-2">You can track your order in your profile history.</p>
              <p className="fs-6 mt-2">We will contact you for delivery</p>
              <div>
                <motion.button whileTap={{scale: 0.9}} className="buy__btn w-100 mt-5 " onClick={goToCheckOut}>
                  <span>Checkout</span>
                </motion.button>

                <Link to='/shop'>
                  <motion.button whileTap={{scale: 0.9}} className="buy__btn w-100 mt-3">
                    Continue Shopping
                  </motion.button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item }) => {

  const dispatch = useDispatch();

  const deleteProduct = () =>{
    dispatch(cartActions.deleteItem(item.id));
    toast.success('product removed from cart');
  }
  return (
    <tr>
      <td className='align-middle'>
        <img src={item.imgUrl} alt="" />
      </td>
      <td className='align-middle'>{item.productName}</td>
      <td className='align-middle'>{item.storage}</td>
      <td className='align-middle'>{item.color}</td>
      <td className='align-middle'> {item.price} </td>
      <td className='align-middle'> {item.quantity} </td>
      <td className='align-middle'>
      <motion.button className="btn btn-danger" onClick={deleteProduct}>
          <span className="delete__product">
            <i
              className="ri-delete-bin-line"
            ></i>
          </span>
        </motion.button>
      </td>
    </tr>
  );
};

export default Cart;
