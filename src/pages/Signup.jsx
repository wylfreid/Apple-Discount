import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "../styles/login.css";

import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";

import { auth, db } from "./../firebase.config";

import { setDoc, doc } from "firebase/firestore";

import { storage } from "./../firebase.config";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsersname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = await userCredential.user;

      const storageRef = ref(storage, `images/${Date.now() + username}`);

      const uploadTask = uploadBytesResumable(storageRef, file).then(
        
        () => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            //update user profile
            await updateProfile(user, {
              displayName: username,
              photoURL: downloadURL,
            });

            //store user data in firestore database
            await setDoc(doc(db, "users", user.uid), {
              admin: false,
              uid: user.uid,
              displayName: username,
              email,
              photoURL: downloadURL,
            });
          });
        }
      );

      setLoading(false);

      toast.success("Account Created");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error("something went wrong");
    }
  };

  useEffect(()=>{
    window.scrollTo(0, 0);
  })

  return (
    <Helmet title="Signup">
      <CommonSection title="Signup" />

      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading....</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Signup</h3>

                <Form className="auth__form" onSubmit={signup}>
                  <FormGroup className="form__group">
                    <input
                      required
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsersname(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      required
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      required
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPasword(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </FormGroup>

                  <button
                    type="submit"
                    className="buy__btn auth__btn mt-5 bg-light"
                  >
                    Create an Account
                  </button>
                  <p>
                    Already have an account?
                    <Link to="/Login">Login</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
