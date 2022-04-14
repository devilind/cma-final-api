var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var studyMaterialSchema = new Schema({
    fileId: {
        type: String,
        unique: true,
    },
    title: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    subjectId: {
        type: String,
        require: true
    },
    subjectName: {
        type: String,
        require: true
    },
    postedByFacultyId: {
        type: String,
        require: true
    },
    
    bookType: {
        type: String,
        require: true
    },
    div: {
        type: String
    },
    sem: {
        type: Number,
        require: true
    },
    departmentName: {
        type: String,
    },
    departmentId: {
        type: Number
    },
    contentType: {
        type: String,
    }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);