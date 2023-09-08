import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';

const LoginProtector = ({children}) => {
  useEffect(() => {

    if (localStorage.getItem('userToken')) {
      window.location.href = '/';
    }
  }, [localStorage]);


  return children;
  
}

export default LoginProtector;