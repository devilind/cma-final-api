const express = require('express');
var nodemailer = require('nodemailer');
var jwt = require('jwt-simple')
const router = express.Router();
var Student = require('../models/student');



transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'forprojectpurspose@gmail.com',
        pass: 'cmaproject12'
    }
});

router.post('/', (req, res) => {
    if ((!req.body.fname) || (!req.body.mname) || (!req.body.lname) || (!req.body.email) || (!req.body.userId) || (!req.body.roll_no) || (!req.body.div) || (!req.body.admission_year) || (!req.body.sem) || (!req.body.dept)|| (!req.body.departmentId) || (!req.body.password)) {
        res.json({ success: false, msg: 'Enter all fields' })
    }
    else {
        var newUser = Student({
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname,
            email: req.body.email,
            userId: req.body.userId,
            roll_no: req.body.roll_no,
            div: req.body.div,
            admission_year: req.body.admission_year,
            sem: req.body.sem,
            dept: req.body.dept,
            departmentId: req.body.departmentId,
            password: req.body.password,
        });
        Student.findOne({
            userId: req.body.userId
        }, function (err, user) {
            if (err) throw err
            if (!user) {
                newUser.save(function (err, newUser) {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to save' })
                    }
                    else {
                        var mailOptions = {
                            from: 'forprojectpurspose@gmail.com',
                            to: req.body.email,
                            subject: 'LOGIN CREDENTIALS FOR ERP PORTAL OF TERNA ENGINEERING COLLEGE, NERUL.',
                            html: ` 
                            <img src ="https://ternaengg.ac.in/equinox2020/img/2.png" width="300" height="100">
                            <H3>Login credentials for your Student Profile on ERP Portal of TERNA ENGINEERING COLLEGE, NERUL is provided below .</H3>
                            <H4>User Id : ${req.body.userId} </H4>
                            <H4>Password : ${req.body.password} </H4> `
                        };
    
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.json({ success: true, msg: 'Successfully saved' })
                    }
                })
            }

            else {
                res.json({ success: false, msg: "User already exist's. "})
            }
        }
        )



    }
});

router.post('/authenticate', (req, res, next) =>{
    Student.findOne({
        userId: req.body.userId
    }, function (err, user) {
        if (err) throw err
        if (!user) {
            res.status(403).send({ success: false, msg: 'Authentication Failed, User not found' })
        }

        else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, "secretkey")
                    res.json({ success: true, token: token })
                }
                else {
                    return res.status(403).send({ success: false, msg: 'Authentication Failed, wrong password' })
                }
            })
        }
    }
    )
});

router.get('/', ( req, res, next) => {
    Student.find({
        
        sem: req.body.sem,
        departmentId: req.body.departmentId,
        div: req.body.div
    }).exec().then(doc => res.status(200).json(doc));
});

router.get('/:userId', ( req, res, next) =>  {
    const id = req.params.userId;
    Student.findOne({
        userId: id
    }).exec().then(doc =>{
        if (doc) {
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({message: "No student with " + id + " found."})
        }
    }).catch(err => 
        {
            res.status(500).json({error: err});
        });


});

// router.get('/', ( req, res, next) =>  {
//     if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//         var token = req.headers.authorization.split(' ')[1]
//         var decodedtoken = jwt.decode(token, config.secret)
//         return res.json({ success: true, msg: '  Hello ' + decodedtoken.fname })
//     }
//     else {
//         return res.json({ success: false, msg: 'No Headers' })
//     }
// });

// router.delete('/', ( req, res, next) => {
//     res.status(200).json({
//         message: 'Student deleted.'
//     });
// });

module.exports = router;