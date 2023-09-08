import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const RouteProtector =  ({ children }) => {

  if (!localStorage.getItem('userToken')){
        return <Navigate to='/' replace /> 
  }


  return children;
};

export default RouteProtector;
