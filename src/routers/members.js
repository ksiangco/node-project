const express = require('express')
const Member = require('../models/member')
const Attendance = require('../models/Attendance');
const router = new express.Router()

router.delete('/api/members/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const att = await Attendance.find({member_id: _id}).countDocuments();
        if( att > 0){
            return res.status(400).send("Unable to delete due to data conflict.")
        }
        const member = await Member.findByIdAndDelete(_id)

        if (!member) {
            return res.status(404).send("Member does not exist")
        }
        res.send("Member successfully deleted.")
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/members/search', async (req, res) => {
    const {name, status} = req.query;
    if (name === undefined && status === undefined) {
        res.status(400).send("Invalid or missing parameters");
    }
    try {
        const member = await Member.find({$or:[{name: name}, {status: status}]});
       
        if (!member) {
            return res.status(404).send()
        }
        res.send(member)
    }
    catch(e){
        res.status(500).send()
    }
})

router.get('/api/members', async (req, res) => {
    try {
        const members = await Member.find({})
        res.send(members)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/members/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const member = await Member.findById(_id)

        if (!member) {
            return res.status(404).send()
        }

        const att = await Attendance.find({ member_id: _id}).populate({path: "event_id", select:["eventName"]});
        let data = member.toObject();
        data.EventAttendance = att

        res.send(data);
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/api/members/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Request contains properties that either cannot be updated or does not exist.' })
    }

    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!member) {
            return res.status(404).send()
        }

        res.send(member)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/api/members', async (req, res) => {
    const member = new Member(req.body)
    try {
        await member.save()
        res.status(201).send(member)
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;