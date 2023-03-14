import React, { useState, useEffect, useRef } from "react";

import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col,FormGroup } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

import { doc,collection, addDoc, updateDoc, query, orderBy, onSnapshot, limit, serverTimestamp } from "firebase/firestore";

import '../styles/clock.css'

import "../styles/auction.css";
import ClockVariant from "./../components/UI/ClockVariant";
import { db } from "../firebase.config";
import useGetData from "./../custom-hooks/useGetData";
import { toast } from "react-toastify";
import UseAuth from "./../custom-hooks/useAuth";
import { useNavigate, Navigate} from "react-router-dom";
import { motion } from "framer-motion";
import { auctionsActions } from './../redux/slices/auctionSlice';
import { attendeesActions } from './../redux/slices/attendeeSlice';


const Auction = () => {
  //const auctions = useSelector((state) => state.auctions.auctionItems);
  const { data: auctions } = useGetData("auctions");

  const { currentUser } = UseAuth();

  const attendees = useSelector((state) => state.attendees.attendees);

  const users = useSelector((state) => state.users.users);

  //const { data: usersList} = useGetData("users");

  //const { data: bidInfos} = useGetData("bidInfos");

  const [selectedAuction, setSelectedAuction] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(null);

  //const [bidInfoLenght, setBidInfoLenght] = useState(0);

  const [winner, setWinner] = useState({});



  const [bidAmount, setBidAmount] = useState("");

  const [newBid, setNewBid] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const btnRef = useRef();

  const [loading, setLoading] = useState(false);


  const getAttendee = (uid) =>{
    let result = attendees.filter(
      (item) => item.uid === uid
    );
    return result[0];
  }

  const addorder = async (auction) => {

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

  };

  useEffect(() =>{

    if (selectedAuction) {
      
      localStorage.setItem("position", selectedAuction.position) 
    }

  },[selectedAuction])


  useEffect(() =>{

    if (auctions.length > 0) {
      
      const position = localStorage.getItem("position") || "1"
  
      let activesAuctions = auctions.filter(
        (item) => item.position === position
      );
  
      if (activesAuctions[0]?.active === false) {
        localStorage.setItem("position", (parseInt(position) + 1))
        setWinner({"userName": activesAuctions[0]?.currentAttendeeName, "bidAmount": activesAuctions[0]?.currentPrice})
        activesAuctions = []
  
        activesAuctions = auctions.filter(
          (item) => item.position === localStorage.getItem("position")
        );

        btnRef.current.click()

        if (currentUser.uid === activesAuctions[0]?.currentAttendeeId) {
          addorder(activesAuctions[0])
        }
      }
  
      handleSelectAuction(activesAuctions[0]?.id) 
    }else{
      localStorage.setItem("position", "1") 
    }


  },[auctions, selectedAuction])

  //localStorage.clear()


  useEffect(()=>{
    const AllowAuction = localStorage.getItem("AllowAuction")
    //console.log(AllowAuction);
    if (AllowAuction !== "true") {
      navigate("/home")
    }
  })





   const handleSelectAuction = (id) => {

    let interval = setInterval(() => {
      const result = auctions.filter((auction) => auction.id === id && auction.active === true);
      //console.log(result);
      if (result.length == 0) {
        navigate("/home")
        window.location.reload()
        //localStorage.setItem("AllowAuction", "false")
      }
      

      if (parseInt(localStorage.getItem("position") - 1 !== 1) && selectedAuction.active === false) {
        
        btnRef.current.click()
      }

      setSelectedAuction(result[0]);

      setWinner({})
      clearInterval(interval)
    }, 3000);

      

  };



  useEffect(()=>{
    setBidAmount("")
  },[selectedAuction?.currentPrice])

 
  const sendBidInfos = async () => {

    // =========== add bidInfos to the firebase database ===========================

    try {
      const docRef = await collection(db, "bidInfos");

      const BidInfo = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        auction: selectedAuction,
        bidAmount: bidAmount,
        createdAt: serverTimestamp(),
      };
      await addDoc(docRef,  BidInfo);

      setLoading(false)

    } catch (error) {
      toast.error("BidInfo not added");
    }

  };

  const handleBid = async () => {
    if (!selectedAuction) {
      toast.error("Please choose an item!");
    }else if(!bidAmount || bidAmount < parseInt(selectedAuction?.currentPrice) + parseInt(selectedAuction?.step)){
      toast.error("Please enter a valid amount!");
    }else{
      setLoading(true)
      await updateDoc(doc(db, "auctions", selectedAuction.id), {
        currentPrice: bidAmount,
        currentAttendeeId: currentUser.uid,
        currentAttendeeName: currentUser.displayName
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


  useEffect(() => {
    const q = query(
      collection(db, "bidInfos"),
      orderBy("createdAt"),
      limit(100)
    );


    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let bids = [];
      QuerySnapshot.forEach((doc) => {
        bids.push({ ...doc.data(), id: doc.id });
        //console.log(doc.data());
      });

      if (bids.length > 0 && bids[(bids?.length - 1)].userId !== currentUser?.uid) {
        
        setNewBid(bids[(bids?.length - 1)])
        displayNewBid()

        //console.log(currentUser?.uid);

        //console.log(bids[(bids?.length - 1)]);
        
      }
    });
    return () => unsubscribe;
  }, []);

  const displayNewBid = () =>{
    let interval = setInterval(() => {
      setNewBid(null)
      clearInterval(interval)
    }, 5000);
  }

  
  /* useEffect(()=>{
    setSelectedIndex(selectedIndex && selectedIndex - 1)
    if (selectedIndex < (auctions.length - 1)) {
      setSelectedAuction(auctions[selectedIndex])
      btnRef.current.click()
    }
    
  },[auctions[selectedIndex]?.active]) */



/* const getWinner = () =>{
  let position = parseInt(localStorage.getItem("position") - 1)
  
  const activesAuctions = auctions.filter(
    (item) => item.position == position
  );
  //console.log(activesAuctions);
  return activesAuctions[0]?.currentAttendeeName
} */


  return (
    <Helmet title="Auction">
      <CommonSection title="Auction" />
      

      <section>
        <Container>
          <Row>
            <Col lg="8">
              {auctions.length > 0 ? (
             
                  <div className="card auction__card mx-auto shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-center p-2">
                        <img src={selectedAuction?.imgUrl} alt="" />
                      </div>

                      <h6 className="text-center">{selectedAuction?.productName}</h6>

                      <p className="text-center">{selectedAuction?.shortDesc}</p>

                      <h6 className="text-center p-2">
                        Start price : {selectedAuction?.startPrice}XAF
                      </h6>

                      <h6
                        className="text-center p-2"
                        style={{ color: "coral" }}
                      >
                        current price : {selectedAuction?.currentPrice}XAF
                      </h6>

                      <div className="d-flex justify-content-center p-2">
                        <ClockVariant stopTime={new Date(selectedAuction?.endDate) > new Date() ? selectedAuction?.endDate : new Date()} />
                      </div>
                    </div>
                  </div>
              
              ) : (
                <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                  loading.....
                </h5>
              )}
            </Col>

            <Col lg="4">
              <div className="checkout__cart">
                
                
                <div className="d-flex align-items-center justify-content-between gap-1">

                    <div>

                      Item :  <span style={{color: "#ffc107"}}>{selectedAuction?.productName}</span>
                    </div>

                    {/* <FormGroup className="form__group w-50">
                      <select className="p-2" onChange={handleSelectAuction}>
                        <option>Item</option>
                        {auctions?.map((auction, index) => (
                          <option key={index} value={auction.id}>{auction.productName}</option>
                        ))}
                      </select>
                    </FormGroup> */}

                    <FormGroup className="form__group w-50">

                      <input
                      onChange={(e) => setBidAmount(e.target.value)}
                      value={bidAmount}
                      type="number"
                      placeholder={
                        selectedAuction ?
                        (parseInt(selectedAuction?.currentPrice) +
                        parseInt(selectedAuction?.step)) : "Enter amount"
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
                  className="mt-2 buy__btn auth__btn bg-light  w-100 d-flex align-items-center justify-content-center"
                >
                  {loading ? <div className="spinner-grow" role="status">
                  <span className="sr-only"></span>
                  </div> : <span>Place a bid</span> 
                  }
                </motion.button>
              </div>

              <div className="attendees__infos-group">

                <div className="mt-4">
                          <h5>
                            Total attendees: <span className="fw-bold ps-3" style={{ color: "coral", fontSize: "18px" }}> {attendees.length} </span>
                          </h5>
                        </div>

                <div className="d-flex row align-items-center justify-content-start">

                        
                    {
                      attendees?.map((attendee, index) =>(

                        <div key={index} className="attendees__infos col-3  d-flex flex-column align-items-center justify-content-center mt-2">
                          
                          <div className="profil__img">
                            <img
                            className="mb-0"
                              src={attendee.photoURL}
                              alt=""
                            />
                          </div>

                          <div className="text-center">
                            <span >{attendee.displayName}</span>
                          </div>
                        </div>
                      ))
                    }

                  </div>

                  {newBid && <div className='mt-3 w-100'>
                    <div className={"alert alert-warning"}><i style={{ fontSize: '.8em' }} className='fa fa-check-circle'></i>A new bid of {newBid.bidAmount}XAF was placed by {newBid.userName} for {newBid.auction.productName}</div>
                </div>}


              </div>

            </Col>
          </Row>
        </Container>
      </section>

      <button
        ref={btnRef}
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal"
      ></button>

      <div
        className="modal fade auction__popup "
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
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
                <h5>The last auction is over!!</h5>

                {winner?.userName ? <h5 className="pt-2">participant <span style={{color: "#ffc107"}}>{winner?.userName}</span> wins the auction with a bid in the amount of <span style={{color: "#ffc107"}}>{winner?.currentPrice}</span></h5> 
                    
                    :
                    <h5 className="pt-2"><span style={{color: "#ffc107"}}>No bids have been placed</span></h5>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Helmet>
  );
};

export default Auction;


