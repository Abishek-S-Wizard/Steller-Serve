
import React from 'react';
import '../styles/Projects.css';
import { Link } from 'react-router-dom';
import pick from '../assets/projects/baby.avif';
import pick1 from '../assets/projects/cleaning.avif';
import pick2 from '../assets/projects/electical.avif';
import pick3 from '../assets/projects/furniture.avif';
import pick4 from '../assets/projects/glocery.avif';
import pick5 from '../assets/projects/moving.avif';
import pick6 from '../assets/projects/plum.avif';
import pick7 from '../assets/projects/pickup.avif';


const projects = [
  {
    title: 'Furniture Assembly',
    detail: 'Quick & professional setup',
    price: '₹50',
    img: pick3
  },
  {
    title: 'Baby Sitting',
    detail: 'Caring and safe babysitters',
    price: '₹65',
    img: pick
  },
  {
    title: 'Grocery Items Buying',
    detail: 'Fresh groceries delivered fast',
    price: '₹10',
    img: pick4
  },
  {
    title: 'Help Moving',
    detail: 'Strong helpers for moving',
    price: '₹35',
    img: pick5
  },
  {
    title: 'Home Cleaning',
    detail: 'Sparkling clean every time',
    price: '₹55',
    img: pick1
  },
  {
    title: 'Plumbing Repairs',
    detail: 'Fix leaks & clogs fast',
    price: '₹35',
    img: pick6
  },
  {
    title: 'Electrical Repairs',
    detail: 'Safe and quick fixes',
    price: '₹55',
    img: pick2
  },
  {
    title: 'Pickup & Drop',
    detail: 'Quick and secure delivery',
    price: '₹50',
    img: pick7
  }
];

const Projects = () => {
  return (
    <section className="popular-section" id="Projects">
      <div className="popular-container">
        <h2>Popular Projects</h2>
        <div className="project-grid">
          {projects.map((proj, idx) => (
            <div className="project-card" key={idx}>
              <div className="image-wrapper">
                <img src={proj.img} alt={proj.title} />
              </div>
              <div className="project-info">
                <h4>{proj.title}</h4>
                <p className="detail">{proj.detail}</p>
                <p className="price">Starting at {proj.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-card" onClick={() => window.location.href = '/more-projects'}>
          See More
        </div>
        
      </div>
    </section>
  );
};

export default Projects;
