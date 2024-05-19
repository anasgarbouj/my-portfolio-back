const mongoose = require('mongoose');

const sessionDetailsSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    location: {
        city: {
            type: String,
            default: ''
        },
        region: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: ''
        }
    },
    visitDate: {
        type: Date,
        default: Date.now // Automatically sets to the current date and time
    }
});

const SessionDetails = mongoose.model('SessionDetails', sessionDetailsSchema);

module.exports = SessionDetails;
