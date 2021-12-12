const express = require("express");
const joi = require("joi");
const path = require("path");
const passwordComplex = require("joi-password-complexity")
const db = require("../dbConnection").useDB;
const mongoDB = require("mongodb").ObjectID;
const crypto = require("crypto");
const elogger = require("../logger");
const aes = require("../aescrypt");
const csvcreator = require("json2csv");
const multer = require("multer");
let upload = multer({ dest: path.join(__dirname, '../temp/') });//temperoy location
const router = express.Router(); 3
const fs = require("fs");

require("dotenv/config");

router.get('/task/search',  async (req, res) => {

    //validate data
    const validateShema = joi.object({
        "projectID": joi.string().min(24).max(24).alphanum().required(), "deviceUUID": joi.string().min(36).max(36).required(),
        "userID": joi.string().min(24).max(24).alphanum().required()
    })
    const validateResult = await validateShema.validate({ "projectID": req.body.projectID, "deviceUUID": req.body.deviceUUID, "userID": req.body.userID });
    if (validateResult.error) return res.status(200).send({ status: 0, errorCode: 1, msg: "Primary data incomplete" })

    //get device id
    let deviceID = await db().collection('devices').find({ UUID: req.body.deviceUUID, userID: req.body.userID, deviceStatus: "active" }).toArray();
    if (deviceID.length == 0) return res.status(200).send({ status: 0, errorCode: 2, msg: "Cant find device" })

    deviceID = deviceID[0]._id;

    //check project is contributed
    let isContributed = await db().collection('project').find({ _id: mongoDB.ObjectID(req.body.projectID), devices: new RegExp(deviceID, 'g') },
        { projection: { _id: 1 } }).toArray();

    //send error message 
    if (isContributed.length != 1) return res.status(200).send({ status: 0, errorCode: 3, msg: "This device is not contributed to this project" })

    //check project is active mode
    let isActive = await db().collection("project").find({ _id: mongoDB.ObjectID(req.body.projectID), status: "active" }, { projection: { _id: 1, createdBy: 1 } }).toArray();

    //send error message if project is not active 
    if (isActive.length != 1) return res.status(200).send({ status: 0, errorCode: 4, msg: "This project is not active" })

    // get user secret key 
    let secretKey = await db().collection('user').find({ _id: mongoDB.ObjectID(isActive[0].createdBy) }, { projection: { _id: 1, apiSecret: 1 } }).toArray();
    secretKey = secretKey[0].apiSecret;

    //search tasks
    let availableTasks = await db().collection('task').find({
        project_id: req.body.projectID, status: new RegExp('(added|attend)'),
        $or: [{ method: new RegExp('(0|1)', 'g') }, { targetDevice: new RegExp(deviceID, 'g') }]
    }).limit(1).toArray();

    //send error message if project is not active 
    if (availableTasks.length != 1) return res.status(200).send({ status: 0, errorCode: 5, msg: "There are no tasks to do" })

    const encryptedData = aes.encrypt(secretKey, availableTasks[0].data)

    availableTasks[0].taskID = availableTasks[0]._id;
    delete availableTasks[0]._id; delete availableTasks[0].project_id; delete availableTasks[0].status; delete availableTasks[0].finishedby; delete availableTasks[0].result;
    delete availableTasks[0].targetDevice; delete availableTasks[0].createdBy; availableTasks[0].data = encryptedData.data;
    return (res.status(200).send({ status: 1, msg: availableTasks }));
});

