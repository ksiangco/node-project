const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: "active",
        trim: true
    },
    joinDate: {
        type: Date
    }
})

const Member = new mongoose.model("Member", MemberSchema);

module.exports = Member;