const mongoose = require('../dbconnect');

const ServiceSchema = new mongoose.Schema({
    img: String,
    name: String,
    type: String,
    price: Number,
    hasRefill: Boolean,
    refillPrice: Number,
    index: Number
});

const ServiceModel = mongoose.model('Service', ServiceSchema);

module.exports = ServiceModel;