// Nav.js
import React from 'react';

const NavBar = () => {
    return (
        <nav>
            <div className="nav-left">
                <a href="/home">Home</a>
                <a href="/about">About</a>
                <a href="/UserProfile">Profile</a>
                <a href="/UserHistory">History</a>
            </div>
            <div className="nav-right">
                <a href="/logout">Logout</a>
            </div>
            <style>
                {`
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #333;
                    padding: 10px 40px;
                }
                
                a {
                    text-decoration: none;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                }
                
                a:hover {
                    cursor: pointer;
                }
                
                .nav-left {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .nav-left a:hover {
                    background-color: #ee823a;
                }
                
                .nav-right {
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                }
                
                .nav-right a:hover {
                    background-color: #57a0d3;
                }
                `}
            </style>
        </nav>
    );
};

export default NavBar;
