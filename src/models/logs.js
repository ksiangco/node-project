const mongoose = require("mongoose");
const v = require("validator");
const validator = v.default;

const LogSchema = new mongoose.Schema({
    endPoint:{
        type: String
    },
    reqParams:{
        type: String
    },
    reqBody:{
        type: String
    }
})

const Log = new mongoose.model("Log", LogSchema)

module.exports = Log;