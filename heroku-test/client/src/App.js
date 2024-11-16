import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MyLoginPage from './MyLoginPage';
import MyRegistrationPage from './MyRegistrationPage';
import MyUserPortal from './MyUserPortal';

const App = () => (
    

  <BrowserRouter>
        <Routes>
          <Route path="/" element={<MyLoginPage />}/>
          <Route path = "/signuppage" element ={<MyRegistrationPage />}/>
          <Route path = "/projectpage" element = {<MyUserPortal />}/>

        </Routes>
  </BrowserRouter>

);

export default App;
