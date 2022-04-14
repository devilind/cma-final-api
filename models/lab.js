var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var labSchema = new Schema({
    labId: {
        type: String,
        unique: true,
        require: true
    },
    labTitle: {
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



module.exports = mongoose.model('Lab', labSchema);