const express = require('express');
const multer = require('multer');
const Gallery = require('../models/gallery');
const { GridFsStorage } = require("multer-gridfs-storage");
const connectDB = require('../dbConfig/db');
const { db } = require('../models/notice');
const mongoose = require('mongoose');
const galleryimageChunks = require('../models/galleryImageChunks');
const galleryimageFiles = require('../models/galleryImageFiles');



const storage = new GridFsStorage({
    url: 'mongodb+srv://devilind:cmaproject@cma.ie7s9.mongodb.net/ERPSystem?retryWrites=true&w=majority',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg", "image/jpg"]; 1

        if (match.indexOf(file.mimetype) === -1) {

            return {
                filename: `${file.originalname}`,
                bucketName: "E-Book",

            };
        }

        return {
            bucketName: "galleryimage",
            filename: `${file.originalname}`,
            contentType: `${file.mimetype}`
        };
    },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/admin', upload.single('galleryImage'), (req, res, next) => {
    console.log(req.file);

    var newGallery = Gallery({
        galleryId: req.file.id,
        title: req.body.title,
        date: req.body.date,
        postedByRole: "Admin",
        contentType: req.file.mimetype
    });
    Gallery.findOne({
        galleryId: req.body.galleryId
    }, function (err, gallery) {
        if (err) throw err
        if (!gallery) {
            newGallery.save(function (err, newGallery) {
                if (err) {
                    res.json({ success: false, msg: 'Failed to save' });
                }
                else {
                    res.json({ success: true, msg: 'Successfully saved Gallery with id : ' + req.file.id });
                }
            });
        }

        else {
            res.json({ success: false, msg: "Gallery with id : " + req.body.galleryId + "already exist's." });
        }
    }
    )




});




router.get('/admin', async (req, res, next) => {
    var ids = [];
    var contentType = [];
    Gallery.find({
        postedByRole: "Admin"
    }).exec().then(doc => {

        for (let index = 0; index < doc.length; index++) {
            ids.push(doc[index].galleryId);
            contentType.push(doc[index].contentType);
        }



    //   find many
        galleryimageChunks.find({
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



router.delete('/:galleryId', (req, res, _next) => {
    Gallery.deleteOne({galleryId : req.params.galleryId},(err, result) => {
        if(err) throw err
        res.send('Gallery is deleted')
    })
    galleryimageChunks.deleteOne({galleryId : req.params.galleryId},(err, result) => {
        if(err) throw err
    })
    galleryimageFiles.deleteOne({id : req.params.id},(err, result) => {
        if(err) throw err
    })

   
    });


module.exports = router;