const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  startTime: {
    type: String,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/  // Validates time format HH:MM
  },
  endTime: {
    type: String,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/  // Validates time format HH:MM
  }
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
