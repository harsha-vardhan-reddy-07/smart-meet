import React from 'react'
import { Navigate } from 'react-router-dom';

const LoginProtector = ({children}) => {
    const token = localStorage.getItem('userToken');

    if (token !== 'null' && token){
      return <Navigate to='/' replace /> 
    }
  
    return children;
}

export default LoginProtector;