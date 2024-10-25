import React, { useState } from 'react';
import './MyLoginPage.css';
import { Link } from 'react-router-dom';

const MyLoginPage = () => {
    // State to store the username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent the default form submission behavior

        // Create a payload to send to your backend
        const payload = {
            username,
            password
        };

        try {
            // Send a POST request to your backend API
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Handle the response from the backend (success or failure)
            if (data.status === 'success') {
                alert('Login successful');
                // Redirect user or take another action
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    };

    return (
        <div className="login-container">
            <div className="login-section">
                <h2>Welcome!</h2>
                <form onSubmit={handleSubmit}>

                    <div className="login-credentials">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-credentials">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>
                <div className="bottom">
                    <p>Don't have an account? <Link to="/signuppage">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default MyLoginPage;
