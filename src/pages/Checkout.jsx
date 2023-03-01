import React, { useEffect, useState } from "react";
import "../styles/ckeckout.css";

import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col, Form, FormGroup } from "reactstrap";
import { motion } from "framer-motion";

import { cartActions } from "./../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { db } from "./../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UseAuth from './../custom-hooks/useAuth';

const Checkout = () => {

  const { currentUser } = UseAuth();

  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();

  const [enterName, setEnterName] = useState("");
  const [enterPhone, setEnterPhone] = useState("");
  const [enterEmail, setEnterEmail] = useState("");
  const [enterAdress, setEnterAdress] = useState("");
  const [enterCity, setEnterCity] = useState("");
  const [enterPostalCode, setEnterPostalCode] = useState("");
  const [enterCountry, setEnterCountry] = useState("");

  const [products, setProducts] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let cartProducts = [{}];
    for (let index = 0; index < cartItems.length; index++) {
      cartProducts[index] = {
        id: cartItems[index].id,
        productName: cartItems[index].productName,
        quantity: cartItems[index].quantity,
        price: cartItems[index].price,
      };
    }

    setProducts(cartProducts);

  }, [cartItems]);

  const addorder = async (e) => {
    e.preventDefault();

    if (enterName != "" && enterPhone != "" && enterEmail != "" && enterAdress != "" && enterCity != "" && enterPostalCode != "" && enterCountry != "") {
      
    
    setLoading(true);

    // =========== add order to the firebase database ===========================

    try {
      const docRef = await collection(db, "orders");

      const order = {
        userId: currentUser.uid,
        userName: enterName,
        userPhone: enterPhone,
        userEmail: enterEmail,
        userAdress: enterAdress,
        userCity: enterCity,
        userPostalCode: enterPostalCode,
        userCountry: enterCountry,
        products,
        totalQty,
        totalAmount,
        status: "progress",
      };

      await addDoc(docRef,  order);

      setLoading(false);

      toast.success("order successfully added");

      cleanCart();

      navigate("/shop");
    } catch (error) {
      setLoading(false);
      toast.error("order not added");
    }

      }else{
        toast.error("Veuillez remplir tous les champs!")
      }
  };

  const cleanCart = () =>{
    dispatch(cartActions.deleteAllItems());
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />

      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12">
                <h4 className="py-5">Loading......</h4>
              </Col>
            ) : (
              <>
                <Col lg="8">
                  <h6 className="mb-4 fw-bold">Billing Information</h6>

                  <Form className="billing__form">
                    <FormGroup className="form__group">
                      <input
                        required
                        type="text"
                        placeholder="Enter your name"
                        value={enterName}
                        onChange={(e) => setEnterName(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group">
                      <input
                        required
                        type="email"
                        placeholder="Enter your email"
                        value={enterEmail}
                        onChange={(e) => setEnterEmail(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group">
                      <input
                        required
                        type="number"
                        placeholder="Phone number"
                        value={enterPhone}
                        onChange={(e) => setEnterPhone(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group">
                      <input
                        required
                        type="text"
                        placeholder="Street address"
                        value={enterAdress}
                        onChange={(e) => setEnterAdress(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group">
                      <input
                        required
                        type="text"
                        placeholder="City"
                        value={enterCity}
                        onChange={(e) => setEnterCity(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group">
                      <input
                        required
                        type="text"
                        placeholder="Postal Code"
                        value={enterPostalCode}
                        onChange={(e) => setEnterPostalCode(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group">
                      <input
                        required
                        type="text"
                        placeholder="Country"
                        value={enterCountry}
                        onChange={(e) => setEnterCountry(e.target.value)}
                      />
                    </FormGroup>
                  </Form>
                </Col>
                <Col lg="4">
                  <div className="checkout__cart">
                    <h6>
                      Total Qty: <span> {totalQty} items</span>
                    </h6>
                    <h6>
                      SubTotal: <span>${totalAmount} </span>
                    </h6>
                    <h6>
                      <span>
                        Shipping: <br /> Free Shipping
                      </span>
                      <span>$0</span>
                    </h6>
                    <h4>
                      Total Cost: <span>${totalAmount}</span>
                    </h4>

                    <motion.button
                      onClick={addorder}
                      type="submit"
                      whileTap={{ scale: 1.2 }}
                      className="mt-5 buy__btn auth__btn bg-light  w-100"
                    >
                      Place an order
                    </motion.button>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
