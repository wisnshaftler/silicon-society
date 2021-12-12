const db = require("./dbConnection").useDB;
const mongoDB = require("mongodb").ObjectID;
const elogger = require("./logger");
const crypto = require("crypto");

async function getMyProjects(id) {
    try {
        
        //get the all projects
        const result = await db().collection('project').find({ "createdBy": id }).toArray();
        
        //send 0 if projects are not have
        if (result.length == 0) {
            return ({ nos_project: 0 });
        }
        // send all projects
        if (result.length >= 1) {
            return ({ nos_project: result.length, projects: result });
        }
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getMyProject function.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error in getting my projects" });
    }
}

async function allProcessors() {
    try {
        const result = await db().collection('processor').find().sort({ "benchmark score": -1 }).toArray();
        return (result);
    } catch (e) {
        return ([]);
    }
}

/**
 * Search processor names send processor name
 */
async function searchProcessor(selectedProcessor) {
    try {
        const result = await db().collection("processor").find({ _id: mongoDB.ObjectID(selectedProcessor) }).toArray()
        return (result);
    } catch (e) {
        return ([]);
    }
}
/**
 * add project details
 * @param {String} os 
 * @param {String} projectName 
 * @param {Number} deviceCount 
 * @param {String} rewarded 
 * @param {String} processor 
 * @param {Number} ram 
 * @param {String} separateTask 
 * @param {String} projectDescription 
 * @param {String} userID
 */
async function createNewProject(os, projectName, deviceCount, rewarded, processor, ram, separateTask, projectDescription, userID, image) {
    try {
        let newProjetDetails = {
            name: projectName,
            createdBy: userID,
            needDeviceCount: parseInt(deviceCount),
            rewarded: rewarded,
            leastCPU: processor,
            leastRAM: parseInt(ram),
            approved: false,
            status: "pending",
            os: os,
            approvedBy: "",
            separateTask: separateTask,
            softwareID: "",
            description: projectDescription,
            notice: "",
            img: "img/" + image,
            devices: [],
            time: new Date(Date.now())
        }
        const result = await db().collection("project").insertOne(newProjetDetails);
        return ({ status: 1, msg: { projectID: result.insertedId } });

    } catch (e) {
        return ({ status: 0, msg: "Error. Please try again shortly." })
    }
}

async function getContributed(id) {
    try {
        let _projects = []; // to store the contributed projects data
        //get all contributed
        const _contributed = await db().collection('contributed').find({ userID: id }).sort({ _id: -1 }).toArray();
        if (_contributed.length == 0) { return ({ nos_contribute: 0 }) }
        //send the contributed projects
        for (const _contri of _contributed) {
            const _projData = await db().collection('project').find({ _id: mongoDB.ObjectID(_contri.projectID) }).toArray();
            _projData[0]['deviceID'] = _contri.deviceID;
            _projects.push(_projData[0]);
        }
        return ({ nos_contribute: _projects.length, contribute: _projects });
        //
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getContributed function.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "error in get contibutions " });
    }
}
async function getMyDevices(id) {
    try {
        const _devices = await db().collection('devices').find({ userID: id }).toArray(); // get all devices
        //check device count
        if (_devices.length == 0) return ({ nos_devices: 0 });
        return ({ nos_devices: _devices.length, devices: _devices });
    }
    catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getMyDevices function.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "error in getting my devices" });
    }
}
async function getProfile(id) {
    try {
        const _profile = await db().collection('user').find({ _id: mongoDB.ObjectID(id) }).toArray(); //get profile ID
        //check device count
        if (_profile.length == 0) return ({ status: 0, msg: "Error in getting profile details" });
        return ({ profile: _profile[0] });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getProfile function.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0 });
    }
}

