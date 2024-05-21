import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import './ScheduleStyles.css';  // Ensure CSS is properly set up for all components
import WeeklyCalendar from "./WeeklyCalendar";

const SchedulePage = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/classes");
                if (!response.ok) {
                    throw new Error("Failed to fetch data from the server");
                }
                const data = await response.json();
                console.log(data); // Check the structure and presence of 'id'
                setClasses(data);
            } catch (error) {
                setError(`Error: ${error.message}`);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="schedule-page">
            <h1 className="title">Let's plan!</h1>
            <nav className="navigation">
                <button onClick={() => navigate("/")}>Exit</button>
                <button onClick={() => navigate("/course")}>Add Course</button>
                <button onClick={() => navigate("/assignment")}>Insert Assignment</button>
                <button onClick={() => navigate("/timeslots")}>Edit Time Availability</button>
            </nav>
            <section>
                <WeeklyCalendar />
            </section>
            <section>
                <h2>Your Classes</h2>
                {error && <p className="error">{error}</p>}
                <ul>
    {classes.map((course, index) => (
        <li key={course.id || index}>
            <strong>{course.coursename}</strong>
        </li>
    ))}
                </ul>

            </section>
        </main>
    );
};

export default SchedulePage;
