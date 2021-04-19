const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    member_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "Member"
    },
    event_id:{
        type: mongoose.Schema.Types.ObjectId, ref: "Event"
    },
    timeIn: {
        type: Date,
        default: new Date(),
        required: true
    },
    timeOut: {
        type: Date
    }
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;