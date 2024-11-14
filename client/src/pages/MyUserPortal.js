import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MyUserPortal = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [createProject, setCreateProject] = useState(false);

    // Separate state variables for each form
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [joinProjectId, setJoinProjectId] = useState('');  // For joining projects
    const [newProjectId, setNewProjectId] = useState('');    // For creating projects




    const username = localStorage.getItem('username');


    

    useEffect(() => {
        const fetchProjects = async () => {
            console.log('Fetching projects for username:', username);

            try {
                const response = await fetch('http://localhost:5000/get_user_projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username })
                });

                const data = await response.json();
                console.log('Received data:', data);

                if (data.status === 'success') {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);




    const handleCreateProject = () => {
        if (createProject == false) {
            setCreateProject(true);
        } else {
            setCreateProject(false);
        }
    };

     // Function to handle creating a new project
     const handleSaveProject = async (e) => {
        e.preventDefault();

        console.log('Retrieved username from localStorage:', username); // Debug print

        // Check if username exists
        if (!username) {
            alert('Username not found. Please log in again.');
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
                window.location.reload()
            } else {
                alert(data.message || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error details:', error); // Enhanced error logging
            alert('An error occurred while creating the project');
        }
    };

    // Changed function names to match what's being passed to Project component
    const handleJoinProject = async (projectId) => {
        console.log(`Joining project ${projectId}`);
        // TODO: Implement join logic
    };

    const handleLeaveProject = async (projectId) => {
        console.log(`Leaving project ${projectId}`);
        // TODO: Implement leave logic
    };

    if (loading) {
        return <div>Loading projects...</div>;
    }

    return (
        <div className="projects-container">
            <h1>My Projects</h1>

            <div className = "create-project">
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

            {projects.length === 0 ? (
                <div>
                    <p>No projects found.</p>
                    <Link to="/createprojects">Create a new project</Link>
                </div>
            ) : (
                <div>
                    {projects.map((project) => (
                        <Project
                            key={project.id}
                            project={project}
                            hwsets = {project.HardwareSet_Usage} // passing in example values for hwset
                            onJoin={handleJoinProject}    // Now matches the function name
                            onLeave={handleLeaveProject}  // Now matches the function name
                        />
                    ))}
                </div>
            )}
        
        </div>
    );
};

const Project = ({ project, onJoin, onLeave, hwsets }) => {
    const [request1, setRequest1] = React.useState('');
    const [request2, setRequest2] = React.useState('');

    // Provide default values if HardwareSet_Usage is null or undefined
    const hwset1Available = hwsets?.hwset1available ?? 100; // Default to 100 if undefined
    const hwset2Available = hwsets?.hwset2available ?? 100; // Default to 100 if undefined

    return (
        <div className="project-box">
            <div className="project-info">
                <h2>{project.name}</h2>
                <p>Description: {project.description}</p>
                <p>Project ID: {project.projectId}</p>
                <p>Created By: {project.createdBy}</p>
                <p>Members: {project.users.join(', ')}</p>
            </div>

            <div className="hwsets-boxes">
                <h3>HW Set #1</h3>
                <p>Available: {hwset1Available}</p>

                <h3>HW Set #2</h3>
                <p>Available: {hwset2Available}</p>
            </div>

            <div className="request-amount">
                <h3>Request HWSet #1</h3>
                <input
                    type="number"
                    placeholder="HWSet 1 Amount"
                    value={request1}
                    onChange={(e) => setRequest1(e.target.value)}
                />

                <h3>Request HWSet #2</h3>
                <input
                    type="number"
                    placeholder="HWSet 2 Amount"
                    value={request2}
                    onChange={(e) => setRequest2(e.target.value)}
                />
            </div>

            <div className="buttons">
                <button style={{ marginRight: '20px' }}>Check-in</button>
                <button>Check-out</button>
            </div>
        </div>
    );
};

export default MyUserPortal;