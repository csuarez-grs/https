const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({    
  username: {
    type: String,
    required: true,
    unique: true,
  },
    password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,   
    },
    role: {
    type: String,
    enum: ['user', 'admin', 'manager', 'test'],
    default: 'user',
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

