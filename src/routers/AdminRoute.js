import React,{useState ,useEffect } from 'react'

import UseAuth from '../custom-hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import useGetData from './../custom-hooks/useGetData';


const AdminRoute = () => {

  const { data: usersData, loading } = useGetData("users");

  const {currentUser} = UseAuth();


  const validate = ()=>{
    let test = false
    for (let index = 0; index < usersData.length; index++) {
      if (currentUser.uid === usersData[index].uid) {
        if (usersData[index].admin === true) {
          test = true
          
        }
      }
      console.log(test);
    }
    return test
  }



  return validate() && <Outlet />
}

export default AdminRoute