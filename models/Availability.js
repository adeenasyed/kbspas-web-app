const mongoose = require('../dbconnect');

const AvailabilitySchema = new mongoose.Schema({
    location: { type: String, required: true },
    date: { type: Date, required: true, unique: true, },
    timeSlots: [{
        startTime: { type: String, required: true },   
        available: { type: Boolean, required: true }
    }],
});

const AvailabilityModel = mongoose.model('Availability', AvailabilitySchema);

module.exports = AvailabilityModel;