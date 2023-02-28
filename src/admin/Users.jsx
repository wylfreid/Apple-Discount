import React from "react";
import { Container, Row, Col } from "reactstrap";

import { db } from "../firebase.config";

import useGetData from "./../custom-hooks/useGetData";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Users = () => {
  const { data: usersData, loading } = useGetData("users");

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));

    toast.success("user deleted!");
  };

  const handleEdit = async (user) => {
    await updateDoc(doc(db, "users", user.id), { admin: !user.admin });
    toast.success("the status has been changed!");

  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h4 className="fw-bold">Users</h4>
          </Col>
          <Col lg="12">
            <h4 className="pt-5">
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <td colSpan="5">
                      <h3 className="py-5 d-flex justify-content-center text-center fw-bold">
                        loading.....
                      </h3>
                    </td>
                  ) : (
                    usersData.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <img src={user.photoURL} alt="" />
                        </td>
                        <td>{user.displayName}</td>
                        <td>{user.email}</td>
                        <td>
                          <div class="form-check form-switch">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckDefault"

                              checked = {user.admin}
                              onChange={e=> handleEdit(user)}
                            />
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              deleteUser(user.id);
                            }}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </h4>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Users;
