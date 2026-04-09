
import React from 'react';
import './Notifications.css';

const services = [
  { title: "House Cleaning", detail: "Sparkling clean every time", price: "₹300", img: "https://plus.unsplash.com/premium_photo-1679501956116-97589191fafb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG91c2UlMjBjbGVhbmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Deep Cleaning", detail: "Thorough and professional cleaning", price: "₹500", img: "https://images.unsplash.com/photo-1627905646269-7f034dcc5738?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RGVlcCUyMGNsZWFuaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Window Cleaning", detail: "Clean and streak-free windows", price: "₹200", img: "https://images.unsplash.com/photo-1482449609509-eae2a7ea42b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8V2luZG93JTIwY2xlYW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Laundry & Ironing", detail: "Fresh and pressed clothes", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1678218589968-f9d21a289156?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TGF1bmRyeSUyMCUyNiUyMElyb25pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Car Cleaning / Detailing", detail: "Shiny and spotless car", price: "₹350", img: "https://images.unsplash.com/photo-1681163101469-5175a8925526?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2FyJTIwQ2xlYW5pbmclMjAlMkYlMjBEZXRhaWxpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Carpet / Sofa Cleaning", detail: "Clean carpets & sofas efficiently", price: "₹300", img: "https://plus.unsplash.com/premium_photo-1733306538480-f0d59b6edadf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2FycGV0JTIwJTJGJTIwU29mYSUyMENsZWFuaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Pest Control", detail: "Effective pest removal", price: "₹400", img: "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGVzdCUyMENvbnRyb2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Water Tank Cleaning", detail: "Hygienic water tanks", price: "₹300", img: "https://plus.unsplash.com/premium_photo-1737597230598-8561be1d98f3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V2F0ZXIlMjBUYW5rJTIwQ2xlYW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Plumbing", detail: "Fix leaks & clogs fast", price: "₹400", img: "https://media.istockphoto.com/id/2156183388/photo/a-man-installs-a-heating-system-in-a-house-and-checks-the-pipes-with-a-wrench.webp?a=1&b=1&s=612x612&w=0&k=20&c=6HFlSJA1syBSNHTIV4dfcCURcSROWyQkE6ENfNX3z70=" },
  { title: "Electrical Work", detail: "Safe and quick fixes", price: "₹400", img: "https://plus.unsplash.com/premium_photo-1678766819262-cdc490bfd0d1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8RWxlY3RyaWNhbCUyMFdvcmt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Painting", detail: "Professional painting services", price: "₹400", img: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8UGFpbnRpbmclMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Carpentry / Furniture Repair", detail: "Repair furniture efficiently", price: "₹400", img: "https://plus.unsplash.com/premium_photo-1726877136122-e37ccd3e1b3c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q2FycGVudHJ5JTIwJTJGJTIwRnVybml0dXJlJTIwUmVwYWlyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "AC / Appliance Repair", detail: "Professional and safe repairs", price: "₹400", img: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUMlMjAlMkYlMjBBcHBsaWFuY2UlMjBSZXBhaXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Home Decor Installation", detail: "Beautify your home easily", price: "₹350", img: "https://images.unsplash.com/photo-1701422052265-64f0ac28dcd6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8SG9tZSUyMERlY29yJTIwSW5zdGFsbGF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Minor Renovation / Fixing", detail: "Quick home repairs", price: "₹400", img: "https://images.unsplash.com/photo-1737739973200-61c2ae4d1272?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWlub3IlMjBSZW5vdmF0aW9uJTIwJTJGJTIwRml4aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Door / Window Lock Repair", detail: "Secure your home quickly", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1683134531395-1ebecbf3440c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RG9vciUyMCUyMFJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Furniture Assembly", detail: "Quick & professional setup", price: "₹250", img: "https://images.unsplash.com/photo-1646705193406-8083b661ee9d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEZ1cm5pdHVyZSUyMEFzc2VtYmx5JTIwUXVpY2slMjAlMjYlMjBwcm9mZXNzaW9uYWwlMjBzZXR1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Baby Sitting / Daycare", detail: "Caring and safe babysitters", price: "₹400", img: "https://media.istockphoto.com/id/173230386/photo/nursery-teacher-playing-with-the-kids.webp?a=1&b=1&s=612x612&w=0&k=20&c=3VGzhLGK3n2-rxGgx-BBBaGebm9l_3LoH9RIO5M5pMQ=" },
  { title: "Elderly Care / Attendant", detail: "Professional and compassionate care", price: "₹400", img: "https://plus.unsplash.com/premium_photo-1664304337064-fe638ba515d5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEVsZGVybHklMjBDYXJlJTIwJTJGJTIwQXR0ZW5kYW50fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Pet Sitting / Dog Walking", detail: "Caring for your pets while you’re away", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1663127338777-5ddb572b9d72?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RG9nJTIwV2Fsa2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Personal Shopping / Assistance", detail: "Helping you shop conveniently", price: "₹250", img: "https://images.unsplash.com/photo-1707328739134-7cf382e74fc2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFBlcnNvbmFsJTIwU2hvcHBpbmclMjAlMkYlMjBBc3Npc3RhbmNlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Beauty & Grooming at Home", detail: "Professional grooming at home", price: "₹300", img: "https://images.unsplash.com/photo-1758598738337-bd023fca04c9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fEJlYXV0eSUyMCUyNiUyMEdyb29taW5nJTIwYXQlMjBIb21lfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Fitness / Yoga Trainer at Home", detail: "Personalized fitness sessions", price: "₹300", img: "https://media.istockphoto.com/id/1483989816/photo/adult-arab-male-with-a-ponytail-meditating-in-a-yoga-class.webp?a=1&b=1&s=612x612&w=0&k=20&c=dQvszbYA7K4URLxjwPJ_eSRCj9QPcflO5T-GteU5toU=" },
  { title: "Grocery Shopping / Delivery", detail: "Fresh groceries delivered fast", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1664300804484-b80c4e9b4229?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8R3JvY2VyeSUyMFNob3BwaW5nJTIwJTJGJTIwRGVsaXZlcnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Courier / Parcel Delivery", detail: "Quick and secure delivery", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1661438370766-8b68ab6cd632?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q291cmllciUyMCUyRiUyMFBhcmNlbCUyMERlbGl2ZXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Document Submission / Pick & Drop", detail: "Safe and fast document delivery", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1663054311916-98ef24980a37?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8RG9jdW1lbnQlMjBTdWJtaXNzaW9ufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500 " },
  { title: "Medicine / Pharmacy Delivery", detail: "Get medicines delivered to your doorstep", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1661373698199-3ca637e98d71?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8TWVkaWNpbmUlMjAlMkYlMjBQaGFybWFjeSUyMERlbGl2ZXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Laundry Pickup & Delivery", detail: "Convenient laundry services", price: "₹250", img: "https://plus.unsplash.com/premium_photo-1683134126478-1131db2e6fd5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TGF1bmRyeSUyMFBpY2t1cCUyMCUyNiUyMERlbGl2ZXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Food / Restaurant Delivery", detail: "Delicious food delivered fast", price: "₹250", img: "https://images.unsplash.com/photo-1607021815389-99b97f2b3b06?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Rm9vZCUyMCUyRiUyMFJlc3RhdXJhbnQlMjBEZWxpdmVyeXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Flower / Gift Delivery", detail: "Send flowers & gifts quickly", price: "₹250", img: "https://images.unsplash.com/photo-1759004612201-87c2bad9eb3e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Rmxvd2VyJTIwJTJGJTIwR2lmdCUyMERlbGl2ZXJ5fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Party / Event Setup", detail: "Professional event setup services", price: "₹400", img: "https://plus.unsplash.com/premium_photo-1663090585707-96572044e509?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UGFydHklMjAlMkYlMjBFdmVudCUyMFNldHVwfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Gardening / Lawn Care", detail: "Maintain a fresh and healthy garden", price: "₹300", img: "https://plus.unsplash.com/premium_photo-1680286739871-01142bc609df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2FyZGVuaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Tutoring / Homework Help", detail: "Personalized learning support", price: "₹300", img: "https://plus.unsplash.com/premium_photo-1661753461916-e17573a2ea69?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VHV0b3JpbmclMjAlMkYlMjBIb21ld29yayUyMEhlbHB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Tech Assistance / PC Setup", detail: "Expert tech support at home", price: "₹350", img: "https://images.unsplash.com/photo-1672796026880-edc609812fd7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VGVjaCUyMEFzc2lzdGFuY2UlMjAlMkYlMjBQQyUyMFNldHVwfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500" },
  { title: "Photography / Videography", detail: "Capture moments professionally", price: "₹400", img: "https://plus.unsplash.com/premium_photo-1673448391005-d65e815bd026?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFBob3RvZ3JhcGh5JTIwJTJGJTIwVmlkZW9ncmFwaHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500" },
  { title: "Car / Bike Fuel Filling", detail: "Fuel delivered at your doorstep", price: "₹200", img: "https://images.unsplash.com/photo-1743263297593-16cee984dafe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fENhciUyMCUyRiUyMEJpa2UlMjBGdWVsJTIwRmlsbGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" },
  
];


const MoreProjects = () => {
  return (
    <section className="popular-section" id="Services">
      <div className="popular-container">
        <h2>Popular Services</h2>
        <div className="project-grid">
          {services.map((service, idx) => (
            <div className="project-card" key={idx}>
              <div className="image-wrapper">
                <img src={service.img} alt={service.title} />
              </div>
              <div className="project-info">
                <h4>{service.title}</h4>
                <p className="detail">{service.detail}</p>
                <p className="price">Starting at {service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreProjects;
