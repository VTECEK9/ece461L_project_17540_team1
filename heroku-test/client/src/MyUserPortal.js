import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import './App.css';

const MyUserPortal = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const [createProject, setCreateProject] = useState(false);

    // Separate state variables for each form
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [joinProjectId, setJoinProjectId] = useState('');  // For joining projects
    const [newProjectId, setNewProjectId] = useState('');    // For creating projects


    const handleLogout = () => {
        navigate('/');
    }



    const username = localStorage.getItem('username');


    

        const fetchProjects = async () => {
            console.log('Fetching projects for username:', username);

            try {
                const response = await fetch('https://newwork-e10776885ec1.herokuapp.com/get_user_projects', {
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

        
    
     useEffect(() => {
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
            const response = await fetch('https://newwork-e10776885ec1.herokuapp.com/create_project', {
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
                try {
                    const projectsResponse = await fetch('https://newwork-e10776885ec1.herokuapp.com/get_user_projects', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username })
                    });
    
                    const projectsData = await projectsResponse.json();
                    if (projectsData.status === 'success') {
                        setProjects(projectsData.projects);  // Update the projects state
                    }
                } catch (error) {
                    console.error('Error fetching updated projects:', error);
                }
            } else {
                alert(data.message || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error details:', error); // Enhanced error logging
            alert('An error occurred while creating the project');
        }
    };

    // Changed function names to match what's being passed to Project component
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
            const response = await fetch('https://newwork-e10776885ec1.herokuapp.com/join_project', {
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
                

                try {
                    const projectsResponse = await fetch('https://newwork-e10776885ec1.herokuapp.com/get_user_projects', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username })
                    });
    
                    const projectsData = await projectsResponse.json();
                    if (projectsData.status === 'success') {
                        setProjects(projectsData.projects);  // Update the projects state
                    }
                } catch (error) {
                    console.error('Error fetching updated projects:', error);
                }


            } else {
                alert(data.message || 'Failed to join project');
            }
        } catch (error) {
            console.error('Error details:', error);
            alert('An error occurred while joining the project');
        }
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
            <div className = "Homepage">
    
                <button className="logout" onClick={handleLogout}>Logout</button>
            </div>

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

            <div classname = "capacityamount">
                <h4>Global Capacity Amount for HWSets: 100</h4>
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
                            hwsets = {project.HardwareSet_Usage} // passing in example values for hwset
                            hwsetsavail1 = {project.HWSet1_Availability}
                            hwsetsavail2 = {project.HWSet2_Availability}

                            onJoin={handleJoinProject}    // Now matches the function name
                            onLeave={handleLeaveProject}  // Now matches the function name
                            setProjects={setProjects}
                            refreshProjects = {fetchProjects} 
                        />
                    ))}
                </div>
            )}
        
        </div>
    );
};

// Project.js component
const Project = ({ project, username, refreshProjects, setProjects, onJoin, onLeave, hwset, hwsetsavail1, hwsetsavail2}) => {
    const [request1, setRequest1] = useState(0);
    const [request2, setRequest2] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    //const hwset1Available = availability?.hwset1available ?? 100;
    //const hwset2Available = availability?.hwset2available ?? 100;
    const hwset1CheckedOut = project.HardwareSet_Usage?.HWSet1 ?? 0;
    const hwset2CheckedOut = project.HardwareSet_Usage?.HWSet2 ?? 0;


    const handleCheckIn = async (e, setType) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const requestAmount = setType === 1 ? request1 : request2;
            const requestData = {
                projectId: project.projectId,
                amount: requestAmount
            };
    
            const response = await fetch(`https://newwork-e10776885ec1.herokuapp.com/checkin_HWset${setType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
    
            const data = await response.json();
    
            if (data.status === 'success') {
                alert(`Successfully checked in Hardware Set ${setType}`);
                setType === 1 ? setRequest1(request1) : setRequest2(request2);

                await refreshProjects();

            } else {
                alert(data.message || `Failed to check in Hardware Set ${setType}`);
            }
        } catch (error) {
            console.error('Error checking in hardware:', error);
            alert('An error occurred while checking in hardware');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestHWSet = async (e, setType) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const requestData = {
                projectId: project.projectId,
                amount: setType === 1 ? request1 : request2
            };

            // Validate request
            const requestAmount = setType === 1 ? request1 : request2;
            //const availableAmount = setType === 1 ? hwset1Available : hwset2Available;

            if (requestAmount < 0) {
                alert('Request amount cannot be negative');
                return;
            }

            // if (requestAmount > availableAmount) {
            //     alert(`Cannot request more than available amount (${availableAmount})`);
            //     return;
            // }

            const response = await fetch(`https://newwork-e10776885ec1.herokuapp.com/request_HWset${setType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert(`Successfully requested Hardware Set ${setType}`);
                // Reset the request amount
                setType === 1 ? setRequest1(request1) : setRequest2(request2);
                // Trigger a refresh of the project data here
            

            
                await refreshProjects();
            }
            
            else if (data.status === 'error') {
                setType === 1 ? setRequest1(request1) : setRequest2(request2);
                // Trigger a refresh of the project data here
                
                alert('ERROR: Insufficient Hardware Availability.')

            
                await refreshProjects();

            }




             else {
                alert(data.message || `Failed to Request Hardware Set ${setType}`);
            }
        } catch (error) {
            console.error('Error requesting hardware:', error);
            alert('An error occurred while requesting hardware');
        } finally {
            setIsLoading(false);
        }
    };

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
                <p>Available: {project.HWSet1_Availability}</p>
                <p>Checked Out: {project.HardwareSet_Usage.HWSet1}</p>
    
                <h3>HW Set #2</h3>
                <p>Available: {project.HWSet2_Availability}</p>
                <p>Checked Out: {project.HardwareSet_Usage.HWSet2}</p>
            </div>
    
            <div className="request-amount">
                <form onSubmit={(e) => e.preventDefault()}> 
                    <div>
                        <h3>HWSet #1</h3>
                        <input
                            type="number"
                            min="0"
                        
                            value={request1}
                            onChange={(e) => setRequest1(parseInt(e.target.value) || 0)}
                        />
                        <button 
                            onClick={(e) => handleRequestHWSet(e, 1)}
                            disabled={isLoading || request1 <= 0}
                        >
                            Check-out Set 1
                        </button>
                        <button 
                            onClick={(e) => handleCheckIn(e, 1)}
                            disabled={isLoading}
                        >
                            Check-in Set 1
                        </button>
                    </div>
    
                    <div>
                        <h3>HWSet #2</h3>
                        <input
                            type="number"
                            min="0"
                            value={request2}
                            onChange={(e) => setRequest2(parseInt(e.target.value) || 0)}
                        />
                        <button 
                            onClick={(e) => handleRequestHWSet(e, 2)}
                            disabled={isLoading || request2 <= 0}
                        >
                            Check-out Set 2
                        </button>
                        <button 
                            onClick={(e) => handleCheckIn(e, 2)}
                            disabled={isLoading}
                        >
                            Check-in Set 2
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyUserPortal;