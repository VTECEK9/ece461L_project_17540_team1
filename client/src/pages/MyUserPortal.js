//Package management page
// import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import React, { useState } from 'react';


// Main Projects Component
const MyUserPortal = () => {
  // State to hold the list of projects
  const [projects, setProjects] = useState([
    // Initial project data with id, name, authorized users, hardware counts, and authorization status
    { id: 1, name: 'Project Name 1', users: 'User A, User B', hwSet1: 50, hwSet2: 0, authorized: false },
    { id: 2, name: 'Project Name 2', users: 'User C, User D', hwSet1: 50, hwSet2: 0, authorized: true },
    { id: 3, name: 'Project Name 3', users: 'User E', hwSet1: 0, hwSet2: 0, authorized: false }
  ]);

  // Function to handle joining a project
  const joinProject = (id) => {
    // Logic for joining the project (e.g., API call)
    console.log(`Joined project ${id}`);
  };

  // Function to handle leaving a project
  const leaveProject = (id) => {
    // Logic for leaving the project (e.g., API call)
    console.log(`Left project ${id}`);
  };

  return (
    <div>
      <h1>Projects</h1>
      <p><Link to = "/checkout">Resources Management</Link></p>
      {/* Map through the projects array to render each Project component */}
      {projects.map((project) => (
        <Project
          key={project.id} // Unique key for each project
          project={project} // Pass the current project object as a prop
          onJoin={joinProject} // Pass the join function as a prop
          onLeave={leaveProject} // Pass the leave function as a prop
        />
      ))}
    </div>
  );
};

// Project Component
const Project = ({ project, onJoin, onLeave }) => {
  return (
    <div class = "project-box">
      <div class = "project-users">
        <h2>{project.name}</h2> 
        <p>Authorized Users: {project.users}</p>
      </div>
      <div class = "hw-sets"> 
        <p>HWSet1: {project.hwSet1}/100</p> 
        <p>HWSet2: {project.hwSet2}/100</p> 
      </div>
      <div class = "check-in"> 
        <input type="number" placeholder="Enter qty" style={{ marginRight: '30px' }} /> 
        <button class = "user-buttons">Check In</button> 
        <button class = "user-buttons">Check Out</button> 
      
        {project.authorized ? (
          <button onClick={() => onLeave(project.id)}>Leave</button> // Leave button for authorized users
        ) : (
          <button onClick={() => onJoin(project.id)}>Join</button> // Join button for unauthorized users
        )}
      </div>
    </div>
  );
};


export default MyUserPortal;