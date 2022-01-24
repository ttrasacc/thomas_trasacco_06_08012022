const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

UserSchema.plugin(mongooseUniqueValidator);

exports.User = mongoose.model('User', UserSchema);

