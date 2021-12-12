const express = require("express");
const joi = require("joi");
const path = require("path");
const passwordComplex = require("joi-password-complexity")
const db = require("../dbConnection").useDB;
const crypto = require("crypto");
const elogger = require("../logger");
const accountCheck = require("../credCheck");
const def = require("../functions");
const csvcreator = require("json2csv");
const mongoDB = require("mongodb").ObjectID;
//const multer = require("multer");
//let upload = multer({ dest: path.join(__dirname, '../temp/') });//temperoy location
const router = express.Router();
const fs = require("fs");
const mailer = require("../mailer");
require("dotenv/config");

/**
 * user login to account
 */
router.post('/login', async (req, res) => {
    let result = await accountCheck.checkIt(req.body.email, req.body.password);
    if (!result) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
    result = await accountCheck.getIt(req.body.email, req.body.password);
    return (res.status(200).send({ status: 1, data: result }))
});

/**
 * Device search by UUID
 */
router.post('/uuidSearch', async (req, res) => {
    let result = await accountCheck.checkIt(req.body.email, req.body.password);
    if (!result) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
    result = await accountCheck.getIt(req.body.email, req.body.password);
    result = await db().collection("devices").find({ UUID: req.body.uuid }).toArray();
    return (res.status(200).send({ status: 1, data: result }))
})

/**
 * send the possible processor list
 */
router.post('/processorList', async (req, res) => {
    let result = await accountCheck.checkIt(req.body.email, req.body.password);
    if (!result) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
    result = await accountCheck.getIt(req.body.email, req.body.password);
    result = await db().collection("processor").find({ Type: "CPU", Processor: new RegExp(req.body.processor, "i") }, { projection: { Processor: 1 } }).toArray();

    return (res.status(200).send({ status: 1, data: result }))
});

/**
 * add new device to platform
 */
router.put("/newDevice", async (req, res) => {
    let account = await accountCheck.checkIt(req.body.email, req.body.password);
    if (!account) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
    account = await accountCheck.getIt(req.body.email, req.body.password);

    let schema = joi.object({
        cpuName: joi.string().required(), osName: joi.string().required(), pcname: joi.string().required(), UUID: joi.string().required(), ram: joi.number().required(),
        storage: joi.number().required(), network: joi.number().required()
    });
    let validator = await schema.validate({
        cpuName: req.body.cpuName, osName: req.body.osName, pcname: req.body.pcname, UUID: req.body.UUID, ram: req.body.ram, storage: req.body.storage,
        network: req.body.network
    });
    let newDevice = {
        userID: account[0]._id.toString(), UUID: req.body.UUID.trim(), RAM: req.body.ram, CPU: req.body.cpuName, network: req.body.network, hdd: req.body.storage,
        deviceName: req.body.pcname, deviceOS: req.body.osName, deviceStatus: "active", addedTime: new Date(Date.now())
    }
    if (validator.error) { return (res.status(200).send({ status: 0, msg: "Required fields are not set. Please try again" + validator.error })) };

    //check device is exists
    const checkAvailable = await db().collection("devices").find({ UUID: req.body.UUID.trim() }).toArray();
    if (checkAvailable.length == 1) return res.status(200).send({ status: 0, msg: "Device is already registerd. Please reopen the software" });

    //insert data to db
    const result = await db().collection("devices").insertOne(newDevice);
    if (result.insertedCount == 1) return (res.status(200).send({ status: 1, msg: "Done. Please close the software and reopen it" }));

    //if error 
    return (res.status(200).send({ status: 0, msg: "Please try again" }));
});

/**
 * search the projects that can contribute given device
 */
router.post('/projectSearch', async (req, res) => {
    try {
        let account = await accountCheck.checkIt(req.body.email, req.body.password);
        if (!account) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
        account = await accountCheck.getIt(req.body.email, req.body.password);

        let schema = joi.object({ UUID: joi.string().min(10).required() });
        let validation = await schema.validate({ UUID: req.body.UUID.trim() });

        if (validation.error) { return (res.status(200).send({ status: 0, msg: "UUID is invalid" })) }

        let userID = account[0]._id.toString();
        let deviceData = await db().collection('devices').find({ UUID: req.body.UUID.trim() }).toArray();
        const deviceID = deviceData[0]._id.toString();
        const deviceRAM = deviceData[0].RAM;
        let deviceProcessor = deviceData[0].CPU;
        let deviceOS = deviceData[0].deviceOS.split(" ")[0];
        deviceProcessor = await db().collection('processor').find({ Processor: deviceProcessor }, { projection: { "Benchmark Score": 1, _id: 0 } }).toArray();
        deviceProcessor = deviceProcessor[0]['Benchmark Score'];
        deviceProcessor = await db().collection('processor').find({ "Benchmark Score": { $lte: deviceProcessor }, Type: "CPU" }, { projection: { _id: 1 } }).toArray();
        let processorList = [];

        deviceProcessor.forEach(processID => {
            processorList.push(processID._id.toString());

        });

        let result = await db().collection('project').find({
            $expr: { $lt: [{ $size: "$devices" }, "$needDeviceCount"] }, status: "active", userID: { $ne: userID },
            devices: { $nin: [deviceID] }, leastRAM: { $lte: deviceRAM }, os: new RegExp('(' + deviceOS + '|both)', 'g'), leastCPU: { $in: processorList }
        }, { projection: { devices: 0 } }).sort({ time: -1 }).toArray();

        //needDeviceCount: {$lt: 5} we do not, cannot and will not stop watching your videos
        return (res.status(200).send({ status: 1, data: result }));
    } catch (e) {
        console.log(e)
        return (res.status(200).send({}));
    }
})

