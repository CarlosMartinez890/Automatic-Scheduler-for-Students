const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    assignmentName: { type: String, required: true },
    dueDate: { type: Date, required: true },
    course: {
        name: { type: String, required: true },
        importance: { type: Number, required: true, default: 5 },  // Adding a default importance value
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'classes' }  // Referencing Course model if needed for deeper queries
    },
    difficulty: { type: Number, required: true },
    estimatedTime: { type: Number, required: true }
});

const AssignmentModel = mongoose.model("assignments", AssignmentSchema);

module.exports = AssignmentModel;
