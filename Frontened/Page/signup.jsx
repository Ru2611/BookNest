import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../lib/api";

const Signup = ({ onSwitchToLogin, onSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const readErrorMessage = async (response) => {
    try {
      const data = await response.json();
      
      // Handle FastAPI's specific 422 Validation Error format
      if (Array.isArray(data.detail)) {
        return data.detail.map(err => `${err.loc[err.loc.length - 1]}: ${err.msg}`).join(', ');
      }
      
      return data?.detail || data?.message || "Signup failed";
    } catch {
      try {
        const text = await response.text();
        return text || "Signup failed";
      } catch {
        return "Signup failed";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
     const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone })
      });

      if (response.ok) {
        setSuccess("Signup successful. You can login now.");
        if (onSuccess) onSuccess();
        if (onSwitchToLogin) onSwitchToLogin();
      } else {
        // Now it will show the REAL error from FastAPI
        const message = await readErrorMessage(response);
        setError(`Backend Error: ${message}`);
      }
    } catch (error) {
      setError(`Cannot connect to server. Check if backend is running on ${API_BASE_URL}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '50px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Phone no:</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      {error && (
        <p style={{ marginTop: "12px", color: "#b91c1c", fontSize: "14px", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ marginTop: "12px", color: "#166534", fontSize: "14px", fontWeight: "bold" }}>
          {success}
        </p>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Already have an account?</p>
        <button 
          type="button"
          onClick={() => (onSwitchToLogin ? onSwitchToLogin() : navigate("/login"))}
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;