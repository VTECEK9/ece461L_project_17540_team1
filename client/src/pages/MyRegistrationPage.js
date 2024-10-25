// sign up page
import React from 'react';
import '../App.css';

const MyRegistrationPage = () => {

    return(
        <div className = "account-creation">
            <h2>Sign Up for an Account</h2>
            <form>
                <div className = "new-account">
                        <label htmlFor="firstname">First Name</label>
                        <input type = "firstname" id="firstname" required />
                    </div>

                    <div className = "new-account">
                        <label htmlFor = "lastname">Last Name</label>
                        <input type = "lastname" id = "lastname" required />
                    </div>

                    <div className = "new-account">
                        <label htmlFor = "username">Username</label>
                        <input type = "username" id = "username" required />
                    </div>

                    <div className = "new-account">
                        <label htmlFor = "password">Password</label>
                        <input type = "password" id = "password" required />
                    </div>

                    <button type = "createaccount">Create New Account</button>

            </form>




        </div>

    );



}

export default MyRegistrationPage;