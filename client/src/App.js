import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MyLoginPage from './pages/MyLoginPage';
//import Project from './components/Project';
import MyRegistrationPage from './pages/MyRegistrationPage';
import MyPasswordPage from './pages/MyPasswordPage';

const App = () => (
    
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MyLoginPage />}/>
            <Route path = "/signuppage" element ={<MyRegistrationPage />}/>
            <Route path = "/passwordpage" element = {<MyPasswordPage />}/>
        </Routes>
    </BrowserRouter>
);

export default App;