async function getProject(id, uid) {
    
    try {
        let _projectDetails = await db().collection('project').find({ "_id": mongoDB.ObjectID(id), createdBy: uid }).toArray();//get project Data
        const _taskDetails = await db().collection('task').find({ "project_id": id }).sort({ _id: -1 }).limit(15).toArray(); //get project's tasks
        const _taskCount = await db().collection('task').find({ "project_id": id }).toArray(); //get all task 

        if (_projectDetails.length == 0) { return ({ "projectDetails": "0" }) };// if there are no projects return 0 or send incorrect or not autherized project ID

        //get the processor 
        const processorType = await db().collection("processor").find({ "_id": mongoDB.ObjectID(_projectDetails[0].leastCPU) }, { projection: { _id: 0, Processor: 1 } }).toArray();
        //add processor name to sending project details object
        _projectDetails[0].leastCPU = processorType[0].Processor;
        //send the result
        return ({ "projectDetails": _projectDetails, "taskCount": _taskCount.length, "taskDetails": _taskDetails });

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getProject function.",
            time: new Date(Date.now()),
            error: [e.message, e]
        });
        return ({ status: 0, msg: "Error in get Project " });
    }
}

/**
 * 
 * @param {} projID this get project id
 * @param {} uid    this get user id
 * 
 * This get the user id and project id , compare it with the utilizing collection and send the result
 */
async function myUtilize(projID, uid) {
    try {
        const result = await db().collection('utilizing').find({ projectID: projID, userID: uid }).sort({ _id: -1 }).toArray();
        if (result.length <= 0) { return ({ status: 0, msg: "There are no task contributed yet" }) }
        return (result);
    } catch (e) {
        console.log(e);
    }
}
 
/**
 * 
 * @param {String} projectID 
 * @param {Array} software 
 */
async function softwareUpload(projectID, software) {
    try {
        const result = await db().collection("project").updateOne({ _id: mongoDB.ObjectID(projectID) }, { $set: { softwareID: software } });
        if (result.modifiedCount == 1) {
            return ({ status: 1, msg: "Successfully update" })
        }
        return ({ status: 0, msg: "Error please try again later" });
    } catch (e) {
        return ({ status: 0, msg: "Please try again later" });
    }
}
//update password 
async function updatePassword(uid, newPassword) {
    try {
        const result = await db().collection('user').updateOne({ _id: mongoDB.ObjectID(uid) }, { $set: { password: newPassword } });
        if (result.modifiedCount == 1) {
            return ({ status: 1, msg: "Successfuly changed the password. Please log again to continue" });
        }
        return ({ status: 0, msg: "Error please try again late. If error occures continuesly, Please contact admin" })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the updatePassword function in function.js .",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error please try again late. If error occures continuesly, Please contact admin" })
    }
}

/**
 * Check user own the project
 * @param {String} userID 
 * @param {String} projectID 
 */
async function isOwnerProject(userID, projectID) {
    const result = await db().collection("project").find({ _id: mongoDB.ObjectID(projectID), createdBy: userID, softwareID: "" }).toArray();
    return (result);
}

/**
 * This function change the project status to active and all related tasks status to done
 * @param {String} projectid project id in string
 * @param {String} userID User ID in string
 */
async function completeProject(projectID, userID) {
    try {
        //check poroject is own by user
        const isOwner = await db().collection("project").find({ _id: mongoDB.ObjectID(projectID), createdBy: userID }).toArray();
        if (isOwner.length != 1) {
            return ({ status: 0, msg: "Project ownership cant verify. Please check project ID" });
        }
        //check project is active state
        const isActive = await db().collection("project").find({ _id: mongoDB.ObjectID(projectID), createdBy: userID, status: "active" }).toArray();
        if (isActive.length != 1) {
            return ({ status: 0, msg: "Project is not active" });
        }
        //update project status
        const updateProjectStatus = await db().collection("project").updateOne({ _id: mongoDB.ObjectID(projectID), createdBy: userID }, { $set: { status: "complete" } });
        if (updateProjectStatus.modifiedCount == 0) {
            return ({ status: 0, msg: "Cant update project. Please try again later. If error repeat. Please contact admins" });
        }

        //update all running tasks
        const completeAllTask = await db().collection("task").updateMany({ project_id: projectID, status: new RegExp('(added|attend)', 'g') }, { $set: { status: "complete" } });

        return ({ status: 1, msg: "Done!!!" })
    } catch (e) {
        return ({ status: 0, msg: "Project Id is incorrect please try again" })
    }
}
/**
 * 
 * @param {String} deviceID Device ID 
 * @param {String} status 'active' or 'inactive'
 * @param {string} uid user ID
 */
