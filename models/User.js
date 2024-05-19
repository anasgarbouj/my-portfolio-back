const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'normal'],
    default: 'user'
  },
  lastLoginDetails: {
    ip: String,
    device: String,
    location: {
      city: String,
      region: String,
      country: String
    }
  }
});

module.exports = mongoose.model('User', userSchema);
