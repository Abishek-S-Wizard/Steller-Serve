import React from 'react';
import '../styles/HowWeWorks.css';
import step1 from '../assets/howitworks/step1.png';
import step2 from '../assets/howitworks/step2.png';
import step3 from '../assets/howitworks/step3.png';

const HowItWorks = () => {
  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">
        <h2 className="how-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <img src={step1} alt="Describe Task" className="step-img" />
            <h3><span>1</span> Describe Your Task</h3>
            <p>Tell us what you need done, when, and where it works for you.</p>
          </div>

          <div className="step">
            <img src={step2} alt="Choose Tasker" className="step-img" />
            <h3><span>2</span> Choose Your Tasker</h3>
            <p>Browse trusted Taskers by skills, reviews, and price. Chat with them to confirm details.</p>
          </div>

          <div className="step">
            <img src={step3} alt="Get It Done" className="step-img" />
            <h3><span>3</span> Get It Done!</h3>
            <p>Your Tasker arrives and gets the job done. Pay securely and leave a review.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