async function updateDevice(deviceID, status, uid) {
    try {
        const result = await db().collection('devices').updateOne({ _id: mongoDB.ObjectID(deviceID), userID: uid }, { $set: { deviceStatus: status } });
        if (result.result.n == 0) {
            return ({ status: 0, msg: "Device status update is unsuccessfull. You may entered invalid device id or you havent access to update this device status" });
        }
        return ({ status: 1, msg: "Successfully updated device status" });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the updateDevice function in function.js .",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error in device update. Please try again later. " });
    }
}
/**
 * This function get the all task information and add to the task collection
 * this function receive project ID, task name method task data and the tager device id(if available)
 */
async function addNewTask(projID, taskName, method, taskData, targetDevice, uid) {
    try {
        let newTask = {
            project_id: projID, name: taskName, method: method, data: taskData, status: "added", finishedby: "", result: "",
            targetDevice: targetDevice, createdBy: uid, addedTime: new Date(Date.now())
        }
        if (targetDevice == "") {
            newTask.targetDevice = "";
        }
        // insert data to the task collection
        result = await db().collection('task').insertOne(newTask);
        return ({ status: 1, msg: "Successfully task added. Task ID :" + result.ops[0]._id });

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the addNewTask function.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error in get Project " });
    }
}

/**
 * This function get the taskID or task name with the user ID comparing the user ID it send task details
 */
async function searchTask(taskNameID, uid) {
    try {
        //select * task using task name or ID search with userID
        let result = await db().collection('task').find({ name: new RegExp(taskNameID, 'g'), createdBy: uid }).toArray();
        if (result.length >= 1) { return ({ status: 1, result: result }); }
        if (result.length <= 0 && taskNameID.length == 24) {
            result = await db().collection('task').find({ _id: mongoDB.ObjectID(taskNameID), createdBy: uid }).toArray();
            if (result.length <= 0) {
                return ({ status: 0, msg: "There are no task matching to this name or id pattern" });
            } else {
                return ({ status: 1, result: result });
            }
        } else {
            return ({ status: 0, msg: "There are no task matching to this name or id pattern" });
        }
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the searchTask function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error occures. Its reccomend to refresh the web page. After that error not solved, please contact Admins" });
    }
}

/**
 * Get the task id with the status and update in the daabase
 */
async function updateTask(taskID, status, name, uid) {
    try {
        const _taskValidation = await db().collection('task').find({ createdBy: uid, _id: mongoDB.ObjectID(taskID), status: new RegExp('(added|suspend|attend)', 'g') }).toArray();
        if (_taskValidation.length <= 0) { return ({ status: 0, msg: "You dont have permission to update this task" }) }
        if (status == "added") {
            const result = await db().collection('task').updateOne({ _id: mongoDB.ObjectID(taskID) }, { $set: { name: name } });
            if (result.error) {
                elogger.errorLogger({
                    data: "Error occures in the updateTask after trying to update the values function in function js.",
                    time: new Date(Date.now()),
                    error: { passedData: [taskID, status, name, uid], error: e }
                });
                return ({ status: 0, msg: "Sorry cant process this request in this movement. Please try again shortly. Make sure you entered details are correct" });
            }
            return ({ status: 1, msg: "successfully updated." });
        }
        if (status == "suspend") {
            const result = await db().collection('task').updateOne({ _id: mongoDB.ObjectID(taskID) }, { $set: { status: "suspend" } });
            if (result.error) {
                elogger.errorLogger({
                    data: "Error occures in the updateTask after trying to update the values function in function js.",
                    time: new Date(Date.now()),
                    error: { passedData: [taskID, status, name, uid], error: e }
                });
                return ({ status: 0, msg: "Sorry cant process this request in this movement. Please try again shortly. Make sure you entered details are correct" });
            }
            return ({ status: 1, msg: "successfully updated." });
        }
    } catch (e) {
        console.log(e);
    }
}
/**
 * Get the prgect id and search the task and send
 */
