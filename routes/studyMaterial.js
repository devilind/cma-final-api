const express = require('express');
const multer = require('multer');
const StudyMaterial = require('../models/studyMaterial');
const { GridFsStorage } = require("multer-gridfs-storage");
const connectDB = require('../dbConfig/db');
const { db } = require('../models/studyMaterial');
const mongoose = require('mongoose');
const studyMaterialFileChunks = require('../models/studyMaterialFileChunks');
const studyMaterialFile = require('../models/studyMaterialFile');

var fs = require("fs");




const storage = new GridFsStorage({
    url: 'mongodb+srv://devilind:cmaproject@cma.ie7s9.mongodb.net/ERPSystem?retryWrites=true&w=majority',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (_req, file) => {
        

        return {
            bucketName: "studymaterialfile",
            filename: `${file.originalname}`,
            contentType: `${file.mimetype}`
        };
    },
});

const upload = multer({ storage });

const router = express.Router();


router.post('/faculty', upload.single('studymaterialfile'), (req, res, _next) => {


    var newStudyMaterial = StudyMaterial({

        fileId: req.file.id,
        title: req.body.title,
        date: req.body.date,
        subjectId: req.body.subjectId,
        subjectName : req.body.subjectName,
        bookType: "Book",
        postedByFacultyId: req.body.postedByFacultyId,
        departmentName: req.body.departmentName,
        departmentId: req.body.departmentId,
        div: req.body.div,
        sem: req.body.sem,
        contentType: req.file.mimetype
    });
    StudyMaterial.findOne({
        fileId: req.file.id
    }, function (err, studyMaterial) {
        if (err) throw err
        if (!studyMaterial) {
            newStudyMaterial.save(function (err, _newStudyMaterial) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to save' });
                }
                else {


                    res.json({ success: true, msg: 'Successfully saved file with id : ' + req.file.id });
                }
            });
        }

        else {
            res.json({ success: false, msg: "file with id : " + req.file.id + "already exist's." });
        }
    }
    )




});


router.post('/lab', upload.single('studymaterialfile'), (req, res, _next) => {


    var newStudyMaterial = StudyMaterial({

        fileId: req.file.id,
        title: req.body.title,
        date: req.body.date,
        subjectId: req.body.subjectId,
        subjectName : req.body.subjectName,
        bookType : "Manual",
        postedByFacultyId: req.body.postedByFacultyId,
        departmentName: req.body.departmentName,
        departmentId: req.body.departmentId,
        div: req.body.div,
        sem: req.body.sem,
        contentType: req.file.mimetype
    });
    StudyMaterial.findOne({
        fileId: req.file.id
    }, function (err, studyMaterial) {
        if (err) throw err
        if (!studyMaterial) {
            newStudyMaterial.save(function (err, _newStudyMaterial) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to save' });
                }
                else {


                    res.json({ success: true, msg: 'Successfully saved file with id : ' + req.file.id });
                }
            });
        }

        else {
            res.json({ success: false, msg: "file with id : " + req.file.id + "already exist's." });
        }
    }
    )




});








router.get('/faculty/:deptId/:sem/:subjectId', (req, res, _next) => {
    var ids = [];
    var contentType = [];

    StudyMaterial.find({
        departmentId: req.params.deptId,
        sem: req.params.sem,
        subjectId: req.params.subjectId


    }).exec().then(doc => {
        for (let index = 0; index < doc.length; index++) {
            ids.push(doc[index].fileId);
            contentType.push(doc[index].contentType);
        }




        studyMaterialFileChunks.find({
            files_id: { $in: ids }

        },function (_err, chunks) {
            

            let fileData = [];
            for (let i = 0; i < chunks.length; i++) {
                //This is in Binary JSON or BSON format, which is stored               
                //in fileData array in base64 endocoded string format               

                fileData.push(chunks[i].data.toString('base64'));
            }
            
            let finalFile = [];
            for (let i = 0; i < chunks.length; i++) {
                let file = 'data:' +
                    contentType[i] + ';base64,'
                    + fileData[i];
                finalFile.push(file);
                fs.writeFile(finalfile,fileData,{encoding:'base64'},function(err){
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        console.log("file created");
                    }
                })
            }
            

            //Display the chunks using the data URI format   
            


            res.status(200).json({ imageBinary: finalFile });
            // noticeImages.push(notices[0]);
            // res.status(200).json({notices});
        });



        res.status(200).json({ doc: doc });
    }).catch(error => {
        res.status(404).json({ error: error });
    });
});


router.delete('/:fileId', (req, res, _next) => {
    StudyMaterial.deleteOne({fileId : req.params.fileId},(err, result) => {
        if(err) throw err
        res.send('File is deleted')
    })
    studyMaterialFileChunks.deleteOne({fileId : req.params.fileId},(err, result) => {
        if(err) throw err
    })
    studyMaterialFile.deleteOne({id : req.params.id},(err, result) => {
        if(err) throw err
    })

   
    });


module.exports = router;