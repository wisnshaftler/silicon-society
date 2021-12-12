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
const multer = require("multer");
let upload = multer({ dest: path.join(__dirname, '../temp/') });//temperoy location
const router = express.Router(); 3
const fs = require("fs");
require("dotenv/config");


//handle the webpage request
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../web-pages', 'profile.html'))
})

//user login
router.post('/login', (req, res) => {
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            //do this if, when get error
            if (!result) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }

            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error in profile start credentials. Please try again" }); return; }
                    
                    res.status(200).send({ status: 1, msg: "Sucess!!" })
                })
        })
});

router.post('/start', (req, res) => {
    //credential check and do
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            //do this if, when get error
            if (!result) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }

            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error in profile start credentials" }); return; }
                    elogger.userLogger({ userEmail: req.body.email, notification: "User logged in", date: new Date( Date.now()), data:req.ip});
                    start(req, res, result[0]);
                })
        })

});

router.post('/project/', (req, res) => {
    //credential check and do
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            //do this if, when get error
            if (!result) { res.status(201).send({ status: 0, msg: "Credentials are incorrect" }); return; }

            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0 }); return; }
                    getProject(req, res, req.body.projID);
                })
        })
});

/**
 * handle the get all task details download 
 * function get the project ID and user credentials 
 */
router.post('/project/getTask/', (req, res) => {
    //credential check
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/projects/getTask" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/projects/getTask" }); return; }
                    getAllTask(req, res, req.body.projID, (result[0]._id).toString());
                });
        });
});

/**
 * handle the password change
 * function get the project ID and user credentials 
 */
router.post('/change/password/', (req, res) => {
    //credential check
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/change/password" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/change/password" }); return; }
                    changePassword(req, res, req.body.newPassword, (result[0]._id).toString());
                });
        });
});

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} newPassword 
 * @param {Object} userID 
 */
async function changePassword(req, res, newPassword, userID) {
    try {
        const passwordSchema = joi.object({ newPassword: joi.string().alphanum().min(64).max(64).required() })
        const passwordCheck = await passwordSchema.validate({ newPassword: newPassword });
        //if password is wrong send error msg
        if (passwordCheck.error) { return (res.status(200).send({ status: 0, msg: "Password is incorrect. Please check" })) };

        const updatePassword = await def.updatePassword(userID, newPassword);

        elogger.userLogger({ userEmail: req.body.email, notification: "User Changed email", date: new Date( Date.now()), data:req.ip});

        return (res.status(200).send(updatePassword));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the changePassword profile.js file in route folder.",
            time: new Date(Date.now()),
            error: [e.message, e]
        });
        return (res.status(200).send({ status: 0, msg: "There is an error whlile changing the password. Please try again" }));
    }
}

/**
 * Add new project with project image 
 */
let uploads = upload.fields([{ name: "image", maxCount: 1 }]);
router.post('/project/newProject', uploads, (req, res, next) => {

    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/projects/newProject" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/projects/newProject" }); return; }
                    createNewProject(req, res, (result[0]._id).toString());
                });
        });
});

