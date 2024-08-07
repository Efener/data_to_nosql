const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Günlük veri şeması
const DailyDataSchema = new Schema({
    date: Date, // Tarih
    data: [{ // Sensör veri dizisi
        temperature: Number,
        humidity: Number,
        value: Number,
        value2: Number,
        gatewayId: Number,
        batteryLevel: Number,
        signalLevel: Number,
        error: Number,
        index: Number,
        latitude: Number,
        longitude: Number
    }]
});

module.exports = mongoose.model('DailyData', DailyDataSchema);
