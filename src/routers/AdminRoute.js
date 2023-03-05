import React,{useState ,useEffect } from 'react'

import UseAuth from '../custom-hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import useGetData from './../custom-hooks/useGetData';
import {useNavigate} from "react-router-dom";
import { useSelector } from 'react-redux';



const AdminRoute = () => {

  const { data: usersData} = useGetData("users");

  const {currentUser} = UseAuth();

  const navigate = useNavigate();


  const validate = ()=>{
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
  }



  return validate() && <Outlet />
}

export default AdminRoute