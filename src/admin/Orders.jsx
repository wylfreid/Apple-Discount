import React, { useState } from "react";

import { db } from "../firebase.config";

import useGetData from "../custom-hooks/useGetData";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

import DataTable from "react-data-table-component";
import { Container, Col } from "reactstrap";
import { toast } from "react-toastify";

const AdminHistory = () => {
  const { data: orders, loading } = useGetData("orders");

  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  const columns = [
    {
      name: "userId",
      selector: (row) => row.userId,
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
      name: "PostalCode",
      selector: (row) => row.userPostalCode,
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
      selector: (row) => <span>${row.totalAmount}</span>,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          <select
            onChange={(e) => handleEdit(e, row)}
            className="w-100"
            value={row.status}
          >
            <option value="progress">Progress</option>
            <option value="completed">Completed</option>
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
            data={orders}
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
