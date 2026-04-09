
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/Navbar.css';
import step1 from '../assets/StellerServe.png';

const Navbar = () => {
  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.a 
        href="/" 
        className="logo"
        whileHover={{ scale: 1.1 }}
      >
        <img 
          src={step1} 
          alt="StellerServe Logo"
          className="logo-img"
        />
      </motion.a>
      
      <ul className="nav-links">
        <li><a href="http://localhost:3000/">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#Projects">Projects</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#jobdescription">Jobs</a></li>
        <li><a href="#plans">Plans</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#contact">Contact</a></li>
        <li>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link to="/login" className="login-btn">Login</Link>
          </motion.div>
        </li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
