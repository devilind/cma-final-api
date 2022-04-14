var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var noticeSchema = new Schema({
    noticeId: {
        type: String,
        unique: true,
    },
    title: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    postedByRole: {
        type: String,
        require: true
    },
    postedByUserId: {
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

module.exports = mongoose.model('Notice', noticeSchema);