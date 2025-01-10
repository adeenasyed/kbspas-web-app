const mongoose = require('../dbconnect');

const PromoSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentOff: { type: String, required: true },
});

const PromoModel = mongoose.model('Promo', PromoSchema);

module.exports = PromoModel;