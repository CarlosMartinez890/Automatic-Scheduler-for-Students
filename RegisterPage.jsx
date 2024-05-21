import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterStyles.css'; // Ensure this file exists and contains your styles

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await axios.post('http://localhost:3001/register', { username, email, password });
            console.log(result);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError("Failed to register. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="username">Create a Username:</label>
                    <input
                        type="text"
                        placeholder='Enter your username'
                        autoComplete='off'
                        name='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Enter your Email:</label>
                    <input
                        type="email"
                        placeholder='Enter your email'
                        autoComplete='off'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Create a Password:</label>
                    <input
                        type="password"
                        placeholder='Enter your password'
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <button type="button" onClick={() => navigate("/login")} disabled={loading}>
                    Already have an account? Login
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
