// sign up page
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MyRegistrationPage = () => {
    // State to store form input values
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();  // Prevent the form from refreshing the page

        // Create a payload to send to your backend
        const payload = {
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
            userId: firstName[0] + lastName[0] + username[0] + password[0]
        };

        try {
            // Send a POST request to your backend API
            const response = await fetch('http://localhost:5000/add_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });


            const data = await response.json();

            // Handle the response from the backend (success or failure)
            if (data.status === 'success') {
                alert('Account created successfully');
                // Optionally, redirect the user to the login page or another route
            } else {
                alert('Error creating account: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during account creation');
        }
    };

    return (
        <div className="account-creation">
            <h2>Sign Up for an Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="new-account">
                    <label htmlFor="firstname">First Name</label>
                    <input
                        type="text"
                        id="firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="new-account">
                    <label htmlFor="lastname">Last Name</label>
                    <input
                        type="text"
                        id="lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="new-account">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="new-account">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Create New Account</button>
            </form>
        </div>
    );
};

export default MyRegistrationPage;
