
import React from 'react';
import '../styles/Pricing.css';

const Plans = () => {
  return (
    <section className="plans-section" id="plans">
      <div className="plans-container">
        <h2>Choose Your Plan</h2>
        <div className="plan-cards">
          <div className="plan-card">
            <h3>Basic</h3>
            <p className="price">Free</p>
            <ul>
              <li>Post up to 3 tasks/month</li>
              <li>Standard matching</li>
              <li>Limited support</li>
            </ul>
          </div>

          <div className="plan-card popular">
            <h3>Premium</h3>
            <p className="price">₹199/month</p>
            <ul>
              <li>Unlimited tasks</li>
              <li>Priority matching</li>
              <li>Premium support</li>
            </ul>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default Plans;