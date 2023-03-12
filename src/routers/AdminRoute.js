import React,{useEffect } from 'react'

import { Outlet } from 'react-router-dom';
import {useNavigate} from "react-router-dom";




const AdminRoute = () => {


  const navigate = useNavigate();


  /* const validate = ()=>{
    let test = false
    if (currentUser) {
      
      const user = usersData.filter(
        (item) => item.uid === currentUser.uid && item.admin === true
      );
  
      if (user.length) {
        test = true;
      }
 
    }
    

    return test
  } */


  useEffect(()=>{
    const admin = localStorage.getItem("admin")
    //console.log(admin);
    if (admin !== "true") {
      navigate("/login")
    }
  })


  return <Outlet />
}

export default AdminRoute