//successfully receive task and start to work on it
router.put('/task/received', async (req, res) => {
    const validateSchema = joi.object({
        taskID: joi.string().required().max(24).min(24).alphanum().required(),
        projectID: joi.string().required().max(24).min(24).alphanum().required(),
        userID: joi.string().required().max(24).min(24).alphanum().required()
    })

    //validate task ID
    const validateResult = await validateSchema.validate({ taskID: req.body.taskID, projectID: req.body.projectID, userID: req.body.userID });
    if (validateResult.error) return res.status(400).send({ status: 0, errorCode: 1, msg: "Data is invalid" });

    //check project is active mode
    let isActive = await db().collection("project").find({ _id: mongoDB.ObjectID(req.body.projectID), status: "active" }, { projection: { _id: 1, createdBy: 1 } }).toArray();

    //send error message if project is not active 
    if (isActive.length != 1) return res.status(400).send({ status: 0, errorCode: 2, msg: "This project is not active" })

    //search tasks 
    let availableTasks = await db().collection('task').find({
        _id: mongoDB.ObjectID(req.body.taskID), status: new RegExp('(added|attend)')
    }).limit(1).toArray();

    //send error message if task not in correct condition
    if (availableTasks.length != 1) return res.status(200).send({ status: 0, errorCode: 3, msg: "There are no task" })

    //check already utilizing
    const isUtilizing = await db().collection('utilizing').find({ projectID: req.body.projectID, taskID: req.body.taskID, userID: req.body.userID }).toArray()

    if (isUtilizing.length != 0) return res.status(200).send({ status: 0, errorCode: 4, msg: "This task already utilizing" });

    //update task
    let updateTask = await db().collection('task').updateOne({ _id: mongoDB.ObjectID(req.body.taskID) }, { $set: { "status": "attend" } })

    //insert to utilizong 
    const utilizing = await db().collection('utilizing').insertOne({
        projectID: req.body.projectID, joinedTime: new Date().getTime().toString(), taskID: req.body.taskID,
        userID: req.body.userID
    })

    return res.status(200).send({ status: 1, msg: "Done" });
})

//When task is complete
router.put('/task/complete', async (req, res) => {
    const validateSchema = joi.object({
        taskID: joi.string().required().max(24).min(24).alphanum().required(), projectID: joi.string().required().max(24).min(24).alphanum().required(),
        userID: joi.string().required().max(24).min(24).alphanum().required(), deviceUUID: joi.string().min(36).max(36).required(), data: joi.string().min(1).required()
    })

    //validate request
    const validateResult = await validateSchema.validate({
        taskID: req.body.taskID, projectID: req.body.projectID, userID: req.body.userID, data: req.body.data, deviceUUID: req.body.deviceUUID
    });

    //if error send error message
    if (validateResult.error) return res.status(200).send({ status: 0, errorCode: 1, msg: "Data is invalid" })

    //check project is active mode
    let isActive = await db().collection("project").find({ _id: mongoDB.ObjectID(req.body.projectID), status: "active" }, { projection: { _id: 1, createdBy: 1 } }).toArray();

    //send error message if project is not active 
    if (isActive.length != 1) return res.status(400).send({ status: 0, errorCode: 2, msg: "This project is not active" })

    //search tasks 
    let availableTasks = await db().collection('task').find({ _id: mongoDB.ObjectID(req.body.taskID), status: "attend" }).limit(1).toArray();

    //send error message if task not in correct condition
    if (availableTasks.length != 1) return res.status(400).send({ status: 0, errorCode: 3, msg: "There are no task" })

    //get device id
    let deviceID = await db().collection('devices').find({ UUID: req.body.deviceUUID, userID: req.body.userID, deviceStatus: "active" }).toArray();
    if (deviceID.length == 0) return res.status(200).send({ status: 0, errorCode: 4, msg: "Cant find device" })

    deviceID = deviceID[0]._id;

    //update task and update the utilizing
    let updateTask = await db().collection('task').updateOne({ _id: mongoDB.ObjectID(req.body.taskID) }, {
        $set: {
            status: "complete", result: req.body.data,
            finishedby: deviceID.toString()
        }
    });

    let updateUtilize = await db().collection('utilizing').updateOne({ projectID: req.body.projectID, taskID: req.body.taskID }, {
        $set: {
            result: req.body.data,
            finishedTime: new Date().getTime().toString()
        }
    })

    res.status(200).send({ status: 1, msg: "Done" })
})