/**
 * New contribution of device
 */
router.put('/newContribute', async (req, res) => {
    try {
        let account = await accountCheck.checkIt(req.body.email, req.body.password);
        if (!account) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
        account = await accountCheck.getIt(req.body.email, req.body.password);

        const schema = joi.object({
            UUID: joi.string().min(10).required(),
            selectedProject: joi.string().alphanum().min(24).max(24).required()
        });
        const validate = await schema.validate({ UUID: req.body.UUID, selectedProject: req.body.selectedProject });
        if (validate.error) { return res.status(200).send({ status: 0, msg: "Required fields are not set" }) }

        //validate project id
        const projectDetails = await db().collection('project').find({ _id: mongoDB.ObjectID(req.body.selectedProject) }).toArray();
        if (projectDetails.length == 0) { return res.status(200).send({ status: 0, msg: "There are no projects given project ID" }) }

        //check uuid
        const deviceDetails = await db().collection('devices').find({ UUID: req.body.UUID.trim() }).toArray();
        if (deviceDetails.length == 0) { return res.status(200).send({ status: 0, msg: "There are no devices given UUID" }) }

        //add device to project
        const addDeviceToProject = await db().collection('project').updateOne({ _id: mongoDB.ObjectID(req.body.selectedProject) },
            { $addToSet: { devices: deviceDetails[0]._id.toString() } });
        //check is success
        if (addDeviceToProject.modifiedCount == 0) { return res.status(200).send({ status: 0, msg: "Seems like you already contributed to this project using this device." }) }

        //add data to contributed collection
        const contributed = await db().collection('contributed').insertOne({
            projectID: req.body.selectedProject, userID: account[0]._id.toString(),
            joinDate: new Date(Date.now()), deviceID: deviceDetails[0]._id.toString()
        });

        if (contributed.modifiedCount == 0) { return res.status(200).send({ status: 0, msg: "There was an error while processing the data. Please try again shortly" }) }

        return res.status(200).send({ status: 1, msg: "Done" });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the newContribute function in software.js .",
            time: new Date(Date.now()),
            error: e.message
        });
        return res.status(200).send({ status: 0, msg: "There was an error while processing data. Please try again later." });
    }
});

/**
 * get all the contributed project using this device
 */
router.post('/contributed', async (req, res) => {
    try {
        let account = await accountCheck.checkIt(req.body.email, req.body.password);
        if (!account) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
        account = await accountCheck.getIt(req.body.email, req.body.password);

        const schema = joi.object({
            UUID: joi.string().min(10).pattern(new RegExp('^[a-zA-Z0-9-]+$')).required()
        });
        const validate = await schema.validate({ UUID: req.body.UUID });
        if (validate.error) { return res.status(200).send({ status: 0, msg: "Required fields are not set" }) }

        const deviceDetails = await db().collection('devices').find({ UUID: req.body.UUID.trim() }).toArray();
        if (deviceDetails.length == 0) { return res.status(200).send({ status: 0, msg: "There are no devices given UUID" }) }

        const result = await db().collection('project').find({ devices: deviceDetails[0]._id.toString() }, { projection: { devices: 0 } }).toArray();

        return (res.status(200).send({ status: 1, data: result }))
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the newContribute function in software.js .",
            time: new Date(Date.now()),
            error: e.message
        });
        return res.status(200).send({ status: 0, msg: "There was an error while processing data. Please try again later." });
    }
});

/**
 * leave given device from given project
 */
router.post('/leaveContribute', async (req, res) => {
    try {
        let account = await accountCheck.checkIt(req.body.email, req.body.password);
        if (!account) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }
        account = await accountCheck.getIt(req.body.email, req.body.password);

        const schema = joi.object({
            UUID: joi.string().min(10).pattern(new RegExp('^[a-zA-Z0-9-]+$')).required(),
            selectedProject: joi.string().alphanum().min(24).max(24).required()
        });
        const validate = await schema.validate({ UUID: req.body.UUID.trim(), selectedProject: req.body.selectedProject });
        if (validate.error) { return res.status(200).send({ status: 0, msg: "Required fields are not set" }) }

        //validate project id
        const projectDetails = await db().collection('project').find({ _id: mongoDB.ObjectID(req.body.selectedProject) }).toArray();
        if (projectDetails.length == 0) { return res.status(200).send({ status: 0, msg: "There are no projects given project ID" }) }

        //check uuid
        const deviceDetails = await db().collection('devices').find({ UUID: req.body.UUID.trim() }).toArray();
        if (deviceDetails.length == 0) { return res.status(200).send({ status: 0, msg: "There are no devices given UUID" }) }

        const updateContribute = await db().collection('contributed').updateOne(
            { projectID: projectDetails[0]._id.toString(), deviceID: deviceDetails[0]._id.toString(), leftDate: { $exists: false } },
            { $set: { leftDate: new Date(Date.now()) } }
        );

        if (updateContribute.modifiedCount != 1) {
            return (res.status(200).send({ status: 0, msg: "Error while processing data. Please try again" }));
        }

        const updateProject = await db().collection('project').updateOne({ _id: mongoDB.ObjectID(req.body.selectedProject) },
            { $pull: { devices: new RegExp(deviceDetails[0]._id.toString(), 'g') } }
        );

        return (res.status(200).send({ status: 1, msg: "Done" }))
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the leaveContribute function in software.js .",
            time: new Date(Date.now()),
            error: e.message
        });
        return res.status(200).send({ status: 0, msg: "There was an error while processing data. Please try again later." });
    }
})

module.exports = router;