async function createNewProject(req, res, userID) {
    try {
        if (req.files.image == undefined) {
            return (res.status(200).send({ status: 0, msg: "Project image is not selected" }));
        }
        if (req.files.image[0].mimetype != "image/png") {
            return (res.status(200).send({ status: 0, msg: "Project image is not PNG. please upload PNG file." }));
        }
        //validation schema
        const new_porject_creation = joi.object({
            os: joi.string().regex(new RegExp('(windows|linux|both)', 'i')).required().required(),
            projectName: joi.string().max(50).required(),
            deviceCount: joi.number().min(1).required(),
            rewarded: joi.string().regex(new RegExp('(false|true)', 'i')).required(),
            processor: joi.string().required(),
            ram: joi.number().min(1).required(),
            separateTask: joi.string().regex(new RegExp('(false|true)', 'i')).required(),
            projectDescription: joi.string().min(10).required()
        });
        //validating.....
        const validateResult = await new_porject_creation.validate({
            os: req.body.os.trim(),
            projectName: req.body.projectName.trim(),
            deviceCount: req.body.deviceCount,
            rewarded: req.body.rewarded.trim(),
            processor: req.body.processor.trim(),
            ram: req.body.ram,
            separateTask: req.body.separateTask.trim(),
            projectDescription: req.body.projectDescription.trim()
        });

        //validation if error occures
        if (validateResult.error) {
            return (res.status(200).send({ status: 0, msg: validateResult.error.details[0].message }));
        }
        //check processor is valid
        let result = await def.searchProcessor(req.body.processor.trim());
        if (req.body.processor.trim() == "undefined") {
            return (res.status(200).send({ status: 8, msg: "Processor is incorrect please check" }));
        }
        if (result.length == 0) {
            return (res.status(200).send({ status: 8, msg: "Processor is incorrect please check" }));
        }

        // send to the original path
        const extension = req.files.image[0].originalname.slice(-4);
        const filename = req.files.image[0].filename + extension;
        fs.rename(req.files.image[0].path, path.join(__dirname, "../img/", filename), (error) => {
            if (error) {
                elogger.errorLogger({
                    data: "Error occures when uploading files",
                    time: new Date(Date.now()),
                    error: error.message
                });
                return (res.status(200).send({ status: 0, msg: "There was an error uploading image please try again" }
                ))
            }
        });
        //pass data to insert to database
        result = await def.createNewProject(
            req.body.os.trim(),
            req.body.projectName.trim(),
            req.body.deviceCount,
            req.body.rewarded.trim(),
            req.body.processor.trim(),
            req.body.ram,
            req.body.separateTask.trim(),
            req.body.projectDescription.trim(),
            userID,
            filename
        )

        return (res.status(200).send(result));

    } catch (e) {
        console.log(e)
    }
}

/**
 * complete the project complete all active task
 */
router.post('/project/complete', (req, res) => {
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/projects/newProject" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/projects/newProject" }); return; }
                    completeProject(req, res, (result[0]._id).toString());
                });
        });
});

/**
 * complete project. All task needs to be complete state
 * @param {Object} req 
 * @param {Object} res 
 * @param {String} userID 
 */
async function completeProject(req, res, userID) {
    try {
        const validation = joi.object({
            projectID: joi.string().required()
        });

        const validateResult = await validation.validate({ projectID: req.body.projectID });
        if (validateResult.error) { res.status(200).send({ status: 0, msg: "projectID is not valid" }) }

        const result = await def.completeProject(req.body.projectID, userID);

        return (res.status(200).send(result));

    } catch (e) {
        return (res.status(200).send({ status: 0, msg: "Internal Server busy please try again" }));
    }
}
/**
 * Add project software
 */
uploads = upload.fields([{ name: "software" }]);
router.post('/project/software', uploads, (req, res, next) => {
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/projects/newProject" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/projects/newProject" }); return; }
                    softwareUpload(req, res, (result[0]._id).toString());
                });
        });

})

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {String} userID 
 */
