const express = require('express');
var Subject = require('../models/subject');
var nodemailer = require('nodemailer');
var jwt = require('jwt-simple');
const { json } = require('body-parser');

const router = express.Router();


router.post('/', (req, res, next) => {
    var ids = [];
    var esubject = [];
    for (let index = 0; index < req.body.length; index++) {
        ids.push(req.body[index].subjectId)
        
    }
        Subject.find({
            subjectId: { $in : ids} 

        }, function (err, subject) {
            if (err) throw err
            if (subject.length === 0) {
                Subject.insertMany(req.body).then((subjects) => {

                    res.json({ success: true, msg: 'Successfully saved' })
                    
                }).catch((err) => {
                    res.json({ success: false, msg: 'Something went wrong!'})
                })
            }

            else {
                for (let index = 0; index < req.body.length; index++) {
                    esubject.push(req.body[index].subjectTitle)
                    
                }
                res.json({ success: false, msg: esubject + " Subject already exist's "  });
            }
        });
    
});

router.get('/:sem', (req, res, next) =>{
    const sem = req.params.sem;
    Subject.find({
        sem : sem
    }).exec().then(doc => {
        res.status(200).json({doc})
    }).catch(error => {
        res.status(404).json({error})
    })
});

module.exports = router;