var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')
var userSchema = new Schema({
    fname: {
        type: String,
        require: true
    },
    mname: {
        type: String,
        require: true
    },
    lname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        unique: true,
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
    
    div: {
        type: String,
        require: true
    },
    
    sem: {
        type: Number,
        require: true
    },
    
    durationStart: {
        type: Date,
        require: true
    },
    
    durationEnd: {
        type: Date,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

userSchema.pre('save', function(next) {
    var user = this;
    if(this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                return next(err)
            
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        return next()
    }
})

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function(err,isMatch) {
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('Class_Representative', userSchema)