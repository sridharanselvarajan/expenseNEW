import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

function Auth({ isLoggedIn, setIsLoggedIn, setUsername }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setLocalUsername] = useState("");
  const [email, setEmail] = useState(""); // Only used for signup
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError(""); // Clear previous errors

    if (!username.trim() || !password.trim()) {
      setError("Username and password cannot be empty.");
      return;
    }

    try {
      if (isSignup) {
        // **Signup API Request**
        const response = await axios.post("http://localhost:5000/api/v1/register", {
          username,
          email,
          password,
        });

        setIsSignup(false);
        setError("Account created successfully! Please login.");
      } else {
        // **Login API Request**
        const response = await axios.post("http://localhost:5000/api/v1/login", {
          username,
          password,
        });

        // If backend returns a token, store it
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);

        setUsername(response.data.username);
        setIsLoggedIn(true);
        setError("");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <AuthStyled>
      <div className="auth-form">
        {!isLoggedIn ? (
          <>
            <h2>{isSignup ? "Signup" : "Login"}</h2>
            {error && <p className="error">{error}</p>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setLocalUsername(e.target.value)}
            />
            {isSignup && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleAuth}>{isSignup ? "Sign Up" : "Login"}</button>
            <p onClick={() => setIsSignup(!isSignup)} className="toggle">
              {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
            </p>
          </>
        ) : (
          <>
            {/* Removed Welcome message and logout button */}
          </>
        )}
      </div>
    </AuthStyled>
  );
}

const AuthStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height for vertical centering */
  background: linear-gradient(135deg, #e1bee7, #c5cae9);

  /* Auth form styles */
  .auth-form {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px; /* Restrict the maximum width */
    box-sizing: border-box; /* Ensure padding doesn't exceed the width */
    transition: all 0.3s ease-in-out;

    /* Form heading */
    h2 {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }

    /* Error message styles */
    .error {
      color: #ff4d4d;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      font-weight: 500;
    }

    /* Input field styles */
    input {
      width: 100%;
      padding: 1rem;
      margin-bottom: 1.5rem;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        border-color: #4caf50;
        outline: none;
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
      }
    }

    /* Button styles */
    button {
      width: 100%;
      padding: 1rem;
      background-color: #4caf50;
      color: white;
      font-size: 1.1rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        background-color: #45a049;
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.98);
      }
    }

    /* Toggle link styles */
    .toggle {
      color: #007bff;
      cursor: pointer;
      margin-top: 10px;
      text-decoration: underline;
      font-size: 0.95rem;
    }
  }
`;

export default Auth;
