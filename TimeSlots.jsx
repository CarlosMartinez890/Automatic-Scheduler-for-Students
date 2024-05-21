import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TimeSlots.css'; // Import CSS for styling the component.

// Define the initial state for availability.
const initialAvailability = [
  { day: 'Sunday', startTime: '', endTime: '' },
  { day: 'Monday', startTime: '', endTime: '' },
  { day: 'Tuesday', startTime: '', endTime: '' },
  { day: 'Wednesday', startTime: '', endTime: '' },
  { day: 'Thursday', startTime: '', endTime: '' },
  { day: 'Friday', startTime: '', endTime: '' },
  { day: 'Saturday', startTime: '', endTime: '' },
];

// Define a functional component called TimeSlots.
const TimeSlots = () => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState(initialAvailability); // State to hold the availability data.
  const [errors, setErrors] = useState({}); // State to manage error messages.

  // Fetch availability data from the server when the component mounts.
  useEffect(() => {
    axios.get('http://localhost:3001/getAvailability')
      .then(response => {
        const fetchedAvailability = response.data || [];
        const updatedAvailability = initialAvailability.map((daySlot, index) => {
          return fetchedAvailability[index] ? fetchedAvailability[index] : daySlot;
        });
        setAvailability(updatedAvailability);
      })
      .catch(() => setErrors({ fetch: "Error fetching availability" })); // Handle errors in fetching data.
  }, []);

  // Handle form submission to save availability.
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior.
    if (!validateAvailability()) { // Validate times before submitting.
      return; // If validation fails, do not proceed.
    }
    try {
      await axios.post('http://localhost:3001/availability', { availability });
      navigate('/schedule'); // Navigate to the schedule page on successful save.
    } catch (error) {
      console.error("Error saving availability:", error); // Log the error for debugging.
      setErrors({ save: "Failed to save availability. Check the data and try again." }); // Handle errors in saving data.
    }
  };

  // Validate the availability times.
  const validateAvailability = () => {
    let valid = true;
    const newErrors = {};
    availability.forEach((slot, index) => {
      if ((slot.startTime && !slot.endTime) || (!slot.startTime && slot.endTime)) {
        newErrors[index] = 'Both start and end times must be provided.'; // Check if both times are provided.
        valid = false;
      } else if (slot.startTime && slot.endTime && slot.endTime <= slot.startTime) {
        newErrors[index] = 'Invalid time range. Ensure start is before end.'; // Check for invalid time ranges.
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid; // Return the result of the validation.
  };

  // Update time values for each day.
  const handleTimeChange = (index, field, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index] = { ...updatedAvailability[index], [field]: value };
    setAvailability(updatedAvailability); // Set the updated availability array.
  };

  // Render the form UI for inputting availability times.
  return (
    <form onSubmit={handleSubmit} className="time-slots">
      {errors.fetch && <p className="error">{errors.fetch}</p>}
      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
        <div key={day} className="day-slot">
          <label>{day}:
            Start Time: <input type="time" value={availability[index]?.startTime || ''} onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)} />
            End Time: <input type="time" value={availability[index]?.endTime || ''} onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)} />
          </label>
          {errors[index] && <div className="error">{errors[index]}</div>}
        </div>
      ))}
      <button type="submit" className="save-button">Save Availability</button>
      {errors.save && <p className="error">{errors.save}</p>}
    </form>
  );
};

// Export the TimeSlots component as the default export.
export default TimeSlots;
