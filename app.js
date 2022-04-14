const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./dbConfig/db');
const noticeRoutes = require('./routes/notice');
const studentRoutes = require('./routes/students');
const facultyRoutes = require('./routes/faculty');
const managementRoutes = require('./routes/management');
const CRRoutes = require('./routes/classrepresentative');
const subjectRoutes = require('./routes/subject');
const labRoutes = require('./routes/labs');
const eventRoutes = require('./routes/event');
const galleryRoutes = require('./routes/gallery');
const studyMaterialRoutes = require('./routes/studyMaterial');

connectDB();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
},);

app.use('/notice', noticeRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/management', managementRoutes);
app.use('/classrepresentative', CRRoutes);
app.use('/subject', subjectRoutes);
app.use('/lab', labRoutes);
app.use('/event', eventRoutes);
app.use('/gallery', galleryRoutes);
app.use('/studymaterial', studyMaterialRoutes);


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;