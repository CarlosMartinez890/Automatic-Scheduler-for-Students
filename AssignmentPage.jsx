import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AssignmentStyles.css';
import axios from 'axios';

const AssignmentPage = () => {
    const navigate = useNavigate();
    const [assignmentName, setAssignmentName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [difficulty, setDifficulty] = useState(5);
    const [estimatedTime, setEstimatedTime] = useState({ hours: 0, minutes: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch courses from the server when the component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:3001/classes');
                const data = await response.json();
                setCourses(data);
                if (data.length > 0) {
                    setSelectedCourse(data[0]._id);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
                setMessage('Failed to load courses. Please try again later.');
            }
        };

        fetchCourses();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        
        // Calculate total estimated time in minutes
        const totalMinutes = estimatedTime.hours * 60 + estimatedTime.minutes;

        try {
            const course = courses.find(course => course._id === selectedCourse);
            const result = await axios.post('http://localhost:3001/addAssignment', {
                assignmentName,
                dueDate,
                course: {
                    name: course.coursename,
                    importance: course.importance,
                    courseId: selectedCourse,
                },
                difficulty,
                estimatedTime: totalMinutes,
            });
            console.log(result);
            setMessage('Assignment added successfully!');
            // Navigate to the schedule page after 2 seconds
            setTimeout(() => navigate("/schedule"), 2000);
        } catch (err) {
            console.error('Error:', err);
            setMessage('Failed to add assignment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="assignment-form">
                {message && <p className={`message ${message.includes('successfully') ? 'success-message' : 'error-message'}`}>{message}</p>}
                <div>
                    <label htmlFor="assignmentName">Assignment Name:</label>
                    <input 
                        type="text"
                        placeholder="Enter your assignment name"
                        autoComplete="off"
                        name="assignmentName"
                        id="assignmentName"
                        value={assignmentName}
                        onChange={(e) => setAssignmentName(e.target.value)}
                        aria-label="Assignment Name"
                    />
                </div>
                <div>
                    <label htmlFor="dueDate">Due Date:</label>
                    <input 
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        aria-label="Due Date"
                    />
                </div>
                <div>
                    <label htmlFor="course">Course:</label>
                    <select
                        name="course"
                        id="course"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        aria-label="Course"
                    >
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.coursename} 
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="difficulty">Difficulty (1-10):</label>
                    <input 
                        type="range"
                        min="1"
                        max="10"
                        name="difficulty"
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        aria-label="Difficulty"
                    />
                </div>
                <div>
                    <label htmlFor="estimatedTimeHours">Hours:</label>
                    <input 
                        type="number" 
                        name="estimatedTimeHours" 
                        id="estimatedTimeHours"
                        min="0"
                        value={estimatedTime.hours}
                        onChange={(e) => setEstimatedTime({ ...estimatedTime, hours: parseInt(e.target.value, 10) || 0 })}
                        aria-label="Estimated Time Hours"
                    />
                </div>
                <div>
                    <label htmlFor="estimatedTimeMinutes">Minutes:</label>
                    <input 
                        type="number" 
                        name="estimatedTimeMinutes" 
                        id="estimatedTimeMinutes"
                        min="0" 
                        max="59"
                        value={estimatedTime.minutes}
                        onChange={(e) => setEstimatedTime({ ...estimatedTime, minutes: parseInt(e.target.value, 10) || 0 })}
                        aria-label="Estimated Time Minutes"
                    />
                </div>
                <div>
                    <button type="submit" disabled={isLoading} aria-label="Submit">
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignmentPage;
