import React, { useState, useEffect } from "react";

import "../styles/login.css";

import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../firebase.config";
import { toast } from "react-toastify";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signIn = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log(user);

      setLoading(false);
      toast.success("Successfully logged in");
      navigate("/checkout");
      
    } catch (error) {
      setLoading(false);
      //toast.error(error.message);
      toast.error("incorrect credentials");
    }
  };

  /* useEffect(()=>{
    window.scrollTo(0, 0);
  }) */

  return (
    <Helmet title="Login">
      <CommonSection title="Login" />

      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading.....</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                <h3 className="fw-bold mb-4">Login</h3>

                <Form className="auth__form" onSubmit={signIn}>
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

                  <button
                    type="submit"
                    className="buy__btn auth__btn mt-5 bg-light"
                  >
                    Login
                  </button>
                  <p>
                    Don't have account?
                    <Link to="/signup">Create an account</Link>
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

export default Login;
