import React, { useState, useEffect } from "react";

import "../styles/login.css";

import Helmet from "./../components/Helmet/Helmet";
import CommonSection from "./../components/UI/CommonSection";
import { Row, Container, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../firebase.config";
import { toast } from "react-toastify";
import { motion } from 'framer-motion';


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
      //console.log(user);

      setLoading(false);
      toast.success("Connexion réussie");
      navigate("/home");
      
    } catch (error) {
      setLoading(false);
      //toast.error(error.message);
      toast.error("informations d'identification incorrectes");
    }
  };

  /* useEffect(()=>{
    window.scrollTo(0, 0);
  }) */

  return (
    <Helmet title="Connexion">
      <CommonSection title="Connexion" />

      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Chargement.....</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                {/* <h3 className="fw-bold mb-4">Connexion</h3> */}

                <Form className="auth__form" onSubmit={signIn}>
                  <FormGroup className="form__group">
                    <input
                      required
                      type="email"
                      placeholder="Saisissez votre e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      required
                      type="password"
                      placeholder="Saisissez votre mot de passe"
                      value={password}
                      onChange={(e) => setPasword(e.target.value)}
                    />
                  </FormGroup>

                  <motion.button
                    whileTap={{scale: 1.2}}
                    type="submit"
                    className="buy__btn auth__btn mt-5 bg-light"
                  >
                    Connexion
                  </motion.button>
                  <p>
                  Pas de compte?
                    <Link to="/signup">Créer un compte</Link>
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
