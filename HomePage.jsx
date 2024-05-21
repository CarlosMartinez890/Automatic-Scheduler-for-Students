import React from "react";
import { useNavigate } from "react-router-dom";
import './styles.css'; // Make sure to update the CSS file with the new styles below

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Automated Schedule for Students</h1>
                <p>Manage your academic life with ease and efficiency.</p>
            </header>
            <div className="button-container">
                <button className="button login" onClick={() => navigate("/login")}>
                    Login
                </button>
                <button className="button register" onClick={() => navigate("/register")}>
                    Register
                </button>
            </div>
            <footer className="home-footer">
                <p>
                    This app is designed to help students who struggle with procrastination
                    by creating a weekly automated schedule for them.
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
