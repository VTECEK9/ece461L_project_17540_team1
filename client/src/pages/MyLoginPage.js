import React from 'react';
import './MyLoginPage.css';


const MyLoginPage = () => {

    return(
        <div className="login-container">
           <div className="login-section">
            <h2>Welcome!</h2>
            <form>

                <div className = "login-credentials">
                    <label htmlFor="username">Username</label>
                    <input type = "username" id="username" required />
                </div>

                <div className = "login-credentials">
                    <label htmlFor = "password">Password</label>
                    <input type = "password" id = "password" required />
                </div>
                
                <button type = "submit">Login</button>
            </form>
            <div className = "bottom">
                <p>Don't have an account? <a href = "#" >Sign up</a></p>
            </div>
           </div>
        </div>
 
    );

};

export default MyLoginPage;