async function softwareUpload(req, res, userID) {
    try {
        const isOwner = await def.isOwnerProject(userID, req.body.projectid);
        if (isOwner.length != 1) {
            return (res.status(200).send({ status: 0, msg: "Project ID is invalid make sure you try to edit correct project" }));
        }
        //check the software is selected
        if (req.files.software == undefined) {
            return (res.status(200).send({ status: 0, msg: "no selected software clients" }))
        }

        //check file selected correctly. 
        if (req.files.software.length == 1 && isOwner[0].os == "both") {
            return (res.status(200).send({ status: 0, msg: "Project is for both windows and linux. Please select both software" }))
        }
        //get file extenstion and check with the project OS type
        if (req.files.software.length == 1) {
            const extension = req.files.software[0].originalname.slice(-4);
            const filename = req.files.software[0].filename + extension;

            if (isOwner[0].os == "windows" && extension != ".exe") {
                return (res.status(200).send({ status: 0, msg: "Windows OS needs .exe extension software" }))
            }
            if (isOwner[0].os == "linux" && extension != ".deb") {
                return (res.status(200).send({ status: 0, msg: "Linux OS needs .deb extension software" }))
            }

            fs.rename(req.files.software[0].path, path.join(__dirname, "../soft/", filename), (error) => {
                if (error) {
                    elogger.errorLogger({
                        data: "Error occures when uploading files",
                        time: new Date(Date.now()),
                        error: error.message
                    });
                    return (res.status(200).send({ status: 0, msg: "There was an error uploading file please try again" }
                    ))
                }
            });

            const updateProject = await def.softwareUpload(req.body.projectid, [filename]);
            return (res.status(200).send(updateProject))
        }

        if (req.files.software.length == 2) {
            const extension1 = req.files.software[0].originalname.slice(-4);
            const filename1 = req.files.software[0].filename + extension1;

            const extension2 = req.files.software[1].originalname.slice(-4);
            const filename2 = req.files.software[1].filename + extension2;

            //if files are not same to exe or deb
            if ((extension1 || extension2) != (".exe" || ".deb")) {
                return (res.status(200).send({ status: 0, msg: "kemla umna" }))
            }

            //change software1 path 
            fs.rename(req.files.software[0].path, path.join(__dirname, "../soft/", filename1), (error) => {
                if (error) {
                    elogger.errorLogger({
                        data: "Error occures when uploading files",
                        time: new Date(Date.now()),
                        error: error.message
                    });
                    return (res.status(200).send({ status: 0, msg: "There was an error uploading file please try again" }
                    ))
                }
            });
            //change software2 path
            fs.rename(req.files.software[1].path, path.join(__dirname, "../soft/", filename2), (error) => {
                if (error) {
                    elogger.errorLogger({
                        data: "Error occures when uploading files",
                        time: new Date(Date.now()),
                        error: error.message
                    });
                    return (res.status(200).send({ status: 0, msg: "There was an error uploading file please try again" }
                    ))
                }
            });

            const updateProject = await def.softwareUpload(req.body.projectid, [filename1, filename2]);
            return (res.status(200).send(updateProject));
        }

        return (res.status(200).send({ status: 0, msg: "Unidentifyed software count" }));
    } catch (e) {
        return (res.status(200).send({ status: 0, msg: "Error. Please try again shortly" }));
    }
}

/**
 * update the device state active or inactive
 */
router.post('/device/update', (req, res) => {
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential." }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/deivce/update" }); return; }
                    updateDevice(req, res, req.body.deviceID, req.body.status, (result[0]._id).toString());
                });
        });
});

/**
 * 
 * @param {*} req client req
 * @param {*} res client res
 * @param {*} deviceID client device
 * @param {*} status client device status
 * @param {*} uid client user id
 */
async function updateDevice(req, res, deviceID, status, uid) {
    try {
        const validateSchema = joi.object({
            deviceID: joi.string().min(24).max(24).required(),
            status: joi.string().min(6).max(8).regex(new RegExp('(active|inactive)', 'i')).required()
        })
        const validateResult = await validateSchema.validate({ deviceID: deviceID, status: status });
        if (validateResult.error) { (res.send({ status: 0, msg: "deviceID or status is incorrect please check: Brotip:- Refresh the web page" })) }
        const result = await def.updateDevice(deviceID, status, uid);
        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the updateDevice function in profile.js .",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Error in device update. Please try again later. " }));
    }
}
/**
 * catch the client sendidin email password task ID task name and status. 
 * send those data tot the updateTask function with the request maked USER ID
 */
router.post("/project/updateTask", (req, res) => {
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/projects/updateTask" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/projects/updateTask" }); return; }
                    updateTask(req, res, (result[0]._id).toString());
                });
        });
});
/**
 * Validating the data and send the data to update
 */
async function updateTask(req, res, uid) {
    //schema for the validate project ID and method
    const validateSchema = joi.object({
        taskID: joi.string().min(24).max(24).alphanum().required(),
        status: joi.string().valid('suspend', 'added').required(),
        name: joi.string().min(1).required()
    });
    const _validate = await validateSchema.validate({ taskID: (req.body.taskID).trim(), status: (req.body.status).trim(), name: (req.body.name).trim() });
    //if the validation is get error
    if (_validate.error) { return (res.status(200).send({ status: 0, msg: "Task ID, upate method or name incorrect please check. suggestion :- Refresh the webpage, name must be more than 1 character alphanumaric " })) };
    //return (res.send("done"));
    const result = await def.updateTask(req.body.taskID, req.body.status, req.body.name, uid);
    
    elogger.userLogger({ userEmail: req.body.email, notification: "User Updated Task", date: new Date( Date.now()), data:{ip:req.ip, taskName: req.body.name, detail:result}});
    return (res.status(200).send(result));
}

