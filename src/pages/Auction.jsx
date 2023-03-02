import React, { useState, useEffect, useRef } from "react";

import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

import "../styles/auction.css";
import ClockVariant from "./../components/UI/ClockVariant";

const Auction = () => {
  const auctions = useSelector((state) => state.auctions.auctionItems);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Helmet title="Auction">
      <CommonSection title="Auction" />

      <section>
        <Container>
          <Row>
            {auctions.length > 0 ? (
              auctions?.map((review, index) => (
                <div class="card auction__card col-6 mx-auto border shadow-sm">
                  <div class="card-body">
                    <div className="d-flex justify-content-center p-2">
                      <img
                        src={auctions[auctions?.length - 1]?.imgUrl}
                        alt=""
                      />
                    </div>

                    <h6 className="text-center">
                      {auctions[auctions?.length - 1]?.productName}
                    </h6>

                    <p className="text-center">
                      {auctions[auctions?.length - 1]?.shortDesc}
                    </p>

                    <h6 className="text-center p-2">
                      Start price : ${auctions[auctions?.length - 1]?.startPrice}
                    </h6>

                    <h6 className="text-center p-2" style={{color: "coral"}}>
                      current price : ${auctions[auctions?.length - 1]?.currentPrice}
                    </h6>

                    <div className="d-flex justify-content-center p-2">
                      <ClockVariant
                        stopTime={auctions[auctions?.length - 1]?.endDate}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h5 className="py-5 d-flex justify-content-center text-center fw-bold">
                loading.....
              </h5>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Auction;