async function getAllTask(prjid, uid) {
    try {
        const _projectValidation = await db().collection('project').find({ createdBy: uid, _id: mongoDB.ObjectID(prjid) }, { projection: { "_id": 1 } }).toArray();
        // return error if user doesnt have 
        if (_projectValidation.length != 1) return { status: 0, msg: "Project ID invalid or you have permission to view it." };
        const _getAllTaks = await db().collection('task').find({ project_id: prjid }).toArray();

        return _getAllTaks;

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the getAllTask function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error in getAllTask" });
    }
}
//check the given user owning the project
async function testUserOwningProject(uid, prjID) {
    const result = await db().collection('project').find({ _id: mongoDB.ObjectID(prjID), createdBy: uid }).toArray();
    /***
     * check the return array length 
     * if the length equal = 0 it menas the user is not the creator
     * if the length equal to the 1 it means the user is the creator
     */
    if (result.length == 0) {
        return (false);
    }
    if (result.length == 1) {
        return (true);
    }

}

/**
 * This is initiate state of the admin panel loading
 */
async function initiateStage() {
    try {
        //project overrole view
        const totalPrj = await db().collection('project').countDocuments({});
        const totalPendingPrj = await db().collection('project').countDocuments({ status: "pending" });
        const totalCompletePrj = await db().collection('project').countDocuments({ status: "complete" });
        const totalActivePrj = await db().collection('project').countDocuments({ status: "active" });
        const totalSuspendedPrj = await db().collection('project').countDocuments({ status: "suspend" });
        const actualPendingProject = await db().collection('project').countDocuments({ softwareID: { $ne: "" }, status: "pending" });

        //task overrole view
        const totalTask = await db().collection('task').countDocuments({});
        const totalActiveTask = await db().collection('task').countDocuments({ status: "suspend" });
        const totalAddedTask = await db().collection('task').countDocuments({ status: "added" });
        const totalCompleteTask = await db().collection('task').countDocuments({ status: "complete" });
        const totalSuspendedTask = await db().collection('task').countDocuments({ status: "suspend" })

        //devices overrole view
        const totalDevices = await db().collection('devices').countDocuments({});
        const totalActiveDevices = await db().collection('devices').countDocuments({ deviceStatus: "active" });
        const totalInactiveDevices = await db().collection('devices').countDocuments({ deviceStatus: "inactive" });

        //device by os
        const totalWindows = await db().collection('devices').countDocuments({ deviceOS: new RegExp('(windows)', 'g') });
        const totalLinux = await db().collection('devices').countDocuments({ deviceOS: new RegExp('(linux)', 'g') });

        //acounts overview
        const totalAccounts = await db().collection('user').countDocuments({});
        const totalActiveAccounts = await db().collection('user').countDocuments({ status: "active" });
        const totalDeactivateAccounts = await db().collection('user').countDocuments({ status: "deactivate" })
        const totalSuspendedAccounts = await db().collection('user').countDocuments({ status: "suspend" })

        const result = {
            status: 1,
            totalPrj: totalPrj,
            totalPendingPrj: totalPendingPrj,
            totalCompletePrj: totalCompletePrj,
            totalActivePrj: totalActivePrj,
            totalSuspendedPrj: totalSuspendedPrj,
            actualPendingProject: actualPendingProject,
            totalTask: totalTask,
            totalActiveTask: totalActiveTask,
            totalAddedTask: totalAddedTask,
            totalCompleteTask: totalCompleteTask,
            totalSuspendedTask: totalSuspendedTask,
            totalDevices: totalDevices,
            totalActiveDevices: totalActiveDevices,
            totalInactiveDevices: totalInactiveDevices,
            totalWindows: totalWindows,
            totalLinux: totalLinux,
            totalAccounts: totalAccounts,
            totalActiveAccounts: totalActiveAccounts,
            totalDeactivateAccounts: totalDeactivateAccounts,
            totalSuspendedAccounts: totalSuspendedAccounts
        }
        return (result);
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the initiateStage function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Something went wrong. Please try again" });
    }
}

