const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
    coursename: {
        type: String,
        required: [true, "Coursename is required"],
        trim: true,
        unique: true  // Ensures coursename uniqueness across all documents
    },
    importance: {
        type: Number,
        required: [true, "Importance level is required"],
        min: 1,
        max: 5  // Assuming importance is rated from 1 to 5
    }
});

ClassSchema.index({ coursename: 1 });  // Optimizes queries that involve the coursename

const ClassModel = mongoose.model("classes", ClassSchema);

module.exports = ClassModel;
