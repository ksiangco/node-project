const mongoose = require("mongoose");
const v = require("validator");
const validator = v.default;

const EventSchema = new mongoose.Schema({
    eventName:{
        type: String,
        required: true
    },
    eventType:{
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
});

const Event = new mongoose.model("Event", EventSchema);

module.exports = Event;