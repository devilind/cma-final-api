const express = require('express');
var CR = require('../models/cr');
var nodemailer = require('nodemailer');
var jwt = require('jwt-simple');

const router = express.Router();

transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'forprojectpurspose@gmail.com',
        pass: 'cmaproject12'
    }
});

router.post('/', (req, res, next) => {
    if ((!req.body.fname) || (!req.body.mname) || (!req.body.lname) || (!req.body.email) || (!req.body.userId) || (!req.body.div) || (!req.body.sem) || (!req.body.durationStart) || (!req.body.durationEnd) || (!req.body.departmentId) || (!req.body.departmentName) || (!req.body.password)) {
        res.json({ success: false, msg: 'Enter all fields' })
    }
    else {
        var newUser = CR({
            fname: req.body.fname,
            mname: req.body.mname,
            lname: req.body.lname,
            email: req.body.email,
            userId: req.body.userId,
            durationStart: req.body.durationStart,
            div: req.body.div,
            sem:req.body.sem,
            durationEnd: req.body.durationEnd,
            departmentId: req.body.departmentId,
            departmentName: req.body.departmentName,
            password: req.body.password,
        });
        CR.findOne({
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
                            <H3>Login credentials for your Class Representative Profile on ERP Portal of TERNA ENGINEERING COLLEGE, NERUL is provided below .</H3>
                            <H4>User Id : ${req.body.userId} </H4>
                            <H4>Password : ${req.body.password} </H4> ` };
    
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
        });   
    }
});

router.post('/authenticate', (req, res, next) => {{
    CR.findOne({
        userId: req.body.userId
    }, function (err, user) {
        if (err) throw err
        if (!user) {
            res.status(403).send({ success: false, msg: 'Authentication Failed, User not found' })
        }

        else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, 'secretkey')
                    res.json({ success: true, token: token })
                }
                else {
                    return res.status(403).send({ success: false, msg: 'Authentication Failed, wrong password' })
                }
            })
        }
    }
    )
}});

module.exports = router;