// password page
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const MyPasswordPage = () => {

    const handleRecovery = () => {
        alert("Email sent!")
    }

    return(
        <div className = "account-creation">
            <div className = "new-account">
                <p><Link to = "/">Back to homepage</Link></p>
            </div>
            <h2>Recover your password</h2>
            <form>
                <div className = "new-account">
                    <label htmlFor = "username">Username</label>
                    <input type = "username" id = "username" required />
                </div>

                <div className = "new-account">
                    <label htmlFor = "email">Email</label>
                    <input type = "email" id = "email" required />
                </div>

                <button type = "recoverpassword" onClick={handleRecovery}>Send password email</button>
                
            </form>

        </div>

    );

}

export default MyPasswordPage;