/**
 * Catch the client request and validate the user login credentials
 * if credentials are correct go to the next data selection process othervice send the error messages
 */
router.post('/project/searchTask', (req, res) => {
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/project/searchTask" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/project/searchTask" }); return; }
                    searchTask(req, res, (result[0]._id).toString());
                });
        });
});
/**
 * get project id and get the contributed task details and send it
 */
router.post('/project/contribution/myUtilize', (req, res) => {
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential." }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. " }); return; }
                    myUtilize(req, res, req.body.projID, (result[0]._id).toString());
                });
        });
});
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} uid 
 * @returns result
 * getting the user ID and project id and send tthe contributions
 */
async function myUtilize(req, res, projID, uid) {
    try {
        const validateSchema = joi.object({
            projID: joi.string().min(24).max(24).required(),
        });
        const validateResult = await validateSchema.validate({ projID: projID });
        if (validateResult.error) { return (res.status(200).send({ status: 0, msg: "Project ID is invalid. Please try again. Reccomend: Refresh the webpage" })) }
        const result = await def.myUtilize(projID, uid);

        const json2csv = new csvcreator.Parser();
        const csv = json2csv.parse(result);//create a new csv file
        return res.send(JSON.stringify(csv)); // send CSV data after converting the JSON

    } catch (e) {
        console.log(e);
    }
}
/**
 * creating the search task using the task name or id
 */
async function searchTask(req, res, uid) {
    try {
        const taskNameID = req.body.taskNameID;
        const validateTaskNameIDSchema = joi.object({ taskNameID: joi.string().min(1).required() });
        const _resultValidate = await validateTaskNameIDSchema.validate({ taskNameID: taskNameID });
        //check taskname or id is valid
        if (_resultValidate.error) { return (res.status(201).send({ status: 0, msg: "Task name or ID is not valid. Please check" })) }
        //if correct call to task search 
        const result = await def.searchTask(taskNameID, uid);

        return (res.status(200).send(result));
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the searchTask function in profile.js file.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Task search process has terminated. Please try again" }));
    }
}
/**
 * handle the new task adding process
 * get email password project ID and other task details
 */
router.post('/project/addTask', (req, res) => {
    //credential check
    accountCheck.checkIt(req.body.email, req.body.password)
        .then(result => {
            if (!result) { res.status(201).send({ status: 0, msg: "Error credential. In profile/projects/getTask" }); return; }
            //do this code block if the credentials are correct
            accountCheck.getIt(req.body.email, req.body.password)
                .then(result => {
                    if (!result) { res.status(201).send({ status: 0, msg: "Error credential check step 2. In profile/projects/getTask" }); return; }
                    addNewTask(req, res, req.body.projID, (result[0]._id).toString());
                });
        });
});

// get the new task details and add to the tasklist
async function addNewTask(req, res, prjID, uid) {
    try {
        const prjIDSchema = joi.object({
            id: joi.string().alphanum().min(24).max(24).required(),
        });
        //check projectID is correct
        const _prjValidate = await prjIDSchema.validate({ id: prjID });
        if (_prjValidate.error) { return (res.status(201).send({ status: 0, msg: "Bad project ID." })) }
        const taskName = (req.body.taskName).trim();
        const method = (req.body.method).trim();
        const taskData = (req.body.task_data).trim();
        const targetDevice = (req.body.target_device).trim();

        const taskDataSchema = joi.object({
            taskName: joi.string().pattern(new RegExp('^[a-zA-Z]+[a-zA-Z0-9-_ ]*[a-zA-Z0-9]$')).min(2).max(20).required(),
            method: joi.number().min(0).max(2).required(),
            taskData: joi.string().min(1).required(),
        });
        //validating the task data 
        const _validateTaskData = await taskDataSchema.validate({ taskName: taskName, method: method, taskData: taskData });

        if (_validateTaskData.error) { return (res.status(200).send({ status: 0, msg: "Provided task details are invalid please check" })) }
        //check all request field have data
        if (method == "2" || method == 2) {
            let deviceList = targetDevice.split(",");
            const _targetDeviceSchema = joi.object({
                targetDevice: joi.string().alphanum().min(24).max(24).required(),
            });
            for await (let deviceId of deviceList) {
                const _validateDeviceID = await _targetDeviceSchema.validate({ targetDevice: deviceId });
                //validate the device ID and is there an error send this error message

                if (_validateDeviceID.error) { return (res.status(200).send({ status: 0, msg: "New task device ID is invalid" })) }
            }
        }
        //check the project is owning by the user
        const checkProjectValidity = await def.testUserOwningProject(uid, prjID);
        if (!checkProjectValidity) { return (res.start(200).send({ status: 0, msg: "User does not have permission to add a task to this project. " })) }

        //send data to the add new task function in function.js and waiting for the response
        const result = await def.addNewTask(prjID, taskName, method, taskData, targetDevice, uid);

        elogger.userLogger({ userEmail: req.body.email, notification: "User Created new Task", date: new Date( Date.now()), data:{ip:req.ip, detail:result}});

        return (res.status(201).send(result));

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the addNewTask function in profile.js file.",
            time: new Date(Date.now()),
            error: e.message
        });
        return (res.status(200).send({ status: 0, msg: "Task adding process error please try again" }));
    }
}

