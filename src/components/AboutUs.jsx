
import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        {/* Left Side Image */}
        <div className="about-image">
          <img src="https://plus.unsplash.com/premium_photo-1683936163027-4d201065a84e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXJyYW5kfGVufDB8fDB8fHww" alt="About StellerServe" />
        </div>

        {/* Right Side Content */}
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            <strong>StellerServe</strong> is a modern platform built to connect people with
            reliable and skilled service providers for everyday errands. From
            household chores to quick deliveries, we make life easier with
            convenience at your fingertips.
          </p>
          <p>
            We believe in <strong>trust, transparency, and top-tier service</strong>. Our network
            of verified service workers ensures that you get quality help when
            you need it, without the stress of finding the right person for the
            job.
          </p>
          <p>
            Whether you’re a busy professional, a student, or someone who just
            needs an extra hand, StellerServe is here to bridge the gap between 
             <b> your needs</b> and <b>trusted workers</b> — all in one smooth, secure,
            and user-friendly platform.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
