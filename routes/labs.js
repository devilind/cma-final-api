const express = require('express');
var Lab = require('../models/lab');

const router = express.Router();


router.post('/', (req, res, next) => {
    var ids = [];
    var eLab = [];
    for (let index = 0; index < req.body.length; index++) {
        ids.push(req.body[index].labId)
        
    }
        Lab.find({
            labId: { $in : ids} 

        }, function (err, lab) {
            if (err) throw err
            if (lab.length === 0) {
                Lab.insertMany(req.body).then((lab) => {

                    res.json({ success: true, msg: 'Successfully saved' })
                    
                }).catch((err) => {
                    res.json({ success: false, msg: 'Something went wrong!'})
                })
            }

            else {
                for (let index = 0; index < req.body.length; index++) {
                    eLab.push(req.body[index].labTitle)
                    
                }
                res.json({ success: false, msg: eLab + "Lab already exist's "  });
            }
        });
    
});

router.get('/:sem', (req, res, next) =>{
    const sem = req.params.sem;
    Lab.find({
        sem : sem
    }).exec().then(doc => {
        res.status(200).json({doc})
    }).catch(error => {
        res.status(404).json({error})
    })
});

module.exports = router;