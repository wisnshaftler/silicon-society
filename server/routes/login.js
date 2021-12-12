const express = require("express");
const db = require("../dbConnection").useDB;
const router = express.Router();
const logError = require("../logger");
const joi = require("joi");

//create schema for login details check
const credentialsSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'biz'] } }).required(),
    password: joi.string().alphanum().min(64).max(64).required(),
});

router.post('/', (req, res) => {
    //validate the code credentials
    const validateCredentials = credentialsSchema.validate({ email: req.body.email, password: req.body.password });

    //check if validation has errors
    if (validateCredentials.error) {
        //send error
        res.status(201).send({ status: 0, msg: "Username or password is incorrect" });
        return;
    }
    //check if login is correct
    db().collection('user').find({ email: req.body.email, activated: true, status: "active", password: req.body.password }).toArray()
        .then(result => { //check with the results
            //send error message to client
            if (result.length != 1) { res.status(201).send({ status: 2 }); return; }

            //if login success send the correct 
            if (result.length == 1) { res.status(201).send({ status: 1, name: result[0].name, msg: "Success" }); return; }
        })
        .catch(error => {
            //log the error

            logError.errorLogger({ data: "error while user try to ling", email: req.body.email, time: new Date(Date.now()), error: error });
        })
});

//export module
module.exports = router;

/*
status 0:   email or password is incorrect
status 1:   account is not activated or terminated
status 2:   success send cookie code and redirect to page
*/