//Package management page
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import React, { useState } from 'react';


//const MyUserPortal = () => {
  //  return(
    //    <h1>
      //      Placeholder for project page
        //</h1>
    //);

//}



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
    <div style={{ 
      border: '1px solid #ccc', // Border around each project
      padding: '10px', // Padding for the project box
      margin: '10px 0', // Margin for spacing between projects
      display: 'flex', // Use flexbox for layout
      justifyContent: 'space-between', // Space out elements
      alignItems: 'center' // Center align items vertically
    }}>
      <div style={{ flex: 1 }}> {/* Flex item for project name and users */}
        <h2>{project.name}</h2> {/* Display the project name */}
        <p>Authorized Users: {project.users}</p> {/* Display authorized users */}
      </div>
      <div style={{ flex: 1 }}> {/* Flex item for hardware sets */}
        <p>HWSet1: {project.hwSet1}/100</p> {/* Display the count of HWSet1 */}
        <p>HWSet2: {project.hwSet2}/100</p> {/* Display the count of HWSet2 */}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}> {/* Flex item for input and buttons */}
        <input type="number" placeholder="Enter qty" style={{ marginRight: '10px' }} /> {/* Input field for quantity */}
        <button style={{ marginRight: '5px' }}>Check In</button> {/* Button to check in hardware */}
        <button style={{ marginRight: '5px' }}>Check Out</button> {/* Button to check out hardware */}
        {/* Conditional rendering of buttons based on authorization status */}
        {project.authorized ? (
          <button onClick={() => onLeave(project.id)}>Leave</button> // Leave button for authorized users
        ) : (
          <button onClick={() => onJoin(project.id)}>Join</button> // Join button for unauthorized users
        )}
      </div>
    </div>
  );
};

//export default Projects; // Export the Projects component as the default export



// CheckinButton Functionq



//Checkout Button Function

//Leave Button

//Join Button

export default MyUserPortal;