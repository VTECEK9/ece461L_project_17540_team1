import React, {useState} from 'react';
import '../App.css';


const Project = () => {

    const[createProject, newProject] = useState(false);

    const handleCreateProject = () => {
        newProject(true);
    };

    const handleNotCreateProject = () => {
        newProject(false);
    };

    return (
        <div className = "create-project">
            <h2>Projects</h2>
            <button onClick = {handleCreateProject}>Create New Project</button>
            {createProject && (
                <div className = "project-details">
                    <h2>Project Details</h2>
                    <form>
                        <div className = "new-project">
                        <label htmlFor="projectname">Project Name</label>
                        <input type = "projectname" id="projectname" required />
                        </div>

                        <div className = "new-project">
                        <label htmlFor = "projectdescription">Project Description</label>
                        <input type = "projectdescription" id = "projectdescription" required />
                        </div>

                        <div className = "new-project">
                        <label htmlFor = "projectid">Project ID</label>
                        <input type = "projectid" id = "projectid" required />
                        </div>

                        <button type = "savedetails">Save New Project Details</button>
                    </form>
            </div>
            )}
        </div>
    );


}

export default Project;