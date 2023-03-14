import React, { useState, useEffect } from "react";
import { Form, FormGroup, Container, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc,collection, addDoc, deleteDoc, updateDoc, query, orderBy, onSnapshot, limit, serverTimestamp } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import useGetData from './../custom-hooks/useGetData';

const AdminAuction = () => {
  const { data: auctionsData, loading } = useGetData("auctions");

  const [auctions, setAuctions] = useState([]);

  const [enterTitle, setEnterTitle] = useState("");
  const [enterShortDesc, setEnterhortDesc] = useState("");
  const [enterDescription, setEnterDescription] = useState("");
  const [enterCategory, setEnterCategory] = useState("");
  const [enterPrice, setEnterPrice] = useState("");
  const [enterStep, setEnterStep] = useState("");
  const [enterStartDate, setEnterStartDate] = useState("");
  const [enterDate, setEnterDate] = useState("");
  const [enterPosition, setEnterPosition] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);
  const [Loading, setLoading] = useState(false);

  const [selectedAuction, setSelectedAuction] = useState(null);

  const [attendees, setAttendees] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    let interval = setInterval(() => {
      for (let index = 0; index < auctions.length; index++) {
        if (auctions.length > 0 && auctions[index]?.active === true && new Date(auctions[index]?.endDate) < new Date()) {
          /* if (auctions[index]?.currentAttendeeId) {
            addorder(auctions[index])
          } */
          handleDesactive(auctions[index])
          
        }

        if (auctions.length > 0 && auctions[index]?.active === false && new Date(auctions[index]?.startDate) < new Date() && new Date(auctions[index]?.endDate) > new Date())  {
          handleActive(auctions[index])
          
        }
        
      }

    }, 1000);
  })

  useEffect(()=>{
    setAuctions(auctionsData);
  },[auctionsData])

  /* const getAttendee = (uid) =>{
    let result = attendees.filter(
      (item) => item.uid === uid
    );
    return result[0];
  } */

  /* const addorder = async (auction) => {

    // =========== add order to the firebase database ===========================

    try {
      const docRef = await collection(db, "orders");

      const order = {
        userId: auction.currentAttendeeId,
        userName: auction.currentAttendeeName,
        userEmail: getAttendee(auction.currentAttendeeId)?.email,
        userPhone: "/",
        userCountry: "cameroun",
        userAdress: "/",
        userCity: "/",
        userPostalCode: "/",
        products: [{productName : auction.productName}],
        totalQty: "1",
        totalAmount: auction.currentPrice,
        status: "progress",
      };

      await addDoc(docRef,  order);

      toast.success("order successfully added");

    } catch (error) {
 
    }

  }; */


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
              step: enterStep,
              startDate: enterStartDate,
              endDate: enterDate,
              imgUrl: downloadURL,
              position: enterPosition,
              active: false,
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

  const deleteAttendee = async (id) => {
    await deleteDoc(doc(db, "attendees", id));

    toast.success("attendee deleted!");
  };

  const handleDesactive = async (item) => {
    let temp = auctions

    for (let index = 0; index < temp.length; index++) {
      if (temp[index].id === item.id) {
        temp[index].active = false
      }
    }

    setAuctions(temp)

    await updateDoc(doc(db, "auctions", item.id), { active: false });
    toast.success("the status has been changed!");

  };


  const handleActive = async (item) => {
    let temp = auctions

    for (let index = 0; index < temp.length; index++) {
      if (temp[index].id === item.id) {
        temp[index].active = true
      }
    }

    setAuctions(temp)

    await updateDoc(doc(db, "auctions", item.id), { active: true });
    toast.success("the status has been changed!");

  };

  const handleEdit = async (item) => {
    await updateDoc(doc(db, "auctions", item.id), { active: !item.active });
    toast.success("the status has been changed!");
  };


  useEffect(() => {
    const q = query(
      collection(db, "attendees"),
      orderBy("createdAt"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let participants = [];
      QuerySnapshot.forEach((doc) => {
        participants.push({ ...doc.data(), id: doc.id });
      });

      setAttendees(participants)
    });
    return () => unsubscribe;
  }, []);

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
                  <th>Start Date</th>
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
                      <td>{item.startPrice}XAF</td>
                      <td>{item.startDate}</td>
                      <td>{item.endDate}</td>
                      <td>
                        <div className="form-check form-switch" >
                          <input
                          style={{cursor: "pointer"}}
                            className="form-check-input"
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
                          data-toggle="modal"
                          data-target="#exampleModal1"
                          onClick={e=> setSelectedAuction(item)}
                        >
                          View Auction
                        </motion.button>
                      </td>
                      <td>
                        <motion.button
                        whileTap={{ scale: 1.2 }}
                          onClick={() => {
                            deleteAuction(item.id);
                          }}
                          className="btn btn-danger"
                        >
                          Delete
                        </motion.button>
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
        className="modal fade "
        id="exampleModal1"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div
              type="button"
              className="close  position-absolute text-end fs-1"
              data-dismiss="modal"
              aria-label="Close"
              style={{ right: 10, top: 0, zIndex: 1000 }}
            >
              <span aria-hidden="true">&times;</span>
            </div>
            <div className="modal-body p-4">
              <div className="text-center">
                <h5> {selectedAuction?.productName} </h5>

        <Row className="mt-4">
          <Col lg="4">
            <div className="revenue__box h-100 p-4">
              <h5>Total attendees</h5>
              <span>{attendees?.length}</span>
            </div>
          </Col>
          <Col lg="4">
            <div className="orders__box h-100 p-4">
              <h5>current attendee</h5>
              <span>{selectedAuction?.currentAttendeeName}</span>
            </div>
          </Col>
          <Col lg="4">
            <div className="products__box h-100 p-4">
              <h5>CurrentPrice</h5>
              <span>{selectedAuction?.currentPrice}XAF</span>
            </div>
          </Col>
        </Row>

        <Row className="mt-4 overflow-auto" style={{height:"250px"}}>
          <table className="table">
            <thead>
                <tr>
                  <th>Profil</th>
                  <th>UserName</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {
                    attendees.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            className="product__img"
                            src={item.photoURL}
                            alt=""
                          />
                        </td>
                        <td>{item.displayName}</td>
                        
                        <td>
                          <motion.button
                            whileTap={{ scale: 1.2 }}
                            onClick={() => {
                              deleteAttendee(item.id);
                            }}
                            className="btn btn-danger"
                          >
                            Delete
                          </motion.button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
          </table>
        </Row>
                
              </div>
            </div>
          </div>
        </div>
      </div>            


        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Auction
                </h5>
                <div
                  type="button"
                  className="close text-end fs-1"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </div>
              </div>
              <div className="modal-body">
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
                        placeholder="1000XAF"
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

                  <div className="d-flex align-items-center justify-content-between gap-2">

                    <FormGroup className="form__group">
                      <span>Start Date</span>
                      <input
                        required
                        type="datetime-local"
                        value={enterStartDate}
                        onChange={(e) => setEnterStartDate(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group">
                      <span>End Date</span>
                      <input
                        required
                        type="datetime-local"
                        value={enterDate}
                        onChange={(e) => setEnterDate(e.target.value)}
                      />
                    </FormGroup>
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-5">

                  <FormGroup className="form__group w-50">
                      <span>Step</span>
                      <input
                        required
                        type="number"
                        placeholder="10000XAF"
                        value={enterStep}
                        onChange={(e) => setEnterStep(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <span>Position</span>
                      <input
                        required
                        type="number"
                        placeholder="1"
                        value={enterPosition}
                        onChange={(e) => setEnterPosition(e.target.value)}
                      />
                    </FormGroup>
                  </div>


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
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AdminAuction;
