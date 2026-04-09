import React from 'react';
import '../styles/Testimonials.css';
import user1 from '../assets/user1.jpg';
import user2 from '../assets/user2.jpg';
import user3 from '../assets/user3.jpg';
import user4 from '../assets/user4.jpg';

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-content">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <img src={user1} />
            <p>"StellerServe made my daily tasks so much easier and times are saved. Highly recommend!"</p>
            <h4>– Johnny Depp</h4>
          </div>
          <div className="testimonial-card">
            <img src={user2}/>
            <p>"Quick, reliable, and trustworthy service. I use it every week. Highly Trustable and Must Try!"</p>
            <h4>– Cillian Murphy</h4>
          </div>
          <div className="testimonial-card">
            <img src={user3}/>
            <p>"I got a great job through StellerServe's service section. Thank you!"</p>
            <h4>– Henry Cavill</h4>
          </div>
          <div className="testimonial-card">
            <img src={user4}/>
            <p>"Amazing platform! The team is supportive and the service is top-notch."</p>
            <h4>– Robert Downery Jr</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
