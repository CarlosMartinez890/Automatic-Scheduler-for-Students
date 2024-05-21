const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Import database models for different data entities
const ProfileModel = require('./models/Profile');
const ClassModel = require('./models/Class');  // Assuming correct path to Class model
const AssignmentModel = require('./models/Assignment');  // Assuming correct path to Assignment model
const Availability = require('./models/Timeslot');  // Assuming correct path to Availability model

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/class")
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route to register a new user
app.post('/register', (req, res) => {
    const { password } = req.body;  // Extract password from request body for comparison
    // Create a new profile document in MongoDB
    ProfileModel.create(req.body)
        .then(profile => {
            if (profile && profile.password === password) {
                res.json("success");  // Respond with success if profile is created
            } else {
                res.status(401).json("The password is incorrect or no record found");
            }
        })
        .catch(err => res.status(500).json(err));  // Handle errors
});

// Route to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Find a single profile by username
    ProfileModel.findOne({ username: username })
        .then(profile => {
            if (profile && profile.password === password) {
                res.json("success");  // Respond with success if credentials are valid
            } else {
                res.status(401).json("Invalid credentials");  // Respond with error if credentials are invalid
            }
        })
        .catch(err => res.status(500).json(err));  // Handle errors
});

// Route to create a new class
app.post('/addClass', async (req, res) => {
  const { coursename, importance } = req.body;

  if (!coursename || !importance) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const newCourse = new ClassModel({ coursename, importance });
    await newCourse.save();
    res.status(201).send('Course added successfully');
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to retrieve all classes
app.get('/classes', async (req, res) => {
    try {
      const classes = await ClassModel.find({});
      res.json(classes);  // Respond with all classes
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve classes", error: error.message });  // Handle errors
    }
});

// Route to retrieve availability data
app.get('/getAvailability', async (req, res) => {
    try {
      const availability = await Availability.find({});
      res.json(availability);  // Respond with all availability data
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve availability", error: error.message });  // Handle errors
    }
});

// Route to save availability data
app.post('/availability', async (req, res) => {
  const { availability } = req.body;

  try {
    await Availability.deleteMany({});  // Delete all existing availability
    const newAvailability = await Availability.insertMany(availability);  // Insert new availability data
    res.status(201).json(newAvailability);  // Respond with the new availability data
  } catch (error) {
    res.status(400).json({ message: "Failed to save availability", error: error.message });  // Handle errors
  }
});

// Route to create an assignment
app.post('/addAssignment', async (req, res) => {
  const { assignmentName, dueDate, course, difficulty, estimatedTime } = req.body;

  if (!assignmentName || !dueDate || !course || !difficulty || !estimatedTime) {
    console.error('Missing required fields:', req.body);
    return res.status(400).send('Missing required fields');
  }

  try {
    const newAssignment = new AssignmentModel({ 
      assignmentName, 
      dueDate, 
      course: {
        name: course.name,
        importance: course.importance,
        courseId: course.courseId,
      },
      difficulty, 
      estimatedTime 
    });
    await newAssignment.save();
    res.status(201).send('Assignment added successfully');
  } catch (error) {
    console.error('Error adding assignment:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to retrieve all assignments
// Assuming you're using Express and a database like MongoDB

app.get('/assignments', async (req, res) => {
  const { start, end } = req.query;

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check if dates are valid
    if (isNaN(startDate) || isNaN(endDate)) {
      console.error("Invalid date format received:", { start, end });
      return res.status(400).send("Invalid date format");
    }

    console.log("Fetching assignments due between:", startDate, "and", endDate);

    const assignments = await AssignmentModel.find({
      dueDate: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    console.log("Assignments fetched:", assignments);
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).send("Internal server error");
  }
});




// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
