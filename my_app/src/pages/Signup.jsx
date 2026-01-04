import React from 'react'
import {useState,useEffect,useRef} from "react";
import "./Signup.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


function Signup() {

    const navigate = useNavigate();
    
    // State management
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const inputRef = useRef(null);

    function handleNavigateToLogin()
    {
        navigate("/");
    }

    function handleFocus()
    {
        inputRef.current.focus();
    }

    // Enhanced Signup Function with Backend Integration
    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent form default submission
        
        // Clear previous messages
        setError("");
        setSuccess("");
        
        // Validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/users/signup`, {
                email: email,
                password: password
            });

            // Success handling
            if (response.status === 201) {
                setSuccess("Account created successfully! Redirecting to login...");
                
                // Clear form
                setEmail("");
                setPassword("");
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
           
        } catch (error) {
            // Enhanced error handling
            if (error.response) {
                // Server responded with error
                setError(error.response.data.message || "Signup failed. Please try again.");
            } else if (error.request) {
                // Request made but no response
                setError("Cannot connect to server. Please check if the backend is running.");
            } else {
                // Other errors
                setError("An unexpected error occurred. Please try again.");
            }
            console.error("Signup failed: ", error.message);
        } finally {
            setLoading(false);
        }
    }
  return (
   <>
   <form className="form-container" onSubmit={handleSignup}>
    <h2 className="form-title">SignUp</h2>

    {/* Error Message */}
    {error && (
        <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            fontSize: '0.9rem',
            textAlign: 'center'
        }}>
            {error}
        </div>
    )}

    {/* Success Message */}
    {success && (
        <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#d1fae5',
            color: '#059669',
            borderRadius: '8px',
            fontSize: '0.9rem',
            textAlign: 'center'
        }}>
            {success}
        </div>
    )}

    <div className="form-group">
        <label htmlFor="email">Email:-</label>
        <input 
            ref={inputRef} 
            type="email" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            disabled={loading}
            required 
        />

        <label htmlFor="password">Password:-</label>
        <input 
            type="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" 
            disabled={loading}
            required 
        />

        <div className="signup-btn">
            <button 
                type="submit" 
                disabled={loading}
                className={loading ? 'loading' : ''}
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>
        </div>
    </div>

    <div className="another-method">
        <label>Already have an account?<a onClick={handleNavigateToLogin}>Login here!</a></label>
    </div>
   </form>
   
   
   
   </>
  )
}

export default Signup