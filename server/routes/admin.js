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
const multer = require("multer");
let upload = multer({ dest: path.join(__dirname, '../temp/') });//temperoy location
const router = express.Router(); 3
const fs = require("fs");
const mailer = require("../mailer");
require("dotenv/config");

//handle the webpage request
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../web-pages', 'admin-login.html'))
});

//handle the admin dashboard page
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../web-pages', 'dashboard.html'))
});

//handle the login of the admin
router.post('/login/credentials', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            return (res.status(200).send(result));
        });
});

router.post('/start', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            initiateState(req, res, result[0].role, result[0].username);
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            } else {
                return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
            }
        });
});

/**
 * This function send the initiate state whitch means return the overview data
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 * @param {String} adminRole Admin Role
 * @param {String} adminsUsername username of the admin
 */
async function initiateState(req, res, adminRole, username) {
    try {
        let result = await def.initiateStage();
        result.username = username;
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the initiateStage function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return res.status(200).send({ status: 0, msg: "Something went wrong. Please try again" });
    }
}

//get pending projects request
router.post('/projects/pending', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            allPendingProjects(req, res, result[0].username);
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
});

//get all pending projects and send
async function allPendingProjects(req, res) {
    try {
        const pendingProjects = await def.allPendingProjects();
        return (res.status(200).send(pendingProjects));

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the pendingProjectApproval function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return res.status(200).send({ status: 0, msg: "Something went wrong. Please try again" });
    }
}

//gett the project detail by given id
router.post('/projects/search/id', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            getProjectByID(req, res, req.body.projectID, req.body.status);
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
});

/**
 * return the Object that have data of the given project
 * @param {Object} req request Object
 * @param {Object} res Respons Object
 * @param {String} projectID project ID
 * @param {String} status project status (active, complete, pending, suspend)
 */
async function getProjectByID(req, res, projectID, status) {
    const projectIDSchema = joi.object({
        projectID: joi.string().min(24).max(24).alphanum().required(),
        status: joi.string().required().regex(new RegExp('(all|pending|active|complete|suspend)', 'i'))
    });

    const validationResult = await projectIDSchema.validate({ projectID: projectID, status: status });
    if (validationResult.error) {  
       res.status(200).send({ status: 0, msg: "Project id or project status is incorrect. Please recheck and try again." }) ;
        return
    }

    try {
        const result = await def.adminGetProject(projectID, "projectid", status, "");
        if (result.data.length == 1) {
            return (res.status(200).send(result));
        }
        return (res.status(200).send({ status: 0, msg: "No pending project found similer to ID" }))
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getProjectByID function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Something went wrong. Please try again" }));
    }
}

//gett the project detail by given id
router.post('/projects/approve', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            approveProject(req, res, req.body.projectID, result[0]._id);
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
});

/**
 * pending project activation
 * @param {Object} req req Object
 * @param {Object} res res Object
 * @param {String} projectID approve prokect id
 * @param {String} adminID project approving adming ID
 */
async function approveProject(req, res, projectID, adminID) {
    try {
        const projectIDSchema = joi.object({
            projectID: joi.string().min(24).max(24).alphanum().required()
        });

        const validationResult = await projectIDSchema.validate({ projectID: projectID });
        if (validationResult.error) { 
            res.status(200).send( { status: 0, msg: "Project id is incorrect. Please recheck and try again." })
             return
         }

        const result = await def.approveProject(projectID, adminID);
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the approveProject function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return res.status(200).send({ status: 0, msg: "Something went wrong. Please try again" });
    }

}

//gett the project detail by given search string
router.post('/projects/search', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            globalSearchProject(req, res, req.body.searchString, req.body.property)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
});

/**
 * this method return the project result searching by given search string and property method(projectid or project name)
 * @param {Object} req request Object
 * @param {Object} res res Object
 * @param {String} seachString string that have to search
 * @param {String} property cotains search based on name or ID
 */
