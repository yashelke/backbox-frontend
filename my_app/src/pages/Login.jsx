import React from 'react'
import {useState} from "react";
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  
  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleNavigateToSignup()
  {
      navigate("/signup");
  }

  function handleNavigateToOtp()
  {
      navigate("/otp");
  }

  // Enhanced Login Function with Backend Integration
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form default submission
    
    // Clear previous messages
    setError("");
    setSuccess("");
    
    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
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
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email: email,
        password: password
      });

      // Success handling
      if (response.status === 200) {
        setSuccess("Login successful! Redirecting...");
        
        // Store JWT token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Clear form
        setEmail("");
        setPassword("");
        
        // Redirect to dashboard/home after 1.5 seconds
        setTimeout(() => {
          navigate("/greet"); // Change to your desired route
        }, 1500);
      }
  
    } catch (error) {
      // Enhanced error handling with user existence check
      if (error.response) {
        const errorMessage = error.response.data.message;
        
        // Check if user doesn't exist
        if (errorMessage === "User does not exist." || 
            errorMessage?.toLowerCase().includes("user does not exist") ||
            errorMessage?.toLowerCase().includes("user not found")) {
          setError("No account found with this email. Please sign up first.");
        }
        // Check if password is incorrect
        else if (errorMessage === "Invalid credentials." ||
                 errorMessage?.toLowerCase().includes("invalid credentials") ||
                 errorMessage?.toLowerCase().includes("incorrect password")) {
          setError("Incorrect password. Please try again.");
        }
        // Generic server error
        else {
          setError(errorMessage || "Login failed. Please try again.");
        }
      } else if (error.request) {
        // Request made but no response
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login failed: ", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
   <>
   <form className="form-container" onSubmit={handleLogin}>
    <h2 className="form-title">Login</h2>

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

    <div className="login-btn">
      <button 
        type="submit" 
        disabled={loading}
        className={loading ? 'loading' : ''}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
</div>

<div className="signup-link">
    <label>Don't have an account?<a onClick={handleNavigateToSignup}>SignUp here!</a></label>
</div>
 <div className="otp-method">
  <label>Trouble Logging in? <a onClick={handleNavigateToOtp}>GET OTP</a></label>
 </div>
   </form>
   
   </>
  )
}

export default Login