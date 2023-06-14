import { useEffect } from 'react';

const RouteProtector =  ({ children }) => {

  // const token = localStorage.getItem('userToken');

  // if (token === 'null' || token === null ){
  //   return <Navigate to='/login' replace /> 
  // }

  const token = localStorage.getItem('userToken');
  useEffect(() => {

    if (token === 'null' || !token) {
      // Redirect to login page when token is null
      window.location.href = '/login';
    }
  }, [token]);


  return children;
};

export default RouteProtector;
