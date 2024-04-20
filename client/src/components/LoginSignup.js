// LoginSignup.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faPhone} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import './LoginSignup.css';
import useAuth from './UserAuthorization';
import { jwtDecode } from "jwt-decode"; 


const LoginSignup = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [c_password, setC_password] = useState('');
    const [L_email, setL_email] = useState('');
    const [L_password, setL_password] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
 
    const {login, authenticated} = useAuth(); //destructuring the login function from UserAuthorization.js
    const [loading, setLoading] = useState(false);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    const checkPasswordStrength = (password) => {
        // Define your password strength criteria
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);
        // Calculate password strength
        const strength =
            (hasUppercase ? 1 : 0) +
            (hasLowercase ? 1 : 0) +
            (hasNumber ? 1 : 0) +
            (hasSpecialChar ? 1 : 0) +
            (password.length >= minLength ? 1 : 0);
    
        // Assign strength level based on the calculated score
        let strengthLevel = '';
        if (strength <= 2) {
            strengthLevel = 'Weak';
        } else if (strength <= 4) {
            strengthLevel = 'Medium';
        } else {
            strengthLevel = 'Strong';
        }
    
        // Update the password strength state
        setPasswordStrength(strengthLevel);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password !== c_password){
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Please, reconfirm the password!!",
                    
                  });   
            }
            else{
                const result = await axios.post('http://localhost:3001/signup', { name, email, phone, password });
                 console.log(result);
                 // Assuming signup is successful, toggle the form
                 toggleForm();
                 Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Signup Successful!!",
                    showConfirmButton: false,
                    timer: 1500
                    
                 });
                 setPasswordStrength('');
            }
            
        } catch (err) {
            console.log(err);
            // Handle error if necessary.
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true); // Set loading to true before making the request

            const result = await axios.post('http://localhost:3001/login', { L_email, L_password });
        
              // Save the token to local storage
              localStorage.setItem('token', result.data.token);
            
              // Decode the token to get user information
              const decodedToken = jwtDecode(result.data.token);

              // Extract user role from decoded token
              const userRole = decodedToken.role;
                console.log('User Role:', userRole); // Log the user role

              // Call the login function to update the authenticated state
              login(result.data.token, userRole); 

            console.log(result);

            // Redirect based on user role after successful login
            if (userRole === 'user') {
                navigate('/home');
                // Show login successful alert after a delay
                setTimeout(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Login Successful!!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }, 300); // setTimeout to ensure the SweetAlert appears after navigation
            } else if (userRole === 'admin') {
                navigate('/admin');
                // Show login successful alert after a delay
                setTimeout(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Login Successful!!",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }, 200); // Adjust the delay time as needed

            }

        } catch (err) {
            console.log(err.response);
    
            if (err.response) {
                // The request was made, but the server responded with an error
                if (err.response.status === 401) {
                    // Invalid credentials, show alert
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Invalid credentials. Please try again.',
                    });
                } else if (err.response.status === 500) {
                    // Server error, show alert
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: 'An internal server error occurred. Please try again later.',  
                    });
                } else {
                    // Other server errors, log to console
                    console.error('Login error:', err);
                }
            } else if (err.request) {
                // The request was made, but no response was received (network error)
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Unable to connect to the server. Please check your internet connection.',
                });
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Request error:', err.message);
            }
        } finally {
            setLoading(false); // Set loading to false after handling the request
          }
    };
    
    return (
        <>
            <div className='leftside'>
                <div className='Image-Container'>
                    <img className='background-image' src={`${process.env.PUBLIC_URL}/bw roads.png`} alt="background Img" />
                    <img className='overlay-image' src={`${process.env.PUBLIC_URL}/map.png`} alt="overlay Img" />
                </div>
            </div>

            <div className='rightside'>
                <img className='logo' src={`${process.env.PUBLIC_URL}/logoQC.png`} alt="Logo Img" />
                <div className='LS-form'>
                    {showLogin ? (
                        <>
                            <div className='login-form' id='login-form'>
                                <h1 className='login-Text' style={{ fontFamily: 'monospace', fontSize: '32px' }}> LogIn </h1>
                                <form action='/login' method='POST' onSubmit={handleLogin}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <input type="email" id="Email" name="email" placeholder="email" required onChange={(e) => setL_email(e.target.value)} /><br />
                                    <FontAwesomeIcon icon={faLock} />
                                    <input type="password" id="Password" name="password" placeholder="password" required onChange={(e) => setL_password(e.target.value)} /><br />
                                    <button className='l-btn' type='submit'>LogIn</button>
                                    <p style={{marginTop: '40px', marginLeft: '70px'}}>Forgot Your Password? <Link to="/forgot-password">Click here</Link></p>
                                </form>
                            </div>
                            <div className='s-txt'>
                                <h2 className='wlc-txt'> Welcome,</h2>
                                <br/>
                                <h4 className='s-txt'> &nbsp; Don't have an account?</h4>
                                <button className='s-btn' id='s-btn' onClick={toggleForm}> SignUp </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='signup-form' id='signup-form'>
                                <h1 className='signup-Text' style={{ fontFamily: 'monospace', fontSize: '32px' }}> SignUp </h1>
                                <form action='/signup' method='POST' onSubmit={handleSubmit}>
                                    <FontAwesomeIcon icon={faUser} />&ensp;
                                    <input type="text" id="name" name="name" placeholder="Full-Name" required onChange={(e) => setName(e.target.value)} /><br />
                                    <FontAwesomeIcon icon={faEnvelope} />&ensp;
                                    <input type="email" id="email" name="email" placeholder="E-mail" required onChange={(e) => setEmail(e.target.value)} /><br />
                                    <FontAwesomeIcon icon={faPhone} />&ensp;
                                    <input type="tel" id="phoneno" name="phoneno" placeholder="Phone-no" required onChange={(e) => setPhone(e.target.value)} /><br />
                                    <FontAwesomeIcon icon={faLock} />&ensp;
                                    <input type="password" id="password" name="password" placeholder="Password" required onChange={(e) => {setPassword(e.target.value);  handlePasswordChange(e);}} /><br />
                                    {/* Password strength indicator - render only when password is entered */}
                                    {password.length > 0 && (
                                    <div className="password-strength">
                                    <b> &ensp; &nbsp;  Password Strength: </b>{passwordStrength}
                                    </div>
                                    )}
                                    {/* End of password strength indicator */}

                                    <FontAwesomeIcon icon={faLock} />&ensp;
                                    <input type="password" id="c_password" name="c_password" placeholder="Confirm-Password" required onChange={(e) => setC_password(e.target.value)}/><br />
                                    <button className='su-btn' type='submit'>SignUp</button>
                                </form>
                            </div>
                            <div className='login-Text'>
                                <h2 className='wlc-txt'> Welcome,</h2>
                                <br/>
                                <h4 className='s-txt'> Already have an account?</h4>
                                <button className='lt-btn' id='lt-btn' onClick={toggleForm}> LogIn </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default LoginSignup; 
