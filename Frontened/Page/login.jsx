import React, { useState } from 'react';
import { setUserId } from "../lib/auth";

const Login = ({ onSwitchToSignup, onSuccess }) => {  // Receive the prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const readErrorMessage = async (response) => {
    try {
      const data = await response.json();
      return data?.detail || data?.message || "Login failed";
    } catch {
      try {
        const text = await response.text();
        return text || "Login failed";
      } catch {
        return "Login failed";
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
       if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Preferred: JSON body
      let response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Backward-compat (older backend): query params
      if (response.status === 404 || response.status === 405) {
        response = await fetch(
          `http://localhost:8000/login?email=${encodeURIComponent(
            email
          )}&password=${encodeURIComponent(password)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (response.ok) {
        let data = {};
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        setSuccess("Login successful.");
        setUserId(data.user_id || data.userId || data.id || "demo-user");
        onSuccess?.();
      } else {
        setError(await readErrorMessage(response));
      }
    } catch (error) {
      setError("Cannot connect to server. Make sure backend is running on http://localhost:8000.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginTop: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {error ? (
        <p style={{ marginTop: "12px", color: "#b91c1c", fontSize: "14px" }}>
          {error}
        </p>
      ) : null}

      {success ? (
        <p style={{ marginTop: "12px", color: "#166534", fontSize: "14px" }}>
          {success}
        </p>
      ) : null}
      
      {/* Signup Link */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>New user? Please register</p>
        <button 
          onClick={onSwitchToSignup}  // This switches to signup form
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
