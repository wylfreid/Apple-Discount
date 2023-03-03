import React, { useState, useEffect, useRef } from "react";

import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col,FormGroup } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

import { doc,collection, addDoc, updateDoc } from "firebase/firestore";



import "../styles/auction.css";
import ClockVariant from "./../components/UI/ClockVariant";
import { db } from "../firebase.config";
import useGetData from "./../custom-hooks/useGetData";
import { toast } from "react-toastify";
import UseAuth from "./../custom-hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auctionsActions } from './../redux/slices/auctionSlice';

const Auction = () => {
  const auctions = useSelector((state) => state.auctions.auctionItems);
  const { currentUser } = UseAuth();

  const users = useSelector((state) => state.users.users);

  const { data: usersList} = useGetData("users");

  const { data: bidInfos} = useGetData("bidInfos");

  const [selectedAuction, setSelectedAuction] = useState(null);

  const [participants, setParticipants] = useState([]);

  const [bidInfoLenght, setBidInfoLenght] = useState(0);

  const [bidAmount, setBidAmount] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const leaveAution = () => {
    window.scrollTo(0, 0);

    const user = users.filter((user) => user.uid === currentUser.uid);
  };

  const handleToggleSubscribe = async (user) => {
    await updateDoc(doc(db, "users", user.uid), {
      participant: !user.participant,
    });
    toast.warning("You left the auction!");
  };

  useEffect(()=>{
    if (bidInfos.length > 0 && currentUser.uid !== bidInfos[bidInfos.length - 1].userId) {
      toast.warning("A new bid has been placed in the auction of " + bidInfos[bidInfos.length - 1].auction.productName);
    }
  },[bidInfos])

  useEffect(() =>{

    const updateInterval = setInterval(() => { 
      const newUsersList = usersList.filter((user) => user.participant === true);
      if (newUsersList.length !== participants.length) {
        setParticipants(participants=> ([...newUsersList]));
      }
      
     
    }, 5000)

  })

  const handleSelectAuction = (e) => {
    const result = auctions.filter((auction) => auction.id === e.target.value);
    setSelectedAuction(result[0]);
  };

  const sendBidInfos = async () => {

    // =========== add bidInfos to the firebase database ===========================

    try {
      const docRef = await collection(db, "bidInfos");

      const BidInfo = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        auction: selectedAuction,
        bidAmount: bidAmount
      };
      await addDoc(docRef,  BidInfo);

    } catch (error) {
      toast.error("BidInfo not added");
    }

  };

  const handleBid = async () => {
    if (!selectedAuction) {
      toast.error("Please choose an item!");
    }else if(!bidAmount){
      toast.error("Please enter an amount!");
    }else{
      await updateDoc(doc(db, "auctions", selectedAuction.id), {
        currentPrice: bidAmount,
      });
  
      dispatch(
        auctionsActions.updateCurrentPrice({
          id: selectedAuction.id,
          currentPrice: bidAmount,
        })
      );

      sendBidInfos();
  
      toast.success("Your bid has been placed!");
    }
  };

  return (
    <Helmet title="Auction">
      <CommonSection title="Auction" />

      <section>
        <Container>
          <Row>
            <Col lg="8">
              {auctions.length > 0 ? (
                auctions?.map((auction, index) => (
                  <div key={index} className="card auction__card mx-auto shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-center p-2">
                        <img src={auction.imgUrl} alt="" />
                      </div>

                      <h6 className="text-center">{auction.productName}</h6>

                      <p className="text-center">{auction.shortDesc}</p>

                      <h6 className="text-center p-2">
                        Start price : ${auction.startPrice}
                      </h6>

                      <h6
                        className="text-center p-2"
                        style={{ color: "coral" }}
                      >
                        current price : ${auction.currentPrice}
                      </h6>

                      <div className="d-flex justify-content-center p-2">
                        <ClockVariant stopTime={auction.endDate} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                  loading.....
                </h5>
              )}
            </Col>

            <Col lg="4">
              <div className="checkout__cart">
                <h6>
                  Total attendees: <span style={{ color: "coral" }}> {participants.length} </span>
                </h6>

                <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <select className="p-2" onChange={handleSelectAuction}>
                        <option>Item</option>
                        {auctions?.map((auction, index) => (
                          <option key={index} value={auction.id}>{auction.productName}</option>
                        ))}
                      </select>
                    </FormGroup>

                    <FormGroup className="form__group w-50">

                      <input
                      onChange={(e) => setBidAmount(e.target.value)}
                      value={bidAmount}
                      type="number"
                      placeholder={
                        selectedAuction ?
                        (parseInt(selectedAuction?.currentPrice) +
                        parseInt(selectedAuction?.step)) : ""
                      }
                      min={
                        selectedAuction ?
                        (parseInt(selectedAuction?.currentPrice) +
                        parseInt(selectedAuction?.step)) : 0
                      }
                      step={selectedAuction?.step}
                    />

                    </FormGroup>

                   
                  </div>

                <motion.button
                  onClick={handleBid}
                  type="submit"
                  whileTap={{ scale: 1.2 }}
                  className="mt-2 buy__btn auth__btn bg-light  w-100"
                >
                  Place a bid
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Auction;
