const express = require('express');
const app = express();

//Define port for server to listen. 
//Requests for course or subject info should go to this port
const port = 5003;

//Require modules
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

//create and mount express routers to handle course and subject requests respectively
const courseRouter = require('./courses')
app.use('/courses', courseRouter);

const subjectRouter = require('./subjects')
app.use('/subjects', subjectRouter);

//start server on defined port
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`)
})

module.exports = app;