//this function get the all pending projects and send to client
async function allPendingProjects() {
    try {
        const result = await db().collection('project').find({ softwareID: { $ne: "" }, status: "pending" }, { projection: { _id: 1, name: 1, time: 1 } }).toArray();
        return ({ status: 1, pendingProjects: result });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the pendingProjectApproval function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Something went wrong. Please try again" });
    }
}

/**
 * 
 * @param {String} searchString Value of the search must be alphanumaric
 * @param {String} property property of the project (projectid, name, not based ''wha )
 * @param {String} status status of project (pending, active, complete, suspend, for all set '')
 * @param {String} userID if project get based on user (userid, if not '')
 * @returns Object that contains data of the project and status code
 */
async function adminGetProject(searchString, property, status, userID) {
    try {
        let data;
        if (property == "name") {
            data = await db().collection('project').find({ status: new RegExp(status, 'g'), createdBy: new RegExp(userID, 'g'), name: new RegExp(searchString, 'g') }).toArray()
        }
        if (property == "projectid") {
            data = await db().collection('project').find({ status: new RegExp(status, 'g'), createdBy: new RegExp(userID, 'g'), _id: mongoDB.ObjectID(searchString) }).toArray()
        }
        return ({ status: 1, data: data })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminGetProject function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Something went wrong. Please try again" });
    }
}

/**
 * This function returns of the task data based on the given parameters
 * @param {String} searchString value of the search must be alphanumaric. if need all make it blank
 * @param {String} property propert of the task (taskid, taskname if not '')
 * @param {String} status status of the task (added, suspend, attend, complete, if not based '' )
 * @param {String} userID task created user id must be alphanumaric
 * @param {String} projectID the project task is own
 * @param {number} limit limit the output array length. 0 for no limit
 * @param {number} sortByTime sort the result ascending and descending based on created time default is descending
 */
async function adminGetTask(searchString, property, status, userID, projectID, limit = 0, sortByTime = -1) {
    try {
        let data;//JSON object that store the data
        if (property == "taskid") {
            data = await db().collection('task').find({
                _id: mongoDB.ObjectID(searchString), status: new RegExp(status, 'g'), createdBy: new RegExp(userID, 'g')
                , project_id: new RegExp(projectID, 'g')
            }).limit(limit).toArray();
            return (data)
        }
        if (searchString == "") {
            data = await db().collection('task').find({
                status: new RegExp(status, 'g'), createdBy: new RegExp(userID, 'g'),
                project_id: new RegExp(projectID, 'g')
            }).limit(limit).sort({ addedTime: sortByTime }).toArray();

            return (data);
        }
        if (property == "taskname") {
            data = await db().collection('task').find({
                name: new RegExp(searchString, 'g'), status: new RegExp(status, 'g'), createdBy: new RegExp(userID, 'g')
                , project_id: new RegExp(projectID, 'g')
            }).limit(limit).toArray();
            return (data)
        }

    } catch (e) {
        console.log(e.message);
    }
}
/**
 * this fuction approve the pending projects
 * @param {String} projectID pending project ID
 */
async function approveProject(projectID, adminID) {
    try {
        const result = await db().collection('project').updateOne({ _id: mongoDB.ObjectID(projectID), status: "pending" },
            { $set: { status: "active", approved: true, approvedBy: adminID.toString() } });
        if (result.modifiedCount == 1) {
            return ({ status: 1, msg: "Successfully approved" })
        }
        return ({ status: 0, msg: "Error please try again later" });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the approveProject function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Something went wrong. Please try again" });
    }
}

/**
 * this function is suspend the given project
 * @param {String} projectID project id that needs to suspend
 * @param {String} reason reason of why project suspend
 */
