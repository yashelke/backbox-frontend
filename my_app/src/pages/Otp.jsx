import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Otp.css';

function Otp() {
  const navigate = useNavigate();
  
  // State management
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  
  // Refs for OTP inputs
  const otpInputsRef = useRef([]);

  // Ensure otp is always a 6-char string (pad with empty chars for UI)
  const otpArray = Array.from({ length: 6 }, (_, i) => otp[i] || "");

  useEffect(() => {
    // focus first input when step becomes 2
    if (step === 2 && otpInputsRef.current[0]) {
      otpInputsRef.current[0].focus();
    }
  }, [step]);

  const handleOtpChange = (index, value) => {
    // accept only digits
    const digit = value.replace(/\D/g, '');
    if (!digit && value !== '') {
      return;
    }

    const newOtpArr = otpArray.slice();
    newOtpArr[index] = digit ? digit[digit.length - 1] : '';
    const newOtp = newOtpArr.join('');
    setOtp(newOtp);

    // move focus
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otpArray[index]) {
        // clear current
        const newOtpArr = otpArray.slice();
        newOtpArr[index] = '';
        setOtp(newOtpArr.join(''));
      } else if (index > 0) {
        otpInputsRef.current[index - 1]?.focus();
        const newOtpArr = otpArray.slice();
        newOtpArr[index - 1] = '';
        setOtp(newOtpArr.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;
    const newOtpArr = otpArray.slice();
    for (let i = 0; i < 6; i++) {
      newOtpArr[i] = digits[i] || '';
      if (digits[i]) {
        otpInputsRef.current[i]?.setAttribute('value', digits[i]);
      }
    }
    setOtp(newOtpArr.join(''));
    // focus next empty or last
    const firstEmpty = newOtpArr.findIndex((d) => !d);
    if (firstEmpty === -1) otpInputsRef.current[5]?.focus();
    else otpInputsRef.current[firstEmpty]?.focus();
  };

  // Request OTP - Step 1
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError("");
    setSuccess("");
    
    // Validation
    if (!email) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/request-otp", {
        email: email
      });

      if (response.status === 200) {
        setSuccess("OTP sent successfully! Check your email.");
        setStep(2); // Move to OTP input step
        
        // Start 60 second timer for resend
        setResendTimer(60);
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage?.toLowerCase().includes("no account found") ||
            errorMessage?.toLowerCase().includes("user does not exist")) {
          setError("No account found with this email. Please sign up first.");
        } else {
          setError(errorMessage || "Failed to send OTP. Please try again.");
        }
      } else if (error.request) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Request OTP failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP - Step 2
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError("");
    setSuccess("");
    
    // Validation
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/users/verify-otp", {
        email: email,
        otp: otp
      });

      if (response.status === 200) {
        setSuccess("OTP verified successfully! Logging you in...");
        
        // Store JWT token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Clear form
        setEmail("");
        setOtp("");
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate("/greet");
        }, 1500);
      }

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        setError(errorMessage || "Invalid OTP. Please try again.");
      } else if (error.request) {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Verify OTP failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    setOtp("");
    handleRequestOTP({ preventDefault: () => {} });
  };

  // Go back to email input
  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <>
      <div className="otp-container">
        <form className="otp-form" onSubmit={step === 1 ? handleRequestOTP : handleVerifyOTP}>
          <h2 className="otp-title">
            {step === 1 ? "🔐 OTP Login" : "✉️ Verify OTP"}
          </h2>

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

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="form-group">
              <label htmlFor="email">Enter your email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={loading}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`otp-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <div className="form-group">
              <p className="otp-instruction">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </p>
              
              <label htmlFor="otp">Enter OTP:</label>
              <div className="otp-grid" onPaste={handlePaste}>
                {otpArray.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpInputsRef.current[i] = el)}
                    className="otp-cell"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    disabled={loading}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`otp-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              {/* Resend OTP */}
              <div className="resend-section">
                {resendTimer > 0 ? (
                  <p className="resend-timer">Resend OTP in {resendTimer}s</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="resend-btn"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Back button */}
              <button
                type="button"
                onClick={handleBackToEmail}
                className="back-btn"
                disabled={loading}
              >
                ← Change Email
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="back-to-login">
            <label>
              Remember your password?{' '}
              <a onClick={() => navigate("/")}>Login here</a>
            </label>
          </div>
        </form>
      </div>
    </>
  );
}

export default Otp;