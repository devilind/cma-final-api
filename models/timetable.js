var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var timetableSchema = new Schema({

    timetableId: {
        type: String,
        unique: true,
    },
    departmentId: {
        type: Number,
        require: true
    },
    departmentName: {
        type: String
    },
    year: {
        type: Date
    },
    month: {
        type: Date
    },
    sem: {
        type: Number,
        require: true
    },
    
    div: {
        type: String
    },



});
module.exports = mongoose.model('TimeTable', timetableSchema);