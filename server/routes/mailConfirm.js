const express = require("express");
const db = require("../dbConnection").useDB;
const router = express.Router();
const logError = require("../logger");
const joi = require("joi");
const path = require("path");

//create schema to validate the tocken
const tockenSchema = joi.object({
    tocken: joi.string()
        .alphanum()
        .min(64)
        .max(64)
        .required(),
});

//receive tocken id and check it then confim it
router.get('/:tocken', (req, res) => {
    const validateTocken = tockenSchema.validate({"tocken": req.params.tocken});
    
    //if tocken not valid characters
    if (validateTocken.error){res.sendFile(path.join(__dirname, '../web-pages', 'errorConfirmed.html')); return;}
    
    db().collection('user').find({verificationToken: req.params.tocken, activated: {$exists: false}}).toArray()
    .then(result => {
        //check if vallue is exists
        if ( result.length != 1) {
            //send error web page
            res.sendFile(path.join(__dirname, '../web-pages', 'errorConfirmed.html'));
            //error loggin
            logError.errorLogger({data:"Got more results while searching email confirm tocken", tocken:req.params.tocken, time: new Date( Date.now())});
            return;
        }
        
        if( result.length == 1){
            const updateActivate = result[0];
            //update the database
            db().collection('user').updateOne({_id: result[0]._id}, {$set: {"activated":true, activatedAt: new Date( Date.now())}}, (error, result)=>{
                if(error) { logError.errorLogger(error)}
                //send success web page
                res.sendFile(path.join(__dirname, '../web-pages', 'successConfirmed.html'));
                return;
            });
        }
    })
    .catch(error => {
        logError.errorLogger(error.message + new Date( Date.now()));
    })
});

module.exports = router;