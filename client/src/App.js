import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MyLoginPage from './pages/MyLoginPage';
//import Project from './components/Project';
import MyRegistrationPage from './pages/MyRegistrationPage';
import MyPasswordPage from './pages/MyPasswordPage';
import MyUserPortal from './pages/MyUserPortal';
import Checkout from './components/Checkout';
import Project from './components/Project';

const App = () => (
    
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<MyLoginPage />}/>
            <Route path="/checkout" element ={<Checkout />}/>
            <Route path="/createprojects" element ={<Project />}/>
            <Route path = "/signuppage" element ={<MyRegistrationPage />}/>
            <Route path = "/passwordpage" element = {<MyPasswordPage />}/>
            <Route path = "/projectpage" element = {<MyUserPortal />}/>
        </Routes>
    </BrowserRouter>
);

export default App;
