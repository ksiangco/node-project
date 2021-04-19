const express = require('express')
const Attendance = require('../models/Attendance')
const Member = require('../models/member');
const Event = require('../models/event');
const router = new express.Router()

router.delete('/api/attendance/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const att = await Attendance.findByIdAndDelete(_id);
        if (!att) {
            return res.status(404).send("Attendance does not exist")
        }
        res.status(200).send("Member successfully deleted.")
    }
    catch(e){
        res.status(500).send("Internal Server Error")
    }
})

router.post('/api/attendance', async (req, res) => {
    const {member_id, event_id, timeIn, timeOut} = req.body;
    const d1 = new Date(timeIn);
    const d2 = new Date(timeOut);
    
    if (timeOut != undefined && d1>d2){
        return res.status(400).send("Time out must be greater than time in.")
    }
    const attendance = new Attendance(req.body)
    try{
        const member = await Member.findById(member_id);
        const fEvent = await Event.findById(event_id);
    }
    catch(e){
        return res.status(400).send({success: false, error: {message: 'One or more parameters is invalid.'}});
    }

    try {
      
        if(!member || !fEvent){
            return res.status(400).send({success: false, error: {message: 'One or more parameters is invalid.'}});
        }
        await attendance.save();
        res.status(201).send(attendance)
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;