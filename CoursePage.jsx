import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CourseStyles.css';
import axios from 'axios';

const CoursePage = () => {
    const navigate = useNavigate();
    const [coursename, setCourseName] = useState("");
    const [importance, setImportance] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if all fields are filled
        if (!coursename || !importance) {
            setError("Please fill all fields.");
            return;
        }

        try {
            // Post the new course data to the server
            const result = await axios.post('http://localhost:3001/addClass', { coursename, importance });
            console.log(result);
            setSuccess("Course added successfully!");
            setError("");
            // Navigate to the schedule page after 2 seconds
            setTimeout(() => navigate("/schedule"), 2000);
        } catch (err) {
            console.error('Error:', err);
            setError("Failed to add course. Please try again.");
            setSuccess("");
        }
    };

    return (
        <div className="course-form">
            <h2>Add New Course</h2>
            {/* Display error or success message */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <form onSubmit={handleSubmit}>
                <label htmlFor='coursename'>Course Name:</label>
                <input 
                    type="text"
                    placeholder='Enter your course name'
                    autoComplete='off'
                    name='coursename'
                    value={coursename}
                    onChange={(e) => setCourseName(e.target.value)}
                    aria-label="Course Name"
                />
                
                <label htmlFor='importance'>How important is this class?</label>
                <select
                    name='importance'
                    value={importance}
                    onChange={(e) => setImportance(e.target.value)}
                    aria-label="Importance"
                >
                    <option value="">Select Importance</option>
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Low-Medium</option>
                    <option value="3">3 - Medium</option>
                    <option value="4">4 - Medium-High</option>
                    <option value="5">5 - High</option>
                </select>
                
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
};

export default CoursePage;
