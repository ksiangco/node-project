const express = require('express')
const Event = require('../models/event')
const Attendance = require('../models/Attendance')
const router = new express.Router()
const moment = require('moment');

router.delete('/api/events/:id', async (req, res) =>{
    const _id = req.params.id;
    try {
        const att = await Attendance.find({event_id: _id}).countDocuments();
        if( att > 0){
            return res.status(400).send("Unable to delete due to data conflict.")
        }
        const event = await Event.findByIdAndDelete(_id);
        return res.status(200).send("Delete successful")
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

router.get('/api/events/search', async(req, res) => {
    const {eventname, datestart, dataend} = req.query;
    if (eventname === undefined && datestart === undefined &&  dataend === undefined) {
        res.status(400).send("Invalid or missing parameters");
    }
    try {
        if (eventname !== undefined && datestart === undefined &&  dataend === undefined) {
            const events = await Event.find({eventName: eventname })
            res.status(200).send(events)
        }
        else if(eventname === undefined && datestart !== undefined &&  dataend === undefined){
            const events = await Event.find({startTime:{$gte: datestart} })
            res.status(200).send(events)
        }
        else if(eventname === undefined && datestart !== undefined &&  dataend !== undefined){
            const events = await Event.find({$and:[{startTime:{$gte:datestart}}, {endTime:{$lte:dataend}}]})
            res.status(200).send(events)
        }
        else if(eventname === undefined && datestart === undefined &&  dataend !== undefined){
            const events = await Event.find({endTime:{$lte: dataend} })
            res.status(200).send(events)
        }
        else if(eventname !== undefined && datestart !== undefined &&  dataend === undefined) {
            const events = await Event.find({$and:[{eventName: eventname}, {startTime:{$gte: datestart}}]})
            res.status(200).send(events)
        }
        else if(eventname !== undefined && datestart === undefined &&  dataend !== undefined) {
            const events = await Event.find({$and:[{eventName: eventname}, {endTime:{$lte: dataend}}]})
            res.status(200).send(events)
        }
        else{
             const events = await Event.find({$and:[{eventName: eventname},{startTime:{$gte: datestart}},{endTime:{$lte: dataend}}]})
             res.status(200).send(events)
        }
       
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.get('/api/events/export/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const event = await Event.findById(_id)

        if (!event) {
            return res.status(404).send()
        }

        const items = await Attendance.find({ event_id: _id}).populate({path: "member_id", select:["name"]});

        let data = event.toObject();
        let csv = "Member Name, Time-in, Time-out"
        let csvData = "";
        items.every(item => {;
            let {name} = item.member_id;
            csvData+= "\n" + name + "," + moment(item.timeIn, 'DD/MM/YYYY', true).format() + "," +  moment(item.timeOut, 'DD/MM/YYYY', true).format();
        });
        csv += csvData
        let eventDate = moment(event.startTime, 'DD/MM/YYYY', true).format();

        res.set({'Content-Disposition': `attachment; filename=${event.eventName}_${eventDate}.csv`, 'Content-Type': 'text/csv'});
        res.send(csv)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({})
        res.send(events)
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

router.get('/api/events/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const event = await Event.findById(_id)

        if (!event) {
            return res.status(404).send()
        }

        const att = await Attendance.find({ event_id: _id}).populate({path: "member_id", select:["name"]});
        let data = event.toObject();
        data.MemberAttendance = att

        res.status(200).send(data)
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

router.patch('/api/events/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['eventName', 'eventType', 'startTime', 'endTime'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Request contains properties that either cannot be updated or does not exist.' })
    }

    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!event) {
            return res.status(404).send()
        }
        res.send(event)
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

router.post('/api/events', async (req, res) => {
    const event = new Event(req.body)
    try {
        await event.save()
        res.status(201).send(event)
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;