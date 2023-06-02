import { useState, useRef, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Container, Row, Col } from "reactstrap";

import { db } from "../firebase.config";

import userIcon from "../assets/images/user-icon.png";

import useGetData from "./../custom-hooks/useGetData";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import "../styles/users.css";

const Users = () => {
  const { data: users, loading } = useGetData("users");

  const [usersData, setUsersData] = useState([]);

  const [imageViewer, setImageViewer] = useState(false);
  const [searchData, setSearchData] = useState(null);

  const btnPreviewRef = useRef();

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));

    toast.success("user deleted!");
  };

  const handleEdit = async (user) => {
    await updateDoc(doc(db, "users", user.id), { admin: !user.admin });
    toast.success("the status has been changed!");
  };

  const userColumns = [
    {
      name: "Image",
      selector: (row) => {
        return (
          <div className="my-2" style={{ width: "70px", height: "70px" }}>
            <motion.img
              whileTap={{ scale: 0.95 }}
              onClick={() => [
                setImageViewer(row.photoURL ? row.photoURL : userIcon),
                btnPreviewRef.current.click(),
              ]}
              className=""
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              src={row.photoURL ? row.photoURL : userIcon}
              alt="profil"
            />
          </div>
        );
      },
    },
    {
      name: "Username",
      selector: (row) => {
        return row.displayName;
      },
    },
    {
      name: "Email",
      selector: (row) => {
        return row.email;
      },
    },
    {
      name: "Admin",
      selector: (row) => {
        return (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={row.admin}
              onChange={(e) => handleEdit(row)}
            />
          </div>
        );
      },
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <button
            onClick={() => {
              deleteUser(row.id);
            }}
            className="btn btn-danger"
          >
            Delete
          </button>
        );
      },
    },
  ];

  const customFilter = (data, search) => {
    if (search === null) {
      return data;
    }
    
    search = search?.toLowerCase();
    return data.filter((user, key) => {
      return (
        user?.displayName && user.displayName?.toLowerCase().includes(search) || user.email?.toLowerCase().includes(search)
      );
    });
  };


  const handleSort = (isAdmin) =>{
    console.log(isAdmin);

    if (isAdmin == "true") {
      const filteredAdmin= users.filter(
        (user) => user.admin === true
      );
      setUsersData(filteredAdmin);
    }else{
      const filteredUsers= users.filter(
        (user) => user.admin === false
      );
      setUsersData(filteredUsers);
    }

}


  useEffect(()=>{
    if (users?.length > 0) {
      const filteredUsers= users.filter(
        (user) => user.admin === false
      );
      setUsersData(filteredUsers);
    }
  }, [users])


  return (
    <section>
      <Container>
        <Row>
          {!loading ? (
            <>
              <Col lg="12">
                <h4 className="fw-bold">Users</h4>
                <div className="d-flex justify-content-end mb-2 gap-5">
         
                  <div className="filter__widget">
                      <select onChange={(e)=>handleSort(e.target.value)}>
                        <option style={{fontSize: '16px'}} value="false">Customers</option>
                        <option style={{fontSize: '16px'}} value="true">Admin</option>
                      </select>
                    </div>
                  
                 
                  <input
                    maxLength={10}
                    placeholder="Search user..."
                    onChange={(e) => setSearchData(e.target.value)}
                    className="w-50 searchBar bg-transparent form-control mr-sm-2"
                    type="search"
                    aria-label="Search"
                  ></input>
                </div>
              </Col>
              <Col lg="12">
                {customFilter(usersData, searchData).length > 0 ? (
                  <DataTable
                    className=""
                    columns={userColumns}
                    data={customFilter(usersData, searchData)}
                    striped
                    highlightOnHover
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                  />
                ) : <h5 className='text-center mt-5 '>The user does not exist!</h5>}
              </Col>
            </>
          ) : (
            <h3 className="py-5 d-flex justify-content-center text-center fw-bold">
              loading.....
            </h3>
          )}
        </Row>
      </Container>

      <button
        ref={btnPreviewRef}
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal1"
      ></button>

      <div
        className="modal fade auction__popup"
        id="exampleModal1"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog  modal-dialog-centered d-flex align-items-center justify-content-center"
          role="document"
        >
          <div
            className="modal-content bg-transparent d-flex align-items-center justify-content-center"
            style={{ border: "none" }}
          >
            <AnimatePresence>
              <motion.div className="tilt-box-wrap d-flex align-items-center justify-content-center">
                <span className="t_over"></span>
                <span className="t_over"></span>
                <span className="t_over"></span>
                <span className="t_over"></span>
                <span className="t_over"></span>
                <span className="t_over"></span>
                <span className="t_over"></span>
                <span className="t_over"></span>
                <span className="t_over"></span>
                <div className="tilt-box">
                  <motion.img
                    className="product__img-preview h-100"
                    src={imageViewer}
                    alt=""
                    style={{ width: "auto", zIndex: "10000" }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Users;
