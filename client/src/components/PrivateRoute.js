// PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './UserAuthorization'; // Replace with the correct path to your useAuth component

const PrivateRoute = () => {
  const { authenticated, checkingAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous check for authentication
    const checkAuthentication = async () => {
      // Perform any async operations (e.g., fetching user role from the server)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    // Customize the loading screen appearance here
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Loading...</h1>
          <br/>
          <h3><p>Please wait while we check your authentication!!</p></h3>
        </div>
      </div>
    );
  }

  return authenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