async function globalSearchProject(req, res, searchString, property) {
    try {
        let result;// store the results
        let projectIDSchema = joi.object({
            searchString: joi.string().alphanum().required(),
            property: joi.string().regex(new RegExp('(projectid|name)', 'i')).required()
        });
 
        const validationResult = await projectIDSchema.validate({ searchString: searchString, property: property });
        if (validationResult.error) { 
            return (res.status(200).send(
                { status: 0, msg: "Search string or property is incorrect. Please recheck and try again." }
                ) 
            )
        }
        
        //check project property is project ID is valid if project id set
        if (property == "projectid") {
            try {
                mongoDB.ObjectID(searchString);
            } catch (e) {
                return (res.status(200).send({ status: 0, msg: "Project ID is not valid. Please check" }));
            }
            result = await def.adminGetProject(searchString, property, '', '');

        }
        //if property set as name 
        if (property == "name") {
            result = await def.adminGetProject(searchString, property, '', '');
        }
        
        if (result.status == 0 || result.data.length == 0) { return (res.status(200).send({ status: 0, msg: "No project found" })) }
        if (result.data.length != 1) { return (res.status(200).send({ status: 0, msg: "So many projects found. Please try again" })) }

        //get task of the selected project
        const taskData = await def.adminGetTask('', '', '', '', result.data[0]._id.toString(), 3, -1);
        //get the all task id and names
        const totalTask = await def.projectTaskBasic(result.data[0]._id.toString(), '');

        result.taskData = taskData;
        result.totalTask = totalTask;
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the globalSearchProject function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Something went wrong. Please try again" }));
    }
}

