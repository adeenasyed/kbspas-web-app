const mongoose = require('../dbconnect');

const AppointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    service: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    promoApplied: String
});

const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);

module.exports = AppointmentModel;