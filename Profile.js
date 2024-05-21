const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const ProfileModel = mongoose.model('profiles', ProfileSchema);
module.exports = ProfileModel;