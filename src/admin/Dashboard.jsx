import React, {useState, useEffect} from "react";
import { Container, Row, Col } from "reactstrap";

import useGetData from "./../custom-hooks/useGetData";


import '../styles/dashboard.css'

const Dashboard = () => {


  const { data: usersData } = useGetData("users");

  const { data: productsData } = useGetData("products");

  const { data: orders } = useGetData("orders");

  const [sales, setSales] = useState(0);

  useEffect(() =>{
    if (orders.length > 0) {
      let totalSalesAmount = 0;
      for (let index = 0; index < orders.length; index++) {
        if(orders[index].status === "completed"){
          totalSalesAmount += orders[index].totalAmount;
        }
      }
      setSales(totalSalesAmount);
    }
  }, [orders])


  return (
    <section>
      <Container>
        <Row>
          <Col lg="3">
            <div className="revenue__box">
              <h5>Total Sales</h5>
              <span>{sales}XAF</span>
            </div>
          </Col>
          <Col lg="3">
            <div className="orders__box">
              <h5>Orders</h5>
              <span>{orders.length}</span>
            </div>
          </Col>
          <Col lg="3">
            <div className="products__box">
              <h5>Total Products</h5>
              <span>{productsData.length}</span>
            </div>
          </Col>
          <Col lg="3">
            <div className="users__box">
              <h5>Total Users</h5>
              <span>{usersData.length} </span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
