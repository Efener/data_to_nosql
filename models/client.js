const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MonthlyDataSchema = new Schema({
    month: Number, 
    days: [{ 
        day: Number, 
        data: [{ 
            temperature: Number,
            humidity: Number,
            value: Number,
            value2: Number,
            gatewayId: Number,
            date: Date,
            batteryLevel: Number,
            signalLevel: Number,
            error: Number,
            index: Number,
            latitude: Number,
            longitude: Number
        }]
    }]
});


const YearlyDataSchema = new Schema({
    year: Number, 
    months: [MonthlyDataSchema] 
});


const ThingSchema = new Schema({
    thingID: Number, 
    yearlyData: [YearlyDataSchema] 
});

module.exports = mongoose.model('Thing', ThingSchema);



const ClientSchema = new Schema({
    clientID: Number,
    things: [ThingSchema] 
});

module.exports = mongoose.model('Client', ClientSchema);
