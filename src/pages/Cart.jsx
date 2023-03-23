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
      <CommonSection title="Panier d'achats" />

      <section>
        <Container>
          <Row>
            <Col lg="9" className="cart__table">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 my-4 text-center">Aucun article dans le panier!</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Nom</th>
                      <th>Stockage</th>
                      <th>Couleur</th>
                      <th>Prix</th>
                      <th>Quantité</th>
                      <th>Supprimer</th>
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
                Sous-total:
                  <span className="fs-4 fw-bold">{totalAmount}XAF</span>
                  </h6>
              </div>
              <p className="fs-6 py-2 mt-2 blink_me d-flex align-items-center gap-1"><i className="fs-5 ri-error-warning-line"></i> Le paiement se fera à la livraison</p>
              <p className="fs-6 mt-2">Vous pouvez suivre votre commande dans l'historique de votre profil.</p>
              <p className="fs-6 mt-2">Nous vous contacterons pour la livraison</p>
              <div>
                <motion.button whileTap={{scale: 0.9}} className="buy__btn w-100 mt-5 " onClick={goToCheckOut}>
                  <span>Checkout</span>
                </motion.button>

                <Link to='/shop'>
                  <motion.button whileTap={{scale: 0.9}} className="buy__btn w-100 mt-3">
                  Poursuivre les achats
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
    toast.success('produit supprimé du panier');
  }
  return (
    <tr>
      <td className='align-middle'>
        <img src={item.imgUrl} alt="" />
      </td>
      <td className='align-middle'>{item.productName}</td>
      <td className='align-middle'>{item.storage ? item.storage : "Aucun"}</td>
      <td className='align-middle'>{item.color ? item.color : "Aucune"}</td>
      <td className='align-middle'> {item.price}XAF </td>
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
