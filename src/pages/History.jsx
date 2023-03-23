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
        case "in progress":
            return "#14ff92";
        case "on the way":
            return "#61a1ff";
        case "completed":
            return "#61a1ff";
        case "delivered":
          return "#61a1ff";
    }
  }


  const columns = [
    
    {
      name: "Articles",
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
      name: "Quantité totale",
      selector: (row) => row.totalQty,
    },
    {
      name: "Montant total",
      selector: (row) => <span>{row.totalAmount}XAF</span>,
    },
    {
      name: "Status",
      selector: (row) => <span className="fw-bold fs-6" style={{color: setStatusColor(row.status)}}>{row.status}</span> ,
    },
  ];

  

  return (
    
    <Helmet title="History">
        <CommonSection title="Historique" />

        <section>
      <Container>
        {loading ? (
          <Col  lg="12">
            <h3 className="py-5 d-flex justify-content-center text-center fw-bold">
              chargement.....
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
