const express = require('express')
const memberRouter = require('./src/routers/members')
const eventRouter = require('./src/routers/events')
const attendanceRouter = require('./src/routers/attendance')
const app = express()
const port = process.env.PORT || 3000
require('./src/db/connection')

app.use(express.json())
app.use(memberRouter)
app.use(eventRouter);
app.use(attendanceRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})