
import React from 'react';
import '../styles/Footer.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">StellerServe</div>
          <p className="footer-text">
            &copy; {new Date().getFullYear()} StellerServe. All rights reserved.
          </p>
        </div>

        <div className="footer-content">
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#about">About </a> &nbsp; |  &nbsp;
            <a href="#plans">Plans </a> &nbsp; |  &nbsp;
            <a href="#contact">Contact </a> &nbsp; |  &nbsp;
            <a href="#how-it-works">How We Works</a>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.youtube.com/@StellerEditz" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
              <a href="https://www.youtube.com/@StellerEditz" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/steller_editz/?igsh=YzljYTk1ODg3Zg%3D%3D#" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/in/abishek-s-8443ba2a2/" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="https://www.youtube.com/@StellerEditz" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