async function suspendProject(projectID, reason) {
    try {
        const projectDeactivate = await db().collection('project').updateOne({ _id: mongoDB.ObjectID(projectID), status: new RegExp('(pending|active)', 'g') }, { $set: { status: "suspend", notice: reason } });
        if (projectDeactivate.modifiedCount == 1) {
            //remove all pending tasks
            const taskDeactivate = await db().collection('task').updateMany({ project_id: projectID, status: new RegExp('(added|attend)', 'g') }, { $set: { status: "suspend" } });
        } else {
            return ({ status: 0, msg: "Theare is an error please try again" });
        }
        //complete suspended then return the success msg
        return ({ status: 1, msg: "Completely suspended" });

    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the suspendProject function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Something went wrong. Please try again" });
    }
}
/**
 * 
 * @param {String} projectID projectID of the task detail required
 * @param {String} taskStatus status of the task (added, suspend, attend, complete, if not based '' )
 * @returns {Array} object array of result
 */
async function projectTaskBasic(projectID, taskStatus = '') {
    return (await db().collection('task').find({ project_id: projectID, status: new RegExp(taskStatus, 'g') }, { projection: { _id: 1, name: 1 } }).toArray());
}

/**
 * 
 * @param {String} searchString search string of the task
 * @returns Object Array contains project id and name
 */
async function adminGetTaskByName(searchString) {
    return (await db().collection('task').find({ name: new RegExp(searchString, 'g'), status: new RegExp('', 'g') }, { projection: { _id: 1, name: 1 } }).toArray());
}

/**
 * This function return the object array that include the given project all task details
 * @param {String} projectID ProjectID thats needs to download the project 
 */
async function adminGetAllTask(projectID) {
    return (await db().collection('task').find({ project_id: projectID }).toArray());
}

/**
 * This function will return the Object with given device details and that device contributed projects
 * @param {String} deviceID device id
 * @returns object
 */
async function adminDevice(deviceID) {
    try {
        const deviceResult = await db().collection('devices').find({ _id: mongoDB.ObjectID(deviceID) }).toArray();
        if (deviceResult.length != 1) {
            return ({ status: 0, msg: "No device found." });
        }
        const projectResult = await db().collection('project').find({ devices: new RegExp(deviceID, 'g') }, { projection: { _id: 1, name: 1 } }).toArray()

        return ({ status: 1, data: { deviceResult: deviceResult, projectResult: projectResult } })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminDevice function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "There are some error. Please try again later." });
    }
}

/**
 * THis function return the devices in the object that owns by given userID
 * @param {String} userID UserID that needs to get devices
 * @returns Object of results
 */
async function adminGetDevice(userID) {
    try {
        const result = await db().collection('devices').find({ userID: userID }).toArray();
        if (result.length == 0) {
            result({ status: 0, msg: "No devices found by this ID" });
        }
        return ({ status: 1, data: result });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminGetDevice function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "There are some error. Please try again later." });
    }
}

/**
 * This function set inactive mode given device
 * @param {String} deviceID Device ID that needs to set inactive mode
 * @returns Object
 */
async function admindeactivateDevice(deviceID) {
    try {
        const deactivate = await db().collection('devices').updateOne({ _id: mongoDB.ObjectID(deviceID) }, { $set: { deviceStatus: "inactive" } })
        if (deactivate.modifiedCount == 1) {
            return ({ status: 1, msg: "Successfully Deactivated" });
        }
        return ({ status: 0, msg: "Device ID is incorrect. Please check and try again" })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the admindeactivateDevice function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "There are some error. Please try again later." });
    }
}

/**
 * This function return object that contains device details and contributed project details
 * @param {String} uuid Device UUID
 * @returns Object
 */
async function adminDeviceByUUID(uuid) {
    try {
        const deviceResult = await db().collection('devices').find({ UUID: uuid }).toArray();
        if (deviceResult.length != 1) {
            return ({ status: 0, msg: "No device found." });
        }
        const projectResult = await db().collection('project').find({ devices: new RegExp(deviceResult[0]._id, 'g') }, { projection: { _id: 1, name: 1 } }).toArray()

        return ({ status: 1, data: { deviceResult: deviceResult, projectResult: projectResult } })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminDeviceByUUID function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "There are some error. Please try again later." });
    }
}

