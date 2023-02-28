import React,{useEffect} from "react";
import "../styles/cart.css";
import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "./../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

import { toast } from "react-toastify";


const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  useEffect(()=>{
    window.scrollTo(0, 0);
  })

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />

      <section>
        <Container>
          <Row>
            <Col lg="9" className="cart__table">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No item to the cart!</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
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
              <div>
                <h6 className="d-flex align-items-center justify-content-between">
                  SubTotal
                  <span className="fs-4 fw-bold">${totalAmount}</span>
                  </h6>
                
              </div>
              <p className="fs-6 mt-2">taxes and shipping will calculate in checkout</p>
              <p className="fs-6 mt-2">Payment will be made on delivery</p>
              <div>
                <motion.button whileTap={{scale: 0.9}} className="buy__btn w-100 mt-5 ">
                  <Link to='/checkout'>Checkout</Link>
                </motion.button>

                <motion.button whileTap={{scale: 0.9}} className="buy__btn w-100 mt-3">
                  <Link to='/shop'>Continue Shopping</Link>
                </motion.button>
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
      <td>
        <img src={item.imgUrl} alt="" />
      </td>
      <td>{item.productName}</td>
      <td> {item.price} </td>
      <td> {item.quantity} </td>
      <td>
        <span className="delete__product">
          <i
            className="ri-delete-bin-line"
            onClick={deleteProduct}
          ></i>
        </span>
      </td>
    </tr>
  );
};

export default Cart;
