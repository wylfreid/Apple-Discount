import React,{useState, useEffect} from "react";


import useGetData from "./../custom-hooks/useGetData";

import DataTable from "react-data-table-component";
import { Container, Col } from "reactstrap";
import Helmet from './../components/Helmet/Helmet';
import CommonSection from './../components/UI/CommonSection';
import UseAuth from './../custom-hooks/useAuth';


const History = () => {
  const { data: orders, loading } = useGetData("orders");

  const [userOrders, setUserOrders] = useState([]);

  const { currentUser } = UseAuth();



  useEffect(()=>{
    const filteredOrders = orders.filter(
        (order) => order.userId === currentUser.uid
      );

      setUserOrders(filteredOrders);
  },[orders])

  function setStatusColor(status) {
    switch (status) {
        case "progress":
            return "#14ff92";
        case "completed":
            return "#61a1ff";
    }
  }


  const columns = [
    {
      name: "userName",
      selector: (row) => row.userName,
    },
    {
      name: "Phone",
      selector: (row) => row.userPhone,
    },
    {
      name: "Email",
      selector: (row) => row.userEmail,
    },
    {
      name: "Country",
      selector: (row) => row.userCountry,
    },
    {
      name: "Adress",
      selector: (row) => row.userAdress,
    },
    {
      name: "City",
      selector: (row) => row.userCity,
    },
    {
      name: "PostalCode",
      selector: (row) => row.userPostalCode,
    },
    {
      name: "Items",
      selector: (row) => 
        <div className="overflow-auto">
            {row?.products?.map((item, index) => (
              <span key={index}>
                {item.productName} ({item.quantity}) ,
              </span>
            ))}
        </div>
        
      
    },
    {
      name: "Total Quantity",
      selector: (row) => row.totalQty,
    },
    {
      name: "Total Amount",
      selector: (row) => <span>{row.totalAmount}XAF</span>,
    },
    {
      name: "Status",
      selector: (row) => <span className="fw-bold fs-6" style={{color: setStatusColor(row.status)}}>{row.status}</span> ,
    },
  ];

  

  return (
    
    <Helmet title="History">
        <CommonSection title="History" />

        <section>
      <Container>
        {loading ? (
          <Col  lg="12">
            <h3 className="py-5 d-flex justify-content-center text-center fw-bold">
              loading.....
            </h3>
          </Col>
        ) : (
          
          userOrders && <DataTable columns={columns} data={userOrders} pagination/>
        )}
      </Container>
    </section>
    </Helmet>
    
  );
};

export default History;
