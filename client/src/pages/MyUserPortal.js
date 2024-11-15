import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MyUserPortal = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [createProject, setCreateProject] = useState(false);
    const [joinProject, setJoinProject] = useState(false);

    // Separate state variables for each form
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [joinProjectId, setJoinProjectId] = useState('');  // For joining projects
    const [newProjectId, setNewProjectId] = useState('');    // For creating projects

    const username = localStorage.getItem('username');

    
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

    

   

    const toggleCreateProject = () => {
        setCreateProject((prevState) => !prevState); // Toggle create project form
        if (joinProject) setJoinProject(false); // Close join project form if open
    };

    const toggleJoinProject = () => {
        setJoinProject((prevState) => !prevState); // Toggle join project form
        if (createProject) setCreateProject(false); // Close create project form if open
    };

    const handleSaveProject = async (e) => {
        e.preventDefault();

        console.log('Retrieved username from localStorage:', username); // Debug print

        if (!username) {
            alert('Username not found. Please log in again.');
            return;
        }

        const projectData = {
            projectName,
            projectDescription,
            projectId: newProjectId,
            username,
        };

        console.log('Sending project data:', projectData);

        try {
            const response = await fetch('http://localhost:5000/create_project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            const data = await response.json();
            console.log('Response data:', data);

            if (data.status === 'success') {
                alert('Project created successfully');
                setCreateProject(false);
                setProjectName('');
                setProjectDescription('');
                setNewProjectId('');
                window.location.reload(); // Reload projects
            } else {
                alert(data.message || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error details:', error);
            alert('An error occurred while creating the project');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleJoinProject = async (e) => {
        e.preventDefault();

        if (!username) {
            alert('Username not found. Please log in again.');
            return;
        }

        const joinData = {
            projectId: joinProjectId,
            username,
        };

        console.log('Sending join request:', joinData);

        try {
            const response = await fetch('http://localhost:5000/join_project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(joinData),
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Successfully joined project');
                setJoinProjectId(''); // Clear the input field
                fetchProjects(); // Refresh projects
                window.location.reload(); // Reload projects
            } else {
                alert(data.message || 'Failed to join project');
            }
        } catch (error) {
            console.error('Error details:', error);
            alert('An error occurred while joining the project');
        }
    };

    if (loading) {
        return <div>Loading projects...</div>;
    }

    return (
        <div className="projects-container">
            <div className="Homepage">
                <p><Link to="/">Back to login</Link></p>
            </div>

            <h1>My Projects</h1>

            <div className="create-project">
                <button onClick={toggleCreateProject}>Create New Project</button>
                <button onClick={toggleJoinProject}>Join a Project</button>

                {/* Join Project Form */}
                {joinProject && (
                    <form onSubmit={handleJoinProject}>
                        <div className="join-project">
                            <label htmlFor="join-projectid">Project ID</label>
                            <input
                                type="text"
                                id="join-projectid"
                                value={joinProjectId}
                                onChange={(e) => setJoinProjectId(e.target.value)} // Update state on input change
                                required
                            />
                        </div>
                        <button type="submit">Join This Project</button>
                    </form>
                )}

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

                            <button type="submit">Save New Project</button>
                        </form>
                    </div>
                )}
            </div>

            {projects.length === 0 ? (
                <div>
                    <p>No projects found.</p>
                </div>
            ) : (
                <div>
                    {projects.map((project) => (
                        <Project
                            key={project.id}
                            project={project}
                            hwsets={project.HardwareSet_Usage}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Project = ({ project, hwsets }) => {
    const [request1, setRequest1] = React.useState('');
    const [request2, setRequest2] = React.useState('');

    const hwset1Available = hwsets?.hwset1available ?? 100;
    const hwset2Available = hwsets?.hwset2available ?? 100;

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
