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


    // for hardware ests
    const [hwsets, setHWsets] = useState([
        // Initial hardware set data for name, available, and capacity
        { id: 1, hwset1capacity: 45, hwset1available: 20, hwset2capacity: 40, hwset2available: 30},
    ]);
    

    useEffect(() => {
        const fetchProjects = async () => {
            const userId = localStorage.getItem('userId');
            console.log('Fetching projects for userId:', userId);

            try {
                const response = await fetch('http://localhost:5000/get_user_projects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId })
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
        setCreateProject(true);
    };

     // Function to handle creating a new project
     const handleSaveProject = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        console.log('Retrieved userId from localStorage:', userId); // Debug print

        // Check if userId exists
        if (!userId) {
            alert('User ID not found. Please log in again.');
            return;
        }

        const projectData = {
            projectName,
            projectDescription,
            projectId: newProjectId,
            userId
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
                            hwsets = {hwsets[0]} // passing in example values for hwset
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
    const[request, setRequest] = React.useState('');

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
                <p> Capacity: {hwsets.hwset1capacity}</p>
                <p> Available: {hwsets.hwset1available}</p>

                <h3>HW Set #2</h3>
                <p> Capacity: {hwsets.hwset2capacity}</p>
                <p> Available: {hwsets.hwset2available}</p>

            </div>

            <div className= "request-amount">

                <h3>Request</h3>

                <input
                type= "number"
                placeholder = "Request Amount"
                value = {request}
                onChange={(e) => setRequest(e.target.value)}
                />
            
            </div>

            <div className= "buttons">
                <button style= {{marginRight: '20px'}}>Check-in</button>
                <button>Check-out</button>
            </div>



        </div>
    );
};

export default MyUserPortal;