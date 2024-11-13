import React, { useState } from 'react';
import '../App.css';

const Project = () => {
    const [createProject, setCreateProject] = useState(false);

    // Separate state variables for each form
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [joinProjectId, setJoinProjectId] = useState('');  // For joining projects
    const [newProjectId, setNewProjectId] = useState('');    // For creating projects

    const username = localStorage.getItem('username');


    const handleCreateProject = () => {
        setCreateProject(true);
    };

    // Function to handle joining an existing project
    const handleJoinProject = (e) => {
        e.preventDefault();
        // Add join project logic here
        console.log('Joining project with ID:', joinProjectId);
    };

    // Function to handle creating a new project
    const handleSaveProject = async (e) => {
        e.preventDefault();

        console.log('Retrieved username from localStorage:', username); // Debug print

        // Check if username exists
        if (!username) {
            alert('User ID not found. Please log in again.');
            return;
        }

        const projectData = {
            projectName,
            projectDescription,
            projectId: newProjectId,
            username
        };
        console.log('Sending project data:', projectData); // Debug print

        try {
            const response = await fetch('http://localhost:5000/create_project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            console.log('Response status:', response.status); // Debug print

            const data = await response.json();
            console.log('Response data:', data); // Debug print

            if (data.status === 'success') {
                alert('Project created successfully');
                setCreateProject(false);
                setProjectName('');
                setProjectDescription('');
                setNewProjectId('');
            } else {
                alert(data.message || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error details:', error); // Enhanced error logging
            alert('An error occurred while creating the project');
        }
    };

    return (
        <div className="create-project">
            <h2>Projects</h2>
            <button onClick={handleCreateProject}>Create New Project</button>

            {/* Join Project Form */}
            <div className="join-project">
                <h2>Join Project</h2>
                <form onSubmit={handleJoinProject}>
                    <div className="join-project">
                        <label htmlFor="join-projectid">Project ID</label>
                        <input
                            type="text"
                            id="join-projectid"
                            value={joinProjectId}
                            onChange={(e) => setJoinProjectId(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Enter</button>
                </form>
            </div>

            {/* Create Project Form */}
            {createProject && (
                <div className="project-details">
                    <h2>Project Details</h2>
                    <form onSubmit={handleSaveProject}>
                        <div className="new-project">
                            <label htmlFor="projectname">Project Name</label>
                            <input
                                type="text"
                                id="projectname"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="new-project">
                            <label htmlFor="projectdescription">Project Description</label>
                            <input
                                type="text"
                                id="projectdescription"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="new-project">
                            <label htmlFor="new-projectid">Project ID</label>
                            <input
                                type="text"
                                id="new-projectid"
                                value={newProjectId}
                                onChange={(e) => setNewProjectId(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit">Save New Project Details</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Project;