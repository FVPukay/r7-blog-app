const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    avatar: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    isAdmin: {type: Boolean, default: false},
    joinedOn: {type: Date, default: Date.now},
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
