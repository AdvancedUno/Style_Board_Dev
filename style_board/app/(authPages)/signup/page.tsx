"use client";
import React, { useState, useRef,useEffect } from "react";
import { useRouter } from 'next/navigation';
import Router from 'next/router';

import '@/styles/signup.css'; 

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if(confirmPassword != password){
        alert("Password doesn't match. Retype your password");
        setConfirmPassword("");
        return;
    }
    try{
        const response = await fetch(`/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,password}),
        });

        // console.log(response.ok);
        router.push('/');
    }catch(error){
        console.log(error);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">SIGN UP</h2>
      {error && <p className="signup-error">{error}</p>}
      <form onSubmit={handleSignup} className="signup-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}
