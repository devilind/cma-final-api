const express = require('express');
const multer = require('multer');
const Notice = require('../models/notice');
const { GridFsStorage } = require("multer-gridfs-storage");
const connectDB = require('../dbConfig/db');
const { db } = require('../models/notice');
const mongoose = require('mongoose');
const noticeimageChunks = require('../models/noticeImageChunks');
const pushNotificationController = require("../controllers/push_notification.controllers");



const storage = new GridFsStorage({
    url: 'mongodb+srv://devilind:cmaproject@cma.ie7s9.mongodb.net/ERPSystem?retryWrites=true&w=majority',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"];

        if (match.indexOf(file.mimetype) === -1) {

            return {
                filename: `${file.originalname}`,
                bucketName: "E-Book",

            };
        }

        return {
            bucketName: "noticeimage",
            filename: `${file.originalname}`,
            contentType: `${file.mimetype}`
        };
    },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/admin', upload.single('noticeImage'), (req, res, next) => {
    console.log(req.file);

    var newNotice = Notice({
        noticeId: req.file.id,
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        postedByRole: 'Admin',
        postedByUserId: 'admin',
        div: 'NA',
        sem: 0,
        departmentName: 'NA',
        departmentId: 0,
        contentType: req.file.mimetype
    });
    Notice.findOne({
        noticeId: req.body.noticeId
    }, function (err, notice) {
        if (err) throw err
        if (!notice) {
            newNotice.save(function (err, newNotice)  {
                if (err) {
                    res.json({ success: false, msg: 'Failed to save' });
                }
                else {
                    
                    res.json({ success: true, msg: 'Successfully saved notice with id : ' + req.file.id });
                }
            });
        }

        else {
            res.json({ success: false, msg: "Notice with id : " + req.body.noticeId + "already exist's." });
        }
    }
    )




});

router.get('/notify',pushNotificationController.SendNotification);
router.post('/notifyto',pushNotificationController.SendNotificationToDevice);

router.post('/faculty', upload.single('noticeImage'), (req, res, next) => {


    var newNotice = Notice({
        noticeId: req.file.id,
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        postedByRole: "Faculty",
        postedByUserId: req.body.postedByUserId,
        departmentName: req.body.departmentName,
        departmentId: req.body.departmentId,
        div: 'NA',
        sem: 0,
        contentType: req.file.mimetype
    });
    Notice.findOne({
        noticeId: req.body.noticeId
    }, function (err, notice) {
        if (err) throw err
        if (!notice) {
            newNotice.save(function (err, newNotice) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to save' });
                }
                else {


                    res.json({ success: true, msg: 'Successfully saved notice with id : ' + req.body.noticeId });
                }
            });
        }

        else {
            res.json({ success: false, msg: "Notice with id : " + req.body.noticeId + "already exist's." });
        }
    }
    )




});

router.post('/classrepresentative', upload.single('noticeImage'), (req, res, next) => {
    console.log(req.file);

    var newNotice = Notice({
        noticeId: req.file.id,
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        postedByRole: "Class Representative",
        postedByUserId: req.body.postedByUserId,
        div: req.body.div,
        sem: req.body.sem,
        departmentName: req.body.departmentName,
        departmentId: req.body.departmentId,
        contentType: file.mimetype
    });
    Notice.findOne({
        noticeId: req.body.noticeId
    }, function (err, notice) {
        if (err) throw err
        if (!notice) {
            newNotice.save(function (err, newNotice) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to save' });
                }
                else {


                    res.json({ success: true, msg: 'Successfully saved notice with id : ' + req.body.noticeId });
                }
            });
        }

        else {
            res.json({ success: false, msg: "Notice with id : " + req.body.noticeId + "already exist's." });
        }
    });




});


router.get('/admin', async (req, res, next) => {
    var ids = [];
    var contentType = [];
    Notice.find({
        postedByRole: "Admin"
    }).exec().then(doc => {

        for (let index = 0; index < doc.length; index++) {
            ids.push(doc[index].noticeId);
            contentType.push(doc[index].contentType);
        }




        noticeimageChunks.find({
            files_id: { $in: ids }

        }, function (err, chunks) {
            // for(let i=0; i< chunks.length;i++){                         
            //     notices.push(chunks[i].data.toString('base64'));          
            //   }

            let fileData = [];
            for (let i = 0; i < chunks.length; i++) {
                //This is in Binary JSON or BSON format, which is stored               
                //in fileData array in base64 endocoded string format               

                fileData.push(chunks[i].data.toString('base64'));
            }

            let finalFile = []

            //Display the chunks using the data URI format   
            for (let i = 0; i < chunks.length; i++) {
                let file = 'data:' +
                    contentType[i] + ';base64,'
                    + fileData[i];
                finalFile.push(file);
            }
            res.status(200).json({ imageBinary: finalFile });
            // noticeImages.push(notices[0]);
            // res.status(200).json({notices});
        });


    }).catch(error => {
        res.status(405).json({ error: error });
    });
});


router.get('/faculty/:deptId', (req, res, next) => {
    var ids = [];
    var contentType = [];
    Notice.find({
        postedByRole: "Faculty",
        departmentId: req.params.deptId

    }).exec().then(doc => {
        for (let index = 0; index < doc.length; index++) {
            ids.push(doc[index].noticeId);
            contentType.push(doc[index].contentType);
        }




        noticeimageChunks.find({
            files_id: { $in: ids }

        }, function (err, chunks) {
            

            let fileData = [];
            for (let i = 0; i < chunks.length; i++) {
                //This is in Binary JSON or BSON format, which is stored               
                //in fileData array in base64 endocoded string format               

                fileData.push(chunks[i].data.toString('base64'));
            }

            let finalFile = []

            //Display the chunks using the data URI format   
            for (let i = 0; i < chunks.length; i++) {
                let file = 'data:' +
                    contentType[i] + ';base64,'
                    + fileData[i];
                finalFile.push(file);
            }
            res.status(200).json({ imageBinary: finalFile });
            // noticeImages.push(notices[0]);
            // res.status(200).json({notices});
        });



        res.status(200).json({ doc: doc });
    }).catch(error => {
        res.status(404).json({ error: error });
    });
});

router.get('/classrepresentative/:deptId/:sem/:div', (req, res, next) => {
    Notice.find({

        postedByRole: "Class Representative",
        departmentId: req.params.deptId,
        sem: req.params.sem,
        div: req.params.div
    }).exec().then(doc => {
        for (let index = 0; index < doc.length; index++) {
            ids.push(doc[index].noticeId);
            contentType.push(doc[index].contentType);
        }
        noticeimageChunks.find({
            files_id: { $in: ids }

        }, function (err, chunks) {

            let fileData = [];
            for (let i = 0; i < chunks.length; i++) {
                //This is in Binary JSON or BSON format, which is stored               
                //in fileData array in base64 endocoded string format               

                fileData.push(chunks[i].data.toString('base64'));
            }

            let finalFile = []

            //Display the chunks using the data URI format   
            for (let i = 0; i < chunks.length; i++) {
                let file = 'data:' +
                    contentType[i] + ';base64,'
                    + fileData[i];
                finalFile.push(file);
            }
            res.status(200).json({ imageBinary: finalFile });
        });
    }).catch(error => {
        res.status(404).json({ error: error });
    });
});
router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'Notice deleted.'
    });
});

module.exports = router;