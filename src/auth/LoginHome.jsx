import React from "react";
import { Link } from "react-router-dom";
import "./auth1.css";
import user from '../assets/user.jpg';
import admin from '../assets/admin.jpg';
import service from '../assets/service.jpg';

const LoginHome = () => {
  return (
    <div className="login-home-container">
      <h1 className="login-home-title">Choose Your Login Type</h1>
      <div className="login-home-boxes">
        
        <Link to="/user-login" className="login-box">
          <img src={user} alt="User Login" className="login-img" />
          <h1>User</h1>
        </Link>

        <Link to="/admin-login" className="login-box">
          <img src={admin} alt="Admin Login" className="login-img" />
          <h1>Admin</h1>
        </Link>

        <Link to="/service-login" className="login-box">
          <img src={service} alt="Service Login" className="login-img" />
          <h1>Service</h1>
        </Link>
      </div>
    </div>
  );
};

export default LoginHome;
