import React, { useState } from "react";
import "../styles/cart.css";
import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col } from "reactstrap";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { favoritesActions } from "./../redux/slices/favoriteSlice";

import { toast } from "react-toastify";
import { cartActions } from './../redux/slices/cartSlice';

const Favourites = () => {
  const favouritesItems = useSelector(
    (state) => state.favorites.favoritesItems
  );

  return (
    <Helmet title="Favorites List">
      <CommonSection title="Favorites List" />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="cart__table">
              {favouritesItems.length === 0 ? (
                <h2 className="fs-4 text-center">
                  No item in the Favourites list!
                </h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Storage</th>
                      <th>Color</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Delete</th>
                      <th>Add To Cart</th>
                    </tr>
                  </thead>

                  <tbody>
                    {favouritesItems?.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item }) => {
  const [storageItem, setStorageItem] = useState(() =>
    JSON.parse(localStorage.getItem("favourites") || "[]")
  );

  const dispatch = useDispatch();

  const deleteProduct = (item) => {
    const newStorageItem = storageItem.filter((savedId) => savedId !== item.id);
    setStorageItem(newStorageItem);
    localStorage.setItem("favourites", JSON.stringify(newStorageItem));

    dispatch(favoritesActions.deleteItem(item.id));

    toast.success("product removed from favourites list!");
  };

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        storage: item.storage,
        color: item.color,
        price: item.price,
        imgUrl: item.imgUrl,
      })
    );
    toast.success("product added to the cart");
  };

  return (
    <tr>
      <td className="align-middle">
        <img src={item.imgUrl} alt="" />
      </td>
      <td className="align-middle">{item.productName}</td>
      <td className="align-middle"> {item.storage} </td>
      <td className="align-middle"> {item.color} </td>
      <td className="align-middle"> {item.price}XAF </td>
      <td className="align-middle">{item.category.toUpperCase()}</td>
      <td className="align-middle">
        <motion.button className="btn btn-danger" onClick={(e) => deleteProduct(item)}>
          <span className="delete__product">
            <i
              className="ri-delete-bin-line"
              
            ></i>
          </span>
        </motion.button>
      </td>

      <td>
        <motion.button
          whileTap={{ scale: 1.2 }}
          className="buy__btn mt-4"
          onClick={addToCart}
        >
          Add to Cart
        </motion.button>
      </td>
    </tr>
  );
};

export default Favourites;
