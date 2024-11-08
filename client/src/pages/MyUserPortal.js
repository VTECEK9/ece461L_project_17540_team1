import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MyUserPortal = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <p><Link to="/checkout">Resources Management</Link></p>

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
                            onJoin={handleJoinProject}    // Now matches the function name
                            onLeave={handleLeaveProject}  // Now matches the function name
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Project = ({ project, onJoin, onLeave }) => {
    return (
        <div className="project-box">
            <div className="project-info">
                <h2>{project.name}</h2>
                <p>Description: {project.description}</p>
                <p>Project ID: {project.projectId}</p>
                <p>Created By: {project.createdBy}</p>
            </div>

            <div className="project-users">
                <p>Members: {project.users.join(', ')}</p>
            </div>

            <div className="project-actions">
                <button
                    className="action-button"
                    onClick={() => project.authorized ? onLeave(project.id) : onJoin(project.id)}
                >
                    {project.authorized ? 'Leave' : 'Join'}
                </button>
            </div>
        </div>
    );
};

export default MyUserPortal;