//get the specific project all task data to csv and download it
async function getAllTask(req, res, prjID, uid) {
    try {
        const prjIDSchema = joi.object({
            id: joi.string().alphanum().min(24).max(24).required(),
        });
        //check projectID is correct
        const _prjValidate = await prjIDSchema.validate({ id: prjID });
        //if id is invalid
        if (_prjValidate.error) { return (res.status(400).send({ status: 0, msg: "Bad project ID" })) }
        _result = await def.getAllTask(prjID, uid);

        if (_result.length <= 0) {
            return (res.send({ status: 0, msg: "No tasks to download" }));
        }
        //creating csv file
        //fields of the data 
        const json2csv = new csvcreator.Parser();
        const csv = json2csv.parse(_result);//create a new csv file

        elogger.userLogger({ userEmail: req.body.email, notification: "User generated report", date: new Date( Date.now()), data:{ip:req.ip, projectID:prjID}});

        return res.send(JSON.stringify(csv)); // send CSV data after converting the JSON

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getAllTask function in the profile.js server side.",
            time: new Date(Date.now()),
            error: e.message
        });

    }
}

//get specific project data
async function getProject(req, res, projID) {
    try {
        const idSchema = joi.object({
            id: joi.string()
                .alphanum()
                .min(24)
                .max(24)
                .required(),
        });
        //check the ID is valid
        const _idcheck = await idSchema.validate({ id: projID });
        //if id not valid send the rrir
        if (_idcheck.error) { return (res.status(201).send({ status: 0, msg: "Project id is invalid" })) }
        //get user ID
        const _userID = await accountCheck.getIt(req.body.email, req.body.password);
        //check the id and get the result
        const result = await def.getProject(projID, (_userID[0]._id).toString());

        elogger.userLogger({ userEmail: req.body.email, notification: "User viewed Project", date: new Date( Date.now()), data:{ip:req.ip, projectID:projID}});
        res.status(201).send(result);
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getProject function.",
            time: new Date(Date.now()),
            error: e.message
        });
        res.status(201).send({ status: 0, msg: "Server busy please try again shortly" });
    }
}

//get alldata
async function start(req, res, profile) {
    try {
        let result; // this variable store the all data in initiate state
        //check credentials
        const credentialCheck =await accountCheck.checkIt(req.body.email, req.body.password);
        //check if there are not valid account
        if (!credentialCheck) return (res.status(201).send({ status: 0 }));
        //get all project results
        const projectResult = await def.getMyProjects((profile._id).toString());
        //get contributed projects details
        const contributeResult = await def.getContributed((profile._id).toString());
        //get my device list
        const devices = await def.getMyDevices((profile._id).toString());
        //get profile data
        const _profile = await def.getProfile((profile._id).toString());
        //get all processors
        const _processorList = await def.allProcessors();

        //set all data to the result variable
        result = ({ "projectResult": projectResult, "contributeResult": contributeResult, "devicesResult": devices, "profileResult": _profile, "processors": _processorList });
        
        if ("status" in result.devicesResult || "status" in result.projectResult || "status" in result.contributeResult || "status" in result.profileResult) 
        { return ({ status: 0 }) }
        //send the result to user
        res.status(201).send(result);
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getProfile function.",
            time: new Date(Date.now()),
            error: e.message
        });
    }
}

module.exports = router;