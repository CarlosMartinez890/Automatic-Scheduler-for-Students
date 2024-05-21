// Filename - App.jsx
import React from "react";
import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";
import HomePage from "./HomePage"; // Import the HomePage component
import SchedulePage from "./SchedulePage"; // Import the SchedulePage component
import LoginPage from "./LoginPage"; // Import the LoginPage component
import RegisterPage from "./RegisterPage"; // Import the RegisterPage component
import AssignmentPage from "./AssignmentPage"; // Import the AssignmentPage component
import TimeSlots from "./TimeSlots"; // Import the TimeSlots component
import './styles.css'; // Import your CSS file
import CoursePage from "./CoursePage"; // Import the CoursePage component

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						exact
						path="/"
						element={<HomePage />} // Render the HomePage component when the path is "/"
					/>
		  <Route
						exact
						path="/login"
						element={<LoginPage />} // Render the LoginPage component when the path is "/login"
					/>
		  <Route
						exact
						path="/register"
						element={<RegisterPage />} // Render the RegisterPage component when the path is "/register"
					/>
					<Route
						exact
						path="/schedule"
						element={<SchedulePage />} // Render the SchedulePage component when the path is "/schedule"
					/>
					<Route
						exact
						path="/course"
						element={<CoursePage />} // Render the CoursePage component when the path is "/course"
					/>
					<Route
						exact
						path="/assignment"
						element={<AssignmentPage />} // Render the AssignmentPage component when the path is "/assignment"
					/>
					<Route
						exact
						path="/timeslots"
						element={<TimeSlots />} // Render the TimeSlots component when the path is "/timeslots"
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
