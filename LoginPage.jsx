// Import necessary React hooks and components.
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
// Import custom CSS styles for this component.
import './LoginStyles.css'; // Make sure the path to CSS file is correct

// Define the functional component for the login page.
const LoginPage = () => {
    const navigate = useNavigate();
    // State to hold the username input by the user.
    const [username, setUsername] = useState("");
    // State to hold the password input by the user.
    const [password, setPassword] = useState("");
    // State to display any error messages related to login.
    const [error, setError] = useState("");
    // State to control UI elements during loading (e.g., disable the login button).
    const [loading, setLoading] = useState(false);
    // Ref to automatically focus the username input field when the component mounts or after a failed login attempt.
    const usernameInputRef = useRef(null);

    // Hook to automatically focus the username input field on component mount.
    useEffect(() => {
        usernameInputRef.current.focus();
    }, []);

    // Function to handle form submission for logging in.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the form from causing a page reload.
        setError(""); // Clear any existing errors.
        setLoading(true); // Indicate that the login process has started.
    
        try {
            // Post login credentials to the server.
            const response = await axios.post("http://localhost:3001/login", { username, password });
            // Navigate to the schedule page on successful login.
            if (response.data === "success") {
                navigate("/schedule");
            } else {
                // Display an error message on authentication failure.
                setError("Invalid credentials");
                usernameInputRef.current.focus(); // Focus username input for correction.
            }
        } catch (err) {
            // Handle exceptions by setting an error message and refocusing the username input.
            setError("Something went wrong. Please try again later.");
            usernameInputRef.current.focus();
        }
        setLoading(false); // Reset the loading state regardless of the outcome.
    };

    // Render the login form.
    return (
        <div className="home-container">
            <form onSubmit={handleSubmit} className="form-container">
                <h1>Login</h1>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        ref={usernameInputRef}
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        autoComplete="off"
                        name="username"
                        value={username}
                        onChange={(e) => {
                            if (error) setError(""); // Clear error when user starts typing.
                            setUsername(e.target.value);
                        }}
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            if (error) setError(""); // Clear error when user starts typing.
                            setPassword(e.target.value);
                        }}
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="error" aria-live="assertive">{error}</p>} // Accessibility enhancement for dynamic content.
            </form>
        </div>
    );
};

// Export the LoginPage component as the default export.
export default LoginPage;
