const express = require("express");
const joi = require("joi");
const passwordComplex = require("joi-password-complexity")
const db = require("../dbConnection").useDB;
const crypto = require("crypto");
const mail = require("../mailer");
const router = express.Router();
const logger = require("../logger");
require("dotenv/config");

//create const object for joi validation
const joiSchema = joi.object({
    name: joi.string()
        .pattern(new RegExp('^[a-zA-Z]'))
        .min(3)
        .required(),
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'biz'] } })
        .required(),
    password: new passwordComplex({
        min: 8,
        max: 100,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requrementCount: 4
    })
});

//handle the create user GET request
router.post('/', (req, res) => {
    const recvRes = { // create object using user request for validation
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    //get validation result
    const validateState = joiSchema.validate(recvRes);
    //send error if validation is error
    if (validateState.error) {
        res.status(200).send({
            status: 3,
            message: validateState.error.details[0].message//return error
        });
        return;
    }

    //check email already use
    const checkMail = { email: req.body.email };
    
    //check email already in use 
    db().collection('user').find(checkMail).toArray(function (err, result) {
        if (err) { throw error; return; }
        if (result.length == 0) {
            //password hash to 
            const _password = crypto.createHash('sha256').update(req.body.password).digest('hex');
            
            //api secret for the recognize the user
            const apiSecret = crypto.createHash('sha256').update(new Date(Date.now())+"and I am Iron Man!!!").digest('hex').slice(0,32);

            //create confirm id for email verification
            const confirmToken = crypto.createHash("sha256").update(req.body.email + Date.now()).digest('hex');

            //send email
            mail.sendEmail(req.body.email, 'Email confirmation - ' + process.env.SITE_NAME,
                process.env.GREETING_TAG_OPEN + process.env.SITE_GREETING + ' ' + req.body.name + process.env.GREETING_TAG_CLOSE + '<br>'
                + process.env.CONFIGM_MAIL_BODY + '<br> <a href="' + process.env.MAIL_CONFIRM_LINK + '/' + confirmToken + '">' + process.env.CONFIRM_MAIL_TEXT + '</a>'
            );

            //send success response to the site with status 1
            res.status(201).send({
                status: 1
            });

            //creating data object for insert user data
            const finalData = {
                name: (req.body.name).toLowerCase(),
                email: req.body.email,
                password: _password,
                createDate: new Date(Date.now()).toISOString(),
                status: "active",
                apiSecret:apiSecret,
                verificationToken: confirmToken
            };

            //insert data to database
            db().collection('user').insertOne(finalData, (err, res) => {
                //log the user behaviour
                logger.userLogger({notification: "New user created", date: new Date( Date.now()), data:finalData});
                if (err) {
                    db().collection('user').insertOne(finalData);
                }
            });
            
        } // end of the if email not exit

        if (result.length != 0) {
            //if email is used before send status 2
            res.status(201).send({
                status: 2,
                message: "This email already used"
            });
        }
    });
});

module.exports = router;

/* 
status codes
status: 1 successfully created
status: 2 email already used
status: 3 some fields are incorrect or missing
*/