// UserAuthorization.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      setAuthenticated(true);
      setUserRole(role);
    } else {
      setAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    setAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    setUserRole(null);
  };

  return { authenticated, userRole, login, logout };
};

export default useAuth;




/* // UserAuthorization.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      setAuthenticated(true);
      setUserRole(role);

      // Redirect based on user role
      if (role === 'user') {
        navigate('/home');
      } 
      
      else if (role === 'admin') {
        navigate('/admin');
      }

    } 
    
    else {
      setAuthenticated(false);
      setUserRole(null);
    }
  }, [navigate]);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    setAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
    setUserRole(null);
  };

  return { authenticated, userRole, login, logout };
};

export default useAuth;

 */

