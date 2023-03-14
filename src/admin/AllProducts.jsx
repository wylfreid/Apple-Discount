import React from "react";
import { Container, Row, Col } from "reactstrap";
import { db } from "../firebase.config";

import useGetData from "./../custom-hooks/useGetData";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

const AllProducts = () => {
  const { data: productsData, loading } = useGetData("products");

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));

    toast.success("Deleted!");
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <div className="d-flex justify-content-center">
            <Link to="/dashboard/add-product">
              <motion.button
                whileTap={{ scale: 1.2 }}
                className="buy__btn  mb-4"
              >
                Add Product
              </motion.button>
              </Link>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Trending</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                  <td colSpan="6">
                    <h3 className="py-5 d-flex justify-content-center text-center fw-bold">
                      loading.....
                    </h3>
                  </td>
                </tr>
                ) : productsData.length > 0 ? (
                  productsData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img className="product__img" src={item.imgUrl} alt="" />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.category}</td>
                      <td>{item.trending ? "activated" : "disabled"}</td>
                      <td>{item.price}XAF</td>
                      <td>
                        <button
                          onClick={() => {
                            deleteProduct(item.id);
                          }}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <h4 className="py-5 d-flex justify-content-center text-center">
                        No Product to display!
                      </h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AllProducts;
