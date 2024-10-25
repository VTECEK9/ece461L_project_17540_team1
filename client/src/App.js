import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MyLoginPage from './pages/MyLoginPage';
//import Project from './components/Project';
import MyRegistrationPage from './pages/MyRegistrationPage';

const App = () => (
    
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MyLoginPage />}/>
            <Route path = "/signuppage" element ={<MyRegistrationPage />}/>
        </Routes>
    </BrowserRouter>
);

export default App;
