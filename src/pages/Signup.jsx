import React, { useState, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import userIcon from "../assets/images/user-icon.png";

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
import { motion } from 'framer-motion';

const Signup = () => {

  const inputRef = useRef()

  const [username, setUsersname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();

    if (file != null) {
      
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
                participant: false,
                uid: user.uid,
                displayName: username,
                email,
                photoURL: downloadURL,
              });
            });
          }
        );
  
        setLoading(false);
  
        toast.success("Compte créé avec succès");
        navigate("/login");
      } catch (error) {
        setLoading(false);
        toast.error("quelque chose n'a pas fonctionné");
      }
    }else{
      toast.error("Veuillez choisir une photo de profil");
    }

    
  };


  /* useEffect(()=>{
    window.scrollTo(0, 0);
  }) */

  return (
    <Helmet title="Signup">
      <CommonSection title="Inscription" />

      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Chargement....</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center">
                {/* <h3 className="fw-bold mb-4">S'inscrire</h3> */}

                <Form className="auth__form" onSubmit={signup}>
                  <FormGroup className="form__group">
                    <input
                      required
                      type="text"
                      placeholder="Nom complet"
                      value={username}
                      onChange={(e) => setUsersname(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      required
                      type="email"
                      placeholder="Entrez votre e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <input
                      required
                      type="password"
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPasword(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group justify-content-start align-items-start">
                    
                    <input
                      ref={inputRef}
                      id="files"
                      className="ps-0 d-none"
                      style={{cursor: "pointer"}}
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />


                    <motion.button
                    type="reset"
                      whileTap={{scale: 1.2}}
                      onClick={e => inputRef.current.click()}
                      className="buy__btn m-0 auth__btn bg-light d-flex justify-content-center align-items-center"
                    >
                      <span> 
                        <img
                          src={userIcon}
                          alt=""
                          className="rounded-pill w-50"
                        /> 
                      </span>
                        Photo de profil
                    </motion.button>
                  </FormGroup>

                  <motion.button
                  whileTap={{scale: 1.2}}
                    type="submit"
                    className="buy__btn auth__btn mt-5 bg-light"
                  >
                    Créer un compte
                  </motion.button>
                  <p>
                  Vous avez déjà un compte?
                    <Link to="/Login">Connexion</Link>
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
