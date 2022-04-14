var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var subjectSchema = new Schema({
    subjectId: {
        type: String,
        unique: true,
        require: true
    },
    subjectTitle: {
        type: String,
        require: true
    },
    sem: {
        type: Number,
        require: true
    },
    departmentId: {
        type: Number,
        require: true
    },
    departmentName: {
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: true
    },
    
});



module.exports = mongoose.model('Subject', subjectSchema);