/**
 * This function will send the object of all data of the given user 
 * @param {String} searchString String of the search item
 * @param {String} containString String of the search method - email or userid
 * @returns Object
 */
async function adminGetUser(searchString, containString) {
    try {
        let userProfile = "";
        if (containString == "email") {
            userProfile = await db().collection('user').find({ email: searchString }).toArray();
            if (userProfile.length == 0) { return ({ status: 0, msg: "No user account found" }) }
        }
        if (containString == "userid") {
            userProfile = await db().collection('user').find({ _id: mongoDB.ObjectID(searchString) }).toArray();
            if (userProfile.length == 0) { return ({ status: 0, msg: "No user account found" }) }
        }
        const userID = userProfile[0]._id.toString()
        const userDevices = await db().collection('devices').find({ userID: userID }, { projection: { _id: 1, deviceName: 1, deviceOS: 1, deviceStatus: 1 } }).toArray();
        const userProjects = await db().collection('project').find({ createdBy: userID }, { projection: { _id: 1, name: 1, description: 1, status: 1 } }).toArray();
        const userContributed = await db().collection('contributed').find({ userID: userID }, { projection: { projectID: 1, joinDate: 1 } }).toArray();

        return ({ status: 1, data: { userProfile: userProfile, userDevices: userDevices, userProjects: userProjects, userContributed: userContributed } })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminGetUser function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error. Please try again" })
    }
}
/**
 * This function will suspend the given user 
 * @param {String} userID User id that needs to suspend
 * @returns Object
 */
async function adminSuspendUser(userID) {
    try {
        const alreadySuspend = await db().collection('user').find({ _id: mongoDB.ObjectID(userID), status: "suspend" }).toArray();
        if (alreadySuspend.length > 0) { return ({ status: 0, msg: "This user already suspended" }) }
        const suspendAccount = await db().collection('user').updateOne({ _id: mongoDB.ObjectID(userID) }, { $set: { status: "suspend" } })
        if (suspendAccount.modifiedCount != 1) { return ({ status: 0, msg: "No accoutn found" }) }//if there are no account
        const suspendProject = await db().collection('project').updateMany({ createdBy: userID, status: new RegExp('(active|pending)', 'g') }, { $set: { status: "suspend" } });
        const suspendTask = await db().collection('task').updateMany({ createdBy: userID, status: new RegExp('(added|attend)', 'g') }, { $set: { status: "suspend" } });
        const deactivateDevices = await db().collection('devices').updateMany({ userID: userID, deviceStatus: "active" }, { $set: { deviceStatus: "inactive" } })
        const getDeviceList = await db().collection('devices').find({ userID: userID }, { projection: { _id: 1 } }).toArray();
        let deviceList = '';
        //this run if user have devices
        if (getDeviceList.length > 0) {
            getDeviceList.forEach(value => {
                deviceList += (value._id.toString()) + "|";
            });
            deviceList = deviceList.substring(0, deviceList.length - 1);

            const contributedRemove = await db().collection('project').updateMany({ devices: new RegExp(deviceList, 'g') }, { $pull: { devices: new RegExp(deviceList, 'g') } });
        }
        const leftContributions = await db().collection('contributed').updateMany({ userID: userID }, { $set: { leftDate: new Date(Date.now()) } });
        return ({ status: 1, msg: "Successfully suspended" })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSuspendUser function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error. Please try again" })
    }
}
/**
 * This function will return the Object that contains the given admin data
 * @param {String} searchString this search string contains email or admin id
 * @param {String} containString This carry the method adminemail or adminid
 * @returns Object
 */