//suspend the project using project ID
router.post('/projects/suspend', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            suspendProject(req, res, req.body.projectID, req.body.reason)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function for suspend the given project
 * @param {Object} req req object
 * @param {Object} res res object
 * @param {String} projectID project id
 * @param {String} reason reason of the suspending
 * @returns JSON Object
 */
async function suspendProject(req, res, projectID, reason) {
    try {
        let schema = joi.object({ projectID: joi.string().min(24).max(24).alphanum().required(), reason: joi.string().min(5).required() });
        const validateResult = await schema.validate({ projectID: projectID, reason: reason });
        //if valitade error
        if (validateResult.error) { return (res.status(200).send({ status: 0, msg: "Project ID or reason is invalid please try again." })) }
        //call to suspend function
        const result = await def.suspendProject(projectID, reason);
        return (res.status(200).send(result)); //return the result

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the suspendProject function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Something went wrong. Please try again" }));
    }
}

//suspend the project using task ID
router.post('/projects/search/task', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            adminSearchTask(req, res, req.body.searchString, req.body.property)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function get the task and send it in object array
 * @param {Object} req req object
 * @param {Object} res res object
 * @param {String} searchString search string it can be task id or name
 * @param {String} property taskid or name of task
 * @returns JSON object
 */
async function adminSearchTask(req, res, searchString, property) {
    try {
        let result;// store the results
        let schema = joi.object({
            searchString: joi.string().alphanum().required(),
            property: joi.string().regex(new RegExp('(taskid|name)', 'i')).required()
        });

        const validationResult = await schema.validate({ searchString: searchString, property: property });
        if (validationResult.error) {  
            (res.status(200).send({ status: 0, msg: "Search string or property is incorrect. Please recheck and try again." }))
            return; 
        }

        //check project property is project ID is valid if project id set
        if (property == "taskid") {
            try {
                mongoDB.ObjectID(searchString);
            } catch (e) {
                return (res.status(200).send({ status: 0, msg: "Task ID is not valid. Please check" }));
            }
            result = await def.adminGetTask(searchString, 'taskid', '', '', '', 0, -1);
            result = { result }
            result.taskList = []
        }
        //if property set as name 
        if (property == "name") {
            const limitResult = await def.adminGetTask(searchString, 'taskname', '', '', '', 3, -1);
            const taskList = await def.adminGetTaskByName(searchString);
            result = { result: limitResult }
            result.taskList = taskList;
        }
        return (res.status(200).send({ status: 1, data: result }));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSearchTask function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Sorry. There is an error. Please try again later" }))
    }
}

//suspend the project using task ID
router.post('/projects/report/download', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            downloadProject(req, res, req.body.projectID, result[0].email)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function send the downloadable link to the user to download the requested data
 * @param {Object} req req object
 * @param {Object} res res object
 * @param {String} projectID ID of the project that needs to download result
 * @param {string}  userEmail email of the user
 * @returns message of the statsu
 */
async function downloadProject(req, res, projectID, userEmail) {
    try {
        const shecma = joi.object({ projectID: joi.string().min(24).max(24).alphanum().required() });
        const validate = await shecma.validate({ projectID: projectID });
        if (validate.error) { return (res.status(200).send({ status: 0, msg: "Project ID is not valid" })) }

        //check project is awailable. if not send the error message
        const checkAvailability = await def.adminGetProject(projectID, 'projectid', '', '');
        if (checkAvailability.data.length != 1) {
            return (res.status(200).send({ status: 0, msg: "Cant find the project. Make sure project ID is correct" }));
        }
        //get the all task data
        res.status(200).send({ status: 1, msg: "Done. In the few minutes you got email with the report download link" });

        const result = await def.adminGetAllTask(projectID);
        const json2csv = new csvcreator.Parser();
        const csv = json2csv.parse(result);//create a new csv file
        //create filename
        const filename = crypto.createHmac('sha256', 'and i am iron man')
            .update(checkAvailability.data[0].name + Date.now().toString())
            .digest('hex') + ".csv";

        //write the file
        fs.writeFile('./reports/' + filename, csv, function (err) {
            if (err) { console.log(err) }
        })
        //send the email
        mailer.adminSendMail(userEmail, 'Report of the project ' + checkAvailability.data[0]._id.toString(),
            '<h4>Hello</h4> <p>You requested project result data file is created. Please download it using this link <a title="Click Me Hurry" href="' +
            process.env.domain + '/report/' + filename + '" target="_blank">Click ME!!!!</a></p> <P> Thank you. </P>',
            '', 'Admin downloading the given project');

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSearchTask function in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Sorry. There is an error. Please try again later" }))
    }
}


//search device by device id
router.post('/devices/search/deviceid', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            searchDeviceByID(req, res, req.body.deviceID)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function return the device ID and that device contributed projects
 * @param {Object} req req object
 * @param {Object} res res object
 * @param {String} deviceID device ID that want to search
 * @returns Object
 */

async function searchDeviceByID(req, res, deviceID) {
    try {
        const schema = joi.object({ deviceID: joi.string().min(24).max(24).alphanum().required() });
        const validationResult = await schema.validate({ deviceID: deviceID });
        if (validationResult.error) { return (res.status(200).msg({ status: 0, msg: "Device ID is not valid" })) }

        const deviceDetail = await def.adminDevice(deviceID)
        return (res.status(200).send(deviceDetail));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminDevice searchDeviceByID in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}


//search device by user id
router.post('/devices/search/userid', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            searchDeviceByUserID(req, res, req.body.userID)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function return the devices that owns by given user
 * @param {Object} req req obje
 * @param {Object} res 
 * @param {String} userID user id that needs to seach fo devices
 * @returns object
 */
async function searchDeviceByUserID(req, res, userID) {
    try {
        const schema = joi.object({ userID: joi.string().min(24).max(24).alphanum().required() });
        const validateResult = await schema.validate({ userID: userID });
        if (validateResult.error) { return (res.status(200).send({ status: 0, msg: "User ID is not valid" })) }

        const devices = await def.adminGetDevice(userID)
        return (res.status(200).send(devices));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminDevice searchDeviceByUserID in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}

//deactivate device by device id
router.post('/devices/statechange/deactivate', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            deactivateDevice(req, res, req.body.deviceID)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function will change the device status to inactive
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} deviceID Device ID that needs to change status to inactive
 * @returns Object
 */
async function deactivateDevice(req, res, deviceID) {
    try {
        const schema = joi.object({ deviceID: joi.string().min(24).max(24).alphanum().required() });
        const schemaResult = await schema.validate({ deviceID: deviceID });
        if (schemaResult.error) { return (res.status(200).send({ status: 0, msg: "Device ID is not valid please check" })) }
        const result = await def.admindeactivateDevice(deviceID);
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminDevice deactivateDevice in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}


//search device by device uuid
router.post('/devices/search/uuid', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            searchDeviceByUUID(req, res, req.body.uuid)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * THis function return the object that contains device details of given UUID
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} uuid Device UUID
 * @returns 
 */
async function searchDeviceByUUID(req, res, uuid) {
    try {
        const schema = joi.object({ uuid: joi.string().regex(new RegExp('[A-Za-z0-9_-]', 'i')).required() })
        const schemaValidate = await schema.validate({ uuid: uuid })
        if (schemaValidate.error) { return res.status(200).send({ status: 0, msg: "UUID is invalid." }) }
        const result = await def.adminDeviceByUUID(uuid);

        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminDevice searchDeviceByUUID in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}


//search user by given email or user ID
router.post('/user/search', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            searchUser(req, res, req.body.searchString, req.body.containString)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

async function searchUser(req, res, searchString, containString) {
    try {
        let schema = joi.object({ containString: joi.string().alphanum().regex(new RegExp('(userid|email)', 'i')).required() })
        let validator = await schema.validate({ containString: containString });
        if (validator.error) { return (res.status(200).send({ status: 0, msg: "Please refresh the webpage" })) }
        //if user send the user ID
        if (containString == 'userid') {
            schema = joi.object({ searchString: joi.string().alphanum().min(24).max(24).required() });
            validator = await schema.validate({ searchString: searchString });
            if (validator.error) { return (res.status(200).send({ status: 0, msg: "User ID is not valid." })) }
        }
        //check email is valid
        if (containString == 'email') {
            schema = joi.object({ searchString: joi.string().email().required() });
            validator = await schema.validate({ searchString: searchString });
            if (validator.error) { return (res.status(200).send({ status: 0, msg: "User email is not valid." })) }
        }
        const result = await def.adminGetUser(searchString, containString)
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the searchUser in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}

//this receive the user deactivation from the admin
router.post('/user/deativate', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            adminSuspendUser(req, res, req.body.userID)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})
/**
 * THis function suspend the user   
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} userID User ID string
 * @returns Object
 */
async function adminSuspendUser(req, res, userID) {
    try {
        const schema = joi.object({ userID: joi.string().alphanum().min(24).max(24).required() })
        const validator = await schema.validate({ userID: userID });
        if (validator.error) { return (res.status(200).send({ status: 0, msg: "Please refresh the webpage. User id is invalid" })) }
        const result = await def.adminSuspendUser(userID);
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSuspendUser in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}

//this receive the admin search
router.post('/search/', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            adminSearch(req, res, req.body.searchString, req.body.containString)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function will retun searched admin data
 * @param {Onject} req 
 * @param {Object} res 
 * @param {String} searchString This contains the string that needs to search
 * @param {String} containString This contains the which kind of search string sent 
 * @returns Object
 */
async function adminSearch(req, res, searchString, containString) {
    try {
        let schema = joi.object({ containString: joi.string().alphanum().regex(new RegExp('(adminid|adminemail)', 'i')).required() })
        let validator = await schema.validate({ containString: containString });
        if (validator.error) { return (res.status(200).send({ status: 0, msg: "Please refresh the webpage. Method is not working correct" })) }
        //if user send the user ID
        if (containString == 'adminid') {
            schema = joi.object({ searchString: joi.string().alphanum().min(24).max(24).required() });
            validator = await schema.validate({ searchString: searchString });
            if (validator.error) { return (res.status(200).send({ status: 0, msg: "Admin ID is not valid." })) }
        }
        //check email is valid
        if (containString == 'adminemail') {
            schema = joi.object({ searchString: joi.string().email().required() });
            validator = await schema.validate({ searchString: searchString });
            if (validator.error) { return (res.status(200).send({ status: 0, msg: "Admin email is not valid." })) }
        }
        const result = await def.adminSearch(searchString, containString);
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSearch in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}
//suspend the admin or modarator account
router.post('/suspend/', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            suspendAdmin(req, res, req.body.adminID, result[0].role)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})
/**
 * This fucntion suspend the given admin
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} adminID This contains the admin ID that needs to suspend
 * @param {String} myrole This contains the Admin role
 * @returns 
 */
async function suspendAdmin(req, res, adminID, myrole) {
    try {
        const schema = joi.object({ adminID: joi.string().alphanum().min(24).max(24).required() })
        const validateResult = await schema.validate({ adminID: adminID });
        if (validateResult.error) { res.status(200).send({ status: 0, msg: "Admin ID is invalid please refresh." }) }
        if (myrole != "admin") {
            return (res.status(200).send({ status: 0, msg: "You dont have permission to do this" }));
        }
        const result = await def.adminSuspendAdmin(adminID);
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the suspendAdmin in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}
//this capture the new admin request
router.post('/new/', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            newAdmin(req, res, req.body.newAdminEmail, req.body.newAdminPassword, req.body.newAdminRole, req.body.newAdminUsername, result[0].role, result[0]._id)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * THis function validate and start the process the new admin creations
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} newAdminEmail New admin email address
 * @param {String} newAdminPassword New admin password
 * @param {String} newAdminRole New admin Role 
 * @param {String} newAdminUsername New admin Username
 * @param {String} myRole New admin Role (admin or moderator)
 * @param {String} myID New admin creation account id
 * @returns 
 */
async function newAdmin(req, res, newAdminEmail, newAdminPassword, newAdminRole, newAdminUsername, myRole, myID) {
    try {
        if (myRole != "admin") { return (res.status(200).send({ status: 0, msg: "You dont have permission to do this." })) }
        const schema = joi.object({ newAdminEmail: joi.string().email().required(), newAdminUsername: joi.string().alphanum().required() })
        const validate = await schema.validate({ newAdminEmail: newAdminEmail, newAdminUsername: newAdminUsername });
        if (validate.error) { console.log(validate.error); return (res.status(200).send({ status: 0, msg: "Email or username is incorrect. Please check" })) }

        const complexityOption = { min: 8, max: 200, lowerCase: 1, upperCase: 1, numeric: 1, symbol: 1, requirementCount: 4 }
        const passworrdValidate = passwordComplex(complexityOption).validate(newAdminPassword);
        if (passworrdValidate.error) { return (res.status(200).send({ status: 0, msg: "Password is invalid. Make strong password" })) }

        if (newAdminRole != "admin" && newAdminRole != "moderator") { return (res.status(200).send({ status: 0, msg: "Admin role is incorrect. Please refresh webpage." })) }

        const result = await def.newAdmin(newAdminEmail, newAdminPassword, newAdminRole, newAdminUsername, myID);

        return (res.status(200).send(result))
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the newAdmin in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}

//this capture the admin password reset
router.post('/password/reset/', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            adminResetPassword(req, res, req.body.searchString, req.body.searchProperty, result[0].role)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})
/**
 * This function reset the Password of admin
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} searchString This contains the Search String email or password
 * @param {String} searchBody This contain method adminid or adminemail
 * @param {String} myRole This string contain Requested admin Role
 * @returns 
 */
async function adminResetPassword(req, res, searchString, searchBody, myRole) {
    try {
        if (myRole != "admin") {return res.status(200).send({ status: 0, msg: "Sorry. You dont have permission to do that." })  }
        let schema = joi.object({ searchBody: joi.string().alphanum().regex(new RegExp('(adminid|adminemail)', 'i')).required() })
        let validator = await schema.validate({ searchBody: searchBody });
        if (validator.error) { return (res.status(200).send({ status: 0, msg: "Please refresh the webpage. Method is not working correct" })) }
        //if user send the user ID
        if (searchBody == 'adminid') {
            schema = joi.object({ searchString: joi.string().alphanum().min(24).max(24).required() });
            validator = await schema.validate({ searchString: searchString });
            if (validator.error) { return (res.status(200).send({ status: 0, msg: "Admin ID is not valid." })) }
        }
        //check email is valid
        if (searchBody == 'adminemail') {
            schema = joi.object({ searchString: joi.string().email().required() });
            validator = await schema.validate({ searchString: searchString });
            if (validator.error) { return (res.status(200).send({ status: 0, msg: "Admin email is not valid." })) }
        }
        let result = await def.adminSearch(searchString, searchBody);
        //if there are no account
        if (result.status == 0) { return (res.status(200).send({ status: 0, msg: "No Admin account found. Please check Email or ID" })) }
        //updating the password
        result = await def.adminResetPassword(result.data[0]._id, "");
        console.log(result)
        return (res.status(200).send(result))
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminResetPassword in admin js.",
            time: new Date(Date.now()),
            error: e
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}

//this capture the admin password change
router.post('/password/change', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            adminChangePassword(req, res, req.body.newPassword, result[0]._id)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

/**
 * This function will change the given admin Password
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} newPassword This containe new password
 * @param {String} myID This contains ID of the admin that needs to change password
 * @returns Object
 */
async function adminChangePassword(req, res, newPassword, myID) {
    try {
        const complexityOption = { min: 8, max: 200, lowerCase: 1, upperCase: 1, numeric: 1, symbol: 1, requirementCount: 4 }
        const passworrdValidate = passwordComplex(complexityOption).validate(newPassword);
        if (passworrdValidate.error) { return (res.status(200).send({ status: 0, msg: "Password is invalid. Make strong password" })) }

        const result = await def.adminResetPassword(myID, newPassword);
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminChangePassword in admin js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "There are some error. Please try again later" }))
    }
}

//this capture the admin password change
router.post('/userlog/view', (req, res) => {
    accountCheck.checkAdmin(req.body.email, req.body.password)
        .then((result) => {
            if (result.status == 1) {
                accountCheck.getAdmin(req.body.email, req.body.password)
                    .then(result => {
                        //check account is active
                        if (result[0].status == "active") {
                            //call to function and go on
                            
                            viewLog(req, res, result[0]._id)
                        } else {
                            return (res.status(200).send({ status: 0, msg: "The account is not active please log in again" }));
                        }
                    })
            }
        });
})

async function viewLog(req, res, adminID) {
    try {
        let validatorSchema = joi.object({ userEmail: joi.string().email().required() });
        let validateResult = await validatorSchema.validate({userEmail: req.body.userEmail})
        if(validateResult.error){
            return(res.status(200).send({ status:0, msg:"user Email is incorrect" }))
        }

        const data = await db().collection('userLog').find({userEmail: req.body.userEmail}).toArray()
        return(res.status(200).send({status:1, msg:data}))
    } catch (e) {
        console.log(e)
    }
}

module.exports = router;