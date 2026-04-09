
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div> {/* Overlay for opacity effect */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>
          Welcome to <span className="highlight">StellerServe</span>
        </h1>
        <p>
          Your trusted errand service platform — connecting users with reliable
          service workers.
        </p>
        <motion.button
          className="hero-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;