async function adminSearch(searchString, containString) {
    try {
        let adminProfile = "";
        if (containString == "adminemail") {
            adminProfile = await db().collection('admin').find({ email: searchString }, { projection: { _id: 1, email: 1, status: 1, role: 1, createdDate: 1, createdBy: 1, username: 1 } }).toArray();
            if (adminProfile.length == 0) { return ({ status: 0, msg: "No user account found" }) }
        }
        if (containString == "adminid") {
            adminProfile = await db().collection('admin').find({ _id: mongoDB.ObjectID(searchString) }, { projection: { _id: 1, email: 1, status: 1, role: 1, createdDate: 1, createdBy: 1, username: 1 } }).toArray();
            if (adminProfile.length == 0) { return ({ status: 0, msg: "No user account found" }) }
        }
        return ({ status: 1, data: adminProfile })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSearch function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error. Please try again" })
    }
}

/**
 * This function will suspend the given admin
 * @param {String} userID Admin user ID
 * @returns Object
 */
async function adminSuspendAdmin(userID) {
    try {
        const result = await db().collection('admin').updateOne({ _id: mongoDB.ObjectID(userID) }, { $set: { status: "suspend" } });
        if (result.modifiedCount == 1) { return ({ status: 1, msg: "Done" }) }
        return ({ status: 0, msg: "No account found" })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSuspendAdmin function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error. Please try again" })
    }
}

/**
 * This function will create admin account
 * @param {String} newAdminEmail New Admin Email
 * @param {String} newAdminPassword New admin password
 * @param {String} newAdminRole New admin Role (admin or moderator)
 * @param {String} newAdminUsername New admin Username
 * @param {String} myID Account creators ID
 * @returns Object
 */
async function newAdmin(newAdminEmail, newAdminPassword, newAdminRole, newAdminUsername, myID) {
    try {
        const passwordHash = crypto.createHmac('sha256', newAdminPassword).digest('hex');
        const newAdminData = {
            email: newAdminEmail, password: passwordHash,
            status: "active", role: newAdminRole, createdBy: myID,
            username: newAdminUsername, createdDate: new Date(Date.now())
        }
        const availableCheck = await db().collection('admin').find({ $or: [{ email: newAdminEmail }, { username: newAdminUsername }] }).toArray();
        if (availableCheck.length != 0) { return ({ status: 0, msg: "This email or username exists" }) }

        const result = await db().collection("admin").insertOne(newAdminData);
        if (result.insertedCount == 1) { return ({ status: 1, msg: "Account creation is successfull" }) }
        return ({ status: 0, msg: "Error occures while creating account. Please try again" });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the newAdmin function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error. Please try again" })
    }
}
/**
 * This if function for reset Admin account password
 * @param {String} adminID This is ID that needs to change te password
 * @param {String} newPassword contains the new Password. for default password needs to send ''
 * @returns Object
 */
async function adminResetPassword(adminID, newPassword) {
    try {
        let passwordHash
        if (newPassword == "") { passwordHash = crypto.createHmac('sha256', "Slicon@123").digest('hex'); }
        if (newPassword != "") { passwordHash = crypto.createHmac('sha256', newPassword).digest('hex'); }

        const result = await db().collection('admin').updateOne({ _id: mongoDB.ObjectID(adminID) }, { $set: { password: passwordHash } })
        if (result.modifiedCount == 1) { return ({ status: 1, msg: "Done resetting password." }) }
        return ({ status: 0, msg: "There is some error. Please try again " });
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminResetPassword function in function js.",
            time: new Date(Date.now()),
            error: e.message
        });
        return ({ status: 0, msg: "Error. Please try again" })
    }
}
module.exports = {
    getMyProjects, getContributed, getMyDevices, getProfile, getProject, getAllTask, addNewTask, testUserOwningProject, searchTask, updateTask, myUtilize,
    updateDevice, allProcessors, searchProcessor, createNewProject, isOwnerProject, softwareUpload, completeProject, updatePassword, initiateStage, allPendingProjects,
    adminGetProject, approveProject, adminGetTask, suspendProject, projectTaskBasic, adminGetAllTask, adminDevice, adminGetDevice, admindeactivateDevice, adminDeviceByUUID,
    adminGetUser, adminSuspendUser, adminSearch, adminSuspendAdmin, newAdmin, adminResetPassword
}