import React from 'react'

import UseAuth from '../custom-hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';



const ProtectedRoute = () => {

    const {currentUser} = UseAuth();

  return currentUser ? <Outlet /> : <c to='/login'/>
}

export default ProtectedRoute