
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./JobDescription.css"; // reuse your css

export default function JobDescription() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      setJobs(data);
    }
  };

  return (
  <section className="job-description-section" id="jobdescription">
    <div className="job-container">
      <h2>Job Openings</h2>
      {jobs.length === 0 ? (
        <p>No job postings available at the moment.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> ₹{job.salary}</p>
              <p className="posted-date">
                Posted on: {new Date(job.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

}
