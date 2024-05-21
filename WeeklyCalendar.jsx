import React, { useState, useEffect, useCallback } from 'react';
import './styles.css'; // Import your CSS file for styling

const WeeklyCalendar = () => {
  const [schedule, setSchedule] = useState({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  });

  const [weekOffset, setWeekOffset] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  useEffect(() => {
    fetchData();
  }, [weekOffset]);

  useEffect(() => {
    if (assignments.length > 0 && availability.length > 0) {
      console.log("Triggering schedule assignments");
      const sortedAssignments = [...assignments].sort((a, b) => calculateScore(b) - calculateScore(a));
      scheduleAssignments(sortedAssignments, availability);
    }
  }, [assignments, availability]);

  const fetchData = useCallback(async () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const url = `http://localhost:3001/assignments?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`;
    console.log("Fetching data with URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch assignments. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched assignments:", data);
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError(error.message);
    }
  }, [weekOffset]);

  const fetchAvailability = async () => {
    try {
      const response = await fetch("http://localhost:3001/getAvailability");
      if (!response.ok) {
        throw new Error(`Failed to fetch availability. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched availability:", data);
      setAvailability(data);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setError(error.message);
    }
  };

  const calculateScore = (assignment) => {
    // Calculation constants
    const MAX_TIME_TO_COMPLETE = 120; // in minutes
    const MAX_DIFFICULTY = 10;
    const WEIGHT_DUE_DATE = 0.4;
    const WEIGHT_IMPORTANCE = 0.3;
    const WEIGHT_TIME_TO_COMPLETE = 0.2;
    const WEIGHT_DIFFICULTY = 0.1;

    // Time calculations
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    const dueDateProximityScore = 1 / (1 + daysUntilDue);
    const timeToCompleteScore = 1 - (assignment.estimatedTime / MAX_TIME_TO_COMPLETE);
    const difficultyScore = assignment.difficulty / MAX_DIFFICULTY;

    // Weighted score
    return (
      WEIGHT_DUE_DATE * dueDateProximityScore +
      WEIGHT_IMPORTANCE * assignment.course.importance +
      WEIGHT_TIME_TO_COMPLETE * timeToCompleteScore +
      WEIGHT_DIFFICULTY * difficultyScore
    );
  };

  const scheduleAssignments = (assignments, availability) => {
    let initialSchedule = { Sunday: [], Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };
    let availableTimePerDay = availability.reduce((acc, { day, startTime, endTime }) => {
      const startHour = parseInt(startTime.split(':')[0], 10);
      const endHour = parseInt(endTime.split(':')[0], 10);
      acc[day] = (acc[day] || 0) + (endHour - startHour) * 60; // Convert hours to minutes
      return acc;
    }, {});

    assignments.forEach(assignment => {
      let timeRemaining = assignment.estimatedTime; // In minutes

      for (let day of Object.keys(initialSchedule)) {
        if (timeRemaining <= 0) break;

        let timeAllocatable = Math.min(timeRemaining, availableTimePerDay[day]);

        if (timeAllocatable > 0) {
          const newEvent = {
            title: assignment.assignmentName,
            time: `${Math.floor(timeAllocatable / 60)}h ${timeAllocatable % 60}m`,
            dueDate: new Date(assignment.dueDate).toLocaleDateString('en-US')
          };

          initialSchedule[day] = [...initialSchedule[day], newEvent];

          availableTimePerDay[day] -= timeAllocatable;
          timeRemaining -= timeAllocatable;
        }
      }

      // Handle remaining time that couldn't be allocated due to insufficient availability
      if (timeRemaining > 0) {
        let remainingEvent = {
          title: `${assignment.assignmentName} (cont.)`,
          time: `${Math.floor(timeRemaining / 60)}h ${timeRemaining % 60}m`,
          dueDate: new Date(assignment.dueDate).toLocaleDateString('en-US')
        };

        for (let day of Object.keys(initialSchedule)) {
          if (timeRemaining <= 0) break;

          let timeAllocatable = Math.min(timeRemaining, availableTimePerDay[day]);

          if (timeAllocatable > 0) {
            initialSchedule[day] = [...initialSchedule[day], { ...remainingEvent, time: `${Math.floor(timeAllocatable / 60)}h ${timeAllocatable % 60}m` }];
            availableTimePerDay[day] -= timeAllocatable;
            timeRemaining -= timeAllocatable;
          }
        }
      }
    });

    setSchedule(initialSchedule);
  };

  const getFormattedDate = (dayIndex) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + dayIndex + (weekOffset * 7));
    return firstDayOfWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const previousWeek = () => {
    console.log("Previous week clicked");
    setWeekOffset(weekOffset - 1);
  };

  const nextWeek = () => {
    console.log("Next week clicked");
    setWeekOffset(weekOffset + 1);
  };

  const formatTime = (timeString) => {
    if (!timeString || !timeString.includes(':')) {
      return 'Invalid time';
    }

    const [hours, minutes] = timeString.split(':');
    if (hours === undefined || minutes === undefined) {
      return 'Invalid time';
    }

    const hour = parseInt(hours, 10);
    const minute = minutes.padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minute} ${ampm}`;
  };

  const displayAvailability = (day) => {
    const dayAvailability = availability.find(a => a.day === day);
    if (dayAvailability) {
      return `${formatTime(dayAvailability.startTime)} - ${formatTime(dayAvailability.endTime)}`;
    }
    return "No availability set";
  };

  return (
    <div className="weekly-schedule">
      <h2>Weekly Schedule</h2>
      <div className="navigation">
        <button onClick={previousWeek}>Previous Week</button>
        <button onClick={nextWeek}>Next Week</button>
      </div>
      <div className="days">
        {Object.keys(schedule).map((day, index) => (
          <div key={day} className="day">
            <h4>{day} {getFormattedDate(index)}</h4>
            <p>Availability: {displayAvailability(day)}</p>
            {schedule[day].length > 0 ? (
              <>
                <h5>Current Assignments for {day}:</h5>
                <ul>
                  {schedule[day].map((event, index) => (
                    <li key={`${day}-${index}`}>
                      {event.title} - Time needed: {event.time} - Due: {event.dueDate}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No assignments scheduled for this day.</p>
            )}
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default WeeklyCalendar;