//create task
router.post('/task/create', async (req, res) => {
    if (typeof (req.body.projectID) == 'undefined' || typeof (req.body.taskName) == 'undefined' || typeof (req.body.taskMethod) == 'undefined' || typeof (req.body.data) == 'undefined'
        || typeof (req.body.userID) == 'undefined') return res.status(400).send({ status: 0, errorCode: 1, msg: "Data is invalid" })

    let validateSchema = joi.object({
        projectID: joi.string().min(24).max(24).alphanum().trim().required(),
        taskName: joi.string().pattern(new RegExp('^[a-zA-Z]+[a-zA-Z0-9-_ ]*[a-zA-Z0-9]$')).min(2).max(20).trim().required(), taskMethod: joi.number().min(0).max(2).required(),
        data: joi.string().min(1).trim().required(), userID: joi.string().min(24).max(24).alphanum().trim().required(),
    })

    //validate request
    let validateData = {
        projectID: (req.body.projectID), taskName: (req.body.taskName).trim(), taskMethod: req.body.taskMethod,
        data: (req.body.data).trim(), userID: (req.body.userID).trim()
    };

    let validateResult = await validateSchema.validate(validateData)

    //if error send error message
    if (validateResult.error) return res.status(400).send({ status: 0, errorCode: 1, msg: "Data is invalid" })

    //if task method is 2 then check devices
    if (req.body.taskMethod == 2 || req.body.taskMethod == "2") {
        if (typeof (req.body.targetDevice) == 'undefined') return res.status(400).send({ status: 0, errorCode: 1, msg: "Data is invalid" })
        validateSchema = joi.object({ targetDevice: joi.string().min(24).max(24).alphanum().required() })

        let deviceIDs = req.body.targetDevice.split(",");
        for await (let deviceID of deviceIDs) {
            validateResult = await validateSchema.validate({ targetDevice: deviceID.trim() })
            if (validateResult.error) return res.status(400).send({ status: 0, errorCode: 1, msg: "Data is invalid" })
        }
    }

    //search project is own this user
    const isOwner = await db().collection('project').find({ _id: mongoDB.ObjectID(req.body.projectID.trim()), createdBy: req.body.userID.trim(), status: "active" }).toArray()
    if (isOwner.length != 1) return res.status(200).send({ status: 0, errorCode: 2, msg: "Not authorized" })

    let devices = "";
    //if target devices are contribiuted
    if (req.body.taskMethod == 2 || req.body.taskMethod == "2") {
        deviceIDs = req.body.targetDevice.split(",");
        for await (let deviceID of deviceIDs) {
            let isContributed = await db().collection('project').find({ devices: new RegExp(deviceID.trim(), 'g') }).toArray()
            if (isContributed.length != 1) return (res.status(200).send({ status: 0, errorCode: 3, msg: "Requested device is not contributed. deviceID " + deviceID }))
            devices += deviceID.trim() + ",";
        }
    }
    //add task 
    await db().collection('task').insertOne({
        project_id: req.body.projectID.trim().toString(), name: req.body.taskName.trim(), method: req.body.taskMethod.trim().toString(),
        data: req.body.data.trim().toString(), status: "added", finishedby: "", result: "", targetDevice: devices, createdBy: req.body.userID.trim(), addedTime: new Date(Date.now())
    });

    //send created msg
    res.status(201).send({ status: 1, msg: "Created" });
})

//request device id by UUID
router.get('/device/search/deviceid', async (req, res) => {
    const uuid = req.body.uuid;
    const validateShema = joi.object({ uuid: joi.string().min(36).max(36).required() })
    const validateResult = await validateShema.validate({ uuid: uuid });
    if (validateResult.error) return (res.status(400).send({ status: 0, errorCode: 1, msg: "Request is not valid" }));

    const result = await db().collection('devices').find({ UUID: uuid }).toArray();
    if (result.length != 1) return (res.status(200).send({ status: 0, errorCode: 2, msg: "Cant find the device" }))

    return (res.status(302).send({ status: 1, data: result[0]._id.toString() }))
})


//if there are not specific request
router.all('*', (req, res) => {
    return (res.status(404).send({ status: 404, msg: "Not Found" }));
});

module.exports = router;