import './App.css';
import LoginForm from '../auth/LoginForm'
import SignUpForm from '../user/SignUpForm'
import React, { useState } from 'react';
import Feed from '../feed/Feed'
import Edit from '../edit/Edit'
import {
  useNavigate,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from '../navbar/Navbar';

const App = () => {
    return (
        <>
        <Navbar />

        <Routes>
          <Route path='/'  element={<LoginForm navigate={ useNavigate() }/>}/>
          <Route path='/notes/edit/:id' element={<Edit navigate ={ useNavigate()}/>}/>
          <Route path='/notes'  element={<Feed navigate={ useNavigate() }/>}/>
          <Route path='/login'  element={<LoginForm  navigate={ useNavigate() }/>}/>
          <Route path='/signup' element={<SignUpForm navigate={ useNavigate() }/>}/>
        </Routes>

      </>
    );
}

export default App;
