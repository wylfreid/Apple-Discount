import React, { useState, useEffect } from "react";

import { db } from "../firebase.config";

import useGetData from "../custom-hooks/useGetData";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

import DataTable from "react-data-table-component";
import { Container, Col } from "reactstrap";
import { toast } from "react-toastify";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

const AdminHistory = () => {
  const { data: orders, loading } = useGetData("orders");

  const [ordersData, setOrdersData] = useState([]);

  useEffect(()=>{

    let result = orders

    result.sort((a, b) => {
      if (!a.createdAt === 0 && !b.createdAt) {
        return 0;
      } else if (!a.createdAt) {
        return 1;
      } else if (!b.createdAt) {
        return -1;
      } else {
        const aDate = new Date(a.createdAt.toDate())
        const bDate = new Date(b.createdAt.toDate())
        
        return  bDate - aDate;
      }
    });

    setOrdersData(result)

  },[orders])

  console.log(orders);

  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  const columns = [
    {
      name: "Date",
      selector: (row) => row.createdAt && format(row.createdAt?.toDate(), "dd MMMM yyyy HH:mm", { locale: fr }),
      width: "175px"
    },
    {
      name: "userName",
      selector: (row) => row.userName,
      sortable: true,
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
      name: "Items",
      selector: (row) => (
        <div className="overflow-auto">
          {row.products.map((item, index) => (
            <span key={index}>
              {item.productName} ({item.quantity}) ,
            </span>
          ))}
        </div>
      ),
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
      selector: (row) => (
        <div>
          <select
            onChange={(e) => handleEdit(e, row)}
            className="w-100 p-1 fw-5 fs-6"
            value={row.status}
          >
            <option value="En cours">En cours</option>
            <option value="Expédié">Expédiée</option>
            <option value="Livrée">Livrée</option>
          </select>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <button
          onClick={() => {
            deleteOrder(row.id);
          }}
          className="btn btn-danger"
        >
          Delete
        </button>
      ),
    },
  ];

  const handleEdit = async (e, order) => {
    await updateDoc(doc(db, "orders", order.id), { status: e.target.value });
    toast.success("the status has been changed!");
  };

  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));

    toast.success("Deleted!");
  };

  return (
    <section>
      <Container>
        {loading ? (
          <Col lg="12">
            <h3 className="py-5 d-flex justify-content-center text-center fw-bold">
              loading.....
            </h3>
          </Col>
        ) : (
          <DataTable
            columns={columns}
            data={ordersData}
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            defaultSortFieldId="userName"
            pagination
            striped
            defaultSortAsc={false}
          />
        )}
      </Container>
    </section>
  );
};

export default AdminHistory;
