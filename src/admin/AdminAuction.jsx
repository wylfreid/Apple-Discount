import React, { useState } from "react";
import { Form, FormGroup, Container, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc,collection, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import useGetData from './../custom-hooks/useGetData';

const AdminAuction = () => {
  const { data: auctionsData, loading } = useGetData("auctions");

  const [enterTitle, setEnterTitle] = useState("");
  const [enterShortDesc, setEnterhortDesc] = useState("");
  const [enterDescription, setEnterDescription] = useState("");
  const [enterCategory, setEnterCategory] = useState("");
  const [enterPrice, setEnterPrice] = useState("");
  const [enterDate, setEnterDate] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);
  const [Loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const addAuction = async (e) => {
    e.preventDefault();
    setLoading(true);

    // =========== add product to the firebase database ===========================

    try {
      const docRef = await collection(db, "auctions");

      const storageRef = ref(
        storage,
        `auctionImages/${Date.now() + enterProductImg.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, enterProductImg).then(
        () => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            await addDoc(docRef, {
              productName: enterTitle,
              shortDesc: enterShortDesc,
              description: enterDescription,
              category: enterCategory,
              startPrice: enterPrice,
              currentPrice: enterPrice,
              endDate: enterDate,
              imgUrl: downloadURL,
              active: true,
            });
          });

          setLoading(false);

          toast.success("auction successfully added");
        }
      );
    } catch (err) {
      setLoading(false);
      toast.error("auction not added");
    }
  };

  const deleteAuction = async (id) => {
    await deleteDoc(doc(db, "auctions", id));

    toast.success("user deleted!");
  };

  const handleEdit = async (item) => {
    await updateDoc(doc(db, "auctions", item.id), { active: !item.active });
    toast.success("the status has been changed!");
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <div className="d-flex justify-content-center mb-4">
              <motion.button
                whileTap={{ scale: 1.2 }}
                type="button"
                className="buy__btn"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Add New Auction
              </motion.button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Start Price</th>
                  <th>End Date</th>
                  <th>Active</th>
                  <th>View</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {Loading ? (
                  <td colSpan="5">
                    <h3 className="py-5 d-flex justify-content-center text-center fw-bold">
                      loading.....
                    </h3>
                  </td>
                ) : auctionsData.length > 0 ? (
                  auctionsData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          className="product__img"
                          src={item.imgUrl}
                          alt=""
                        />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.category}</td>
                      <td>${item.startPrice}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <div class="form-check form-switch" >
                          <input
                          style={{cursor: "pointer"}}
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckDefault"
                            checked={item.active}
                            onChange={(e) => handleEdit(item)}
                          />
                        </div>
                      </td>
                      <td>
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          className="buy__btn"
                          type="submit"
                        >
                          View Auction
                        </motion.button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            deleteAuction(item.id);
                          }}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <td colSpan="7">
                    <h4 className="py-5 d-flex justify-content-center text-center">
                      No Auction to display!
                    </h4>
                  </td>
                )}
              </tbody>
            </table>
          </Col>
        </Row>

        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Add Auction
                </h5>
                <div
                  type="button"
                  class="close text-end fs-1"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </div>
              </div>
              <div class="modal-body">
                <Form onSubmit={addAuction}>
                  <FormGroup className="form__group">
                    <span>Product title</span>
                    <input
                      required
                      type="text"
                      placeholder="Iphone 14...."
                      value={enterTitle}
                      onChange={(e) => setEnterTitle(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <span>Short Description</span>
                    <input
                      required
                      type="text"
                      placeholder="Short Description......."
                      value={enterShortDesc}
                      onChange={(e) => setEnterhortDesc(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <span>Description</span>
                    <input
                      required
                      type="text"
                      placeholder="Description......."
                      value={enterDescription}
                      onChange={(e) => setEnterDescription(e.target.value)}
                    />
                  </FormGroup>

                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <span>Start Price</span>
                      <input
                        required
                        type="number"
                        placeholder="$100"
                        value={enterPrice}
                        onChange={(e) => setEnterPrice(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <span>Category</span>
                      <select
                        required
                        className="w-100 p-2"
                        value={enterCategory}
                        onChange={(e) => setEnterCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                        <option value="laptop">Laptop</option>
                        <option value="watch">Watch</option>
                        <option value="wireless">Wireless</option>
                      </select>
                    </FormGroup>
                  </div>

                  <FormGroup className="form__group">
                    <span>End Date</span>
                    <input
                      required
                      type="datetime-local"
                      placeholder="Description......."
                      value={enterDate}
                      onChange={(e) => setEnterDate(e.target.value)}
                    />
                  </FormGroup>

                  <div>
                    <FormGroup className="form__group">
                      <span>Product Image</span>
                      <input
                        type="file"
                        onChange={(e) => setEnterProductImg(e.target.files[0])}
                        required
                      />
                    </FormGroup>
                  </div>

                  <motion.button
                    whileTap={{ scale: 1.2 }}
                    className="buy__btn"
                    type="submit"
                  >
                    Add Auction
                  </motion.button>
                </Form>
              </div>
              <div class="modal-footer"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdminAuction;
