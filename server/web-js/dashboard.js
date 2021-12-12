$('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
$("#overview").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });

let email = '';
let password = '';

//device detection
function deviceType() {
    var OSName = "Mobile";
    if (navigator.appVersion.indexOf("Win") != -1 && navigator.appVersion.indexOf("Phone") === -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Macintosh") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1 && navigator.appVersion.indexOf("Android") === -1) OSName = "Linux";
    if (navigator.appVersion.indexOf("facebook.com") != -1) OSName = "facebook";
    if (navigator.appVersion.indexOf("bot") != -1) OSName = "bot";
    if (navigator.appVersion.indexOf("Slerp") != -1) OSName = "bot";
    return OSName;
}

$(document).ready(() => {
    if (deviceType() == "Mobile") {
        alert("This website is stable working for desktop versions. Please consider about that.")
        $("#mainRow").removeClass("h-100")
    }

    email = Cookies.get('email');
    password = Cookies.get('password');

    $.ajax({
        type: "POST",
        url: "start/",
        data: JSON.stringify({ email: email, password: password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).then((result) => {
        if (result.status == 0) {
            alert(result.msg);
            window.location.replace("/admin/login")
        } else {
            //add admin username
            $("#admin-username").text(result.username)
            //add total project div to containter 
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(projectChart);
            google.charts.setOnLoadCallback(taskChart);
            google.charts.setOnLoadCallback(accountChart);
            google.charts.setOnLoadCallback(deviceChart);

            function projectChart() {
                const data = new google.visualization.arrayToDataTable([
                    ['Project Status', 'Value'],
                    ['Total Pending', result.totalPendingPrj],
                    ['Total Complete', result.totalCompletePrj],
                    ['Total Active', result.totalActivePrj],
                    ['Total Suspend', result.totalSuspendedPrj],

                ]);
                const options = {
                    titleTextStyle: {
                        color: "black",    // any HTML string color ('red', '#cc00cc')
                        fontName: "Open Sans", // i.e. 'Times New Roman'
                        fontSize: 23, // 12, 18 whatever you want (don't specify px)
                        bold: false,    // true or false
                        italic: false,   // true of false
                    },

                    title: 'Total number of projects ' + result.totalPrj,
                    is3D: true,

                };

                let chart = new google.visualization.PieChart(document.getElementById('totalProject'));
                chart.draw(data, options);
            }

            function taskChart() {
                const data = new google.visualization.arrayToDataTable([
                    ['Task Status', 'Value'],
                    ['Total Active', result.totalActiveTask],
                    ['Total Added', result.totalAddedTask],
                    ['Total Suspended', result.totalSuspendedTask],
                    ['Total Complete', result.totalCompleteTask],

                ]);
                const options = {
                    titleTextStyle: {
                        color: "Gray",    // any HTML string color ('red', '#cc00cc')
                        fontName: "Open Sans", // i.e. 'Times New Roman'
                        fontSize: 24, // 12, 18 whatever you want (don't specify px)
                        bold: false,    // true or false
                        italic: false,   // true of false
                    },

                    title: 'Total number of tasks ' + result.totalTask,
                    pieHole: 0.4,

                };

                const chart = new google.visualization.PieChart(document.getElementById('totalTasks'));
                chart.draw(data, options);
            }

            function accountChart() {
                const data = new google.visualization.arrayToDataTable([
                    ['Accounts Status', 'Value'],
                    ['Total Active', result.totalActiveAccounts],
                    ['Total Deactivated', result.totalDeactivateAccounts],
                    ['Total Suspended', result.totalSuspendedAccounts]
                ]);
                const options = {
                    titleTextStyle: {
                        color: "Gray",    // any HTML string color ('red', '#cc00cc')
                        fontName: "Open Sans", // i.e. 'Times New Roman'
                        fontSize: 24, // 12, 18 whatever you want (don't specify px)
                        bold: false,    // true or false
                        italic: false,   // true of false
                    },

                    title: 'Total number of accounts ' + result.totalAccounts,
                };
                //loading initiate views
                const chart = new google.visualization.PieChart(document.getElementById('totalAccounts'));
                refreshPendingProjects();

                chart.draw(data, options);
            }

            function deviceChart() {
                const data = new google.visualization.arrayToDataTable([
                    ['Devices Status', 'Value'],
                    ['Total Active', result.totalActiveDevices],
                    ['Total Inactive', result.totalInactiveDevices],
                ]);
                const options = {
                    titleTextStyle: {
                        color: "Gray",    // any HTML string color ('red', '#cc00cc')
                        fontName: "Open Sans", // i.e. 'Times New Roman'
                        fontSize: 24, // 12, 18 whatever you want (don't specify px)
                        bold: false,    // true or false
                        italic: false,   // true of false
                    },

                    title: 'Total number of devices ' + result.totalDevices,
                };

                const chart = new google.visualization.PieChart(document.getElementById('totalDevices'));
                chart.draw(data, options);
            }

            //add total pending approval projects
            $("#showPendingProjects").text(result.actualPendingProject);

            console.log((result));
        }
    }).catch(e => {
        console.log(e)
    })

});

document.getElementById('totalProject').addEventListener("mouseover", () => {
    $('.toast').toast('show');
})

function overview() {
    $('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
    $("#overview").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });
}

//this activate pending approval management tab
function pendingApproval() {
    $('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
    $("#pendingApproval").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });

}
//this activate project management tab
function manageProjects() {
    $('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
    $("#manageProject").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });
}

//this activate manage device tab
function manageDevice() {
    $('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
    $("#manageDevices").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });
}

//this active manage user TAB
function manageUser() {
    $('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
    $("#userManage").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });
}

//this atve manage admn TAB
function manageAdmin() {
    $('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
    $("#superAdmin").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });
}

//this is view log TAB
function viewLog() {
    $('.commonHide').css({ 'display': 'none', "visibility": "hidden" });
    $("#viewLog").css({ 'visibility': 'visible', 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });

}

//this function call to server and get the pending approval projects 
function refreshPendingProjects() {
    $.ajax({
        type: "POST",
        url: "projects/pending",
        data: JSON.stringify({ email: email, password: password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).then((result) => {
        $("#allPendingTable").empty();
        if (result.pendingProjects.length == 0) {
            let elem = "<tr><td>" + "No" + "</td>" + "<td>" + "pending" + "</td>" +
                "<td>" + "projects" + "</td> </tr>";
            $("#allPendingTable").append(elem)
            $("#showPendingProjects").text("0");
            return;
        }
        for (const project of result.pendingProjects) {
            let elem = "<tr><td>" + project._id + "</td>" + "<td>" + project.name + "</td>" +
                "<td>" + new Date(project.time).toString() + "</td> </tr>";
            $("#allPendingTable").append(elem)
            $("#showPendingProjects").text(result.actualPendingProject);
        }

    });
}
//listining enter key press in the search change password in admin
$("#changeMyPasswordtxt").on('keypress', (e) => {
    if (e.key == "Enter") {
        changeMyPassword()
    }
})


//listining enter key press in the search reser password in admin
$("#resetPasswordtxt").on('keypress', (e) => {
    if (e.key == "Enter") {
        resetAdmin()
    }
})

//search user button click event
$("#resertPasswordbtn").click(() => {
    resetAdmin()
})

//listining enter key press in the search admin DI in manage admin
$("#searchAdmintxt").on('keypress', (e) => {
    if (e.key == "Enter") {
        adminManagement()
    }
})

//search user button click event
$("#searchAdminbtn").click(() => {
    adminManagement()
})

//listining enter key press in the search userid in manage user
$("#searchUsertxt").on('keypress', (e) => {
    if (e.key == "Enter") {
        userManagement()
    }
})

//search user button click event
$("#searchUserbtn").click(() => {
    userManagement()
})

//listining enter key press in the search searchDeviceByUID
$("#searchDeviceUUIDtxt").on('keypress', (e) => {
    if (e.key == "Enter") {
        searchByDeviceUUID()
    }
})

//search device button click event
$("#searchDeviceUUIDbtn").click(() => {
    searchByDeviceUUID()
})


//listining enter key press in the search searchDeviceByUID
$("#searchDeviceByUID").on('keypress', (e) => {
    if (e.key == "Enter") {
        searchDeviceByUIDbtn()
    }
})

//search device button click event
$("#searchDeviceByUIDbtn").click(() => {
    searchDeviceByUIDbtn()
})

//listining enter key press in the search device
$("#searchDeviceIDtxt").on('keypress', (e) => {
    if (e.key == "Enter") {
        searchDevice()
    }
})

//search device button click event
$("#searchDeviceByIDbtn").click(() => {
    searchDevice()
})


//listining enter key press in the searchProject
$("#searchProjectString").on('keypress', (e) => {
    if (e.key == "Enter") {
        globalSearchProject()
    }
})
//listening enter key press in the search task string textbox
$("#searchTaskString").on('keypress', (e) => {
    if (e.key == "Enter") {
        searchTask()
    }
})

//search project button click event
$("#searchProjectButton").click(() => {
    globalSearchProject()
})

//search tasb button click
$("#searchTaskButton").click(() => {
    searchTask()
})
//listning enter key press in text box
$("#searchPendingProject").on('keypress', (e) => {
    if (e.key == "Enter") {
        pendingProjectSearch();
    }
})

//search pending project button event listnet
$("#searchPendingProjectButton").click(() => {
    pendingProjectSearch();
})

//button click on the pending project searrch
async function pendingProjectSearch() {
    try {
        projectID = $("#searchPendingProject").val().trim();
        if (projectID == "") {
            alert("Projec ID is not valid");
            return;
        }
        $("#waitingModal-header").text("Please wait...");
        $("#waitingModal-body").text("Hangon while loading the data")
        $("#waitingModal").modal("toggle");
        const result = await searchProject(projectID, "pending")

        let elem; //element of the pending selected project capture
        if (result.status == 1) {
            if (result.data[0].softwareID == "") {
                $("#waitingModal-header").text("OPS!!! project have no software");
                $("#waitingModal-body").text("This project still dont have software submited.");
                return;
            }
            $("#pendingProjectTable").empty()
            for (const value of result.data) {
                elem += "<tr><td>Project ID</td><td>" + value._id + "</td></tr>";
                elem += "<tr><td>Project Name</td><td>" + value.name + "</td></tr>";
                elem += "<tr><td>Project Created By</td><td>" + value.createdBy + "</td></tr>";
                elem += "<tr><td>Project Device Count</td><td>" + value.needDeviceCount + "</td></tr>";
                elem += "<tr><td>Project least CPU</td><td>" + value.leastCPU + "</td></tr>";
                elem += "<tr><td>Project least RAM</td><td>" + value.leastRAM + "</td></tr>";
                elem += "<tr><td>Project OS</td><td>" + value.os + "</td></tr>";
                elem += "<tr><td>Project Description</td><td>" + value.description + "</td></tr>";
                elem += "<tr><td>Project Software</td><td>";
                for (const soft of value.softwareID) {
                    elem += " <a href='/software/" + soft + "'>" + soft + "</a>";
                }
                elem += "</td></tr>";
                elem += "<tr><td>Project Image</td><td><img src='/" + value.img + "' widht='100' height='100'></td></tr>";
                elem += "<tr><td>Project Time</td><td>" + new Date(value.time).toString() + "</td></tr>";
                elem += "<tr><td>Project Approve</td><td>" + '<button type="button" class="btn btn-secondary btn-block"' +
                    ' onclick="approve(' + "'" + value._id + "'" + ')">Approve</button>' + "</td></tr>";
            }
            $("#pendingProjectTable").append(elem), elem = "";

        } else {
            $("#waitingModal-header").text("OPS!!! There is an error");
            $("#waitingModal-body").text(result.msg);
            return;
        }

        setTimeout(() => {
            $("#waitingModal").modal("toggle");
        }, 500);
    } catch (e) {
        $("#waitingModal-header").text("OPS!!! Something went wrong");
        $("#waitingModal-body").text("The process has been unexpectly terminated. Please try again." + e);
    }
}
/**
 * This function get the project ID and send to approve it 
 * @param {String} projectID approve project id
 */
function approve(projectID) {
    if (projectID.trim() == "") { return (alert("OOPs. ProjectID is not valied")) }

    $("#waitingModal-header").text("Please wait...");
    $("#waitingModal-body").text("Hangon while processing the data")
    $("#waitingModal").modal("toggle");

    $.ajax({
        type: "POST",
        url: "projects/approve",
        data: JSON.stringify({ email: email, password: password, projectID: projectID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).then(result => {
        if (result.status == 1) {
            $("#waitingModal-header").text("Done!!!");
            $("#waitingModal-body").text("Successfully updated");
            refreshPendingProjects();
        } else {
            $("#waitingModal-header").text("Oops! Something went wrong");
            $("#waitingModal-body").text(result.msg);
        }
    }).catch(e => {
        $("#waitingModal-header").text("Oops! Something went wrong");
        $("#waitingModal-body").text("Connection with the server is interupted. Please try again.");
    })
}

//seach project
function globalSearchProject() {
    const searchString = $("#searchProjectString").val().trim();
    const property = $("#projectProperty").val().trim();

    if (searchString == "" || (property != "projectid" && property != "name")) { return (alert("Search String or project property is incorrect")) }

    $("#waitingModal-header").text("Please wait...");
    $("#waitingModal-body").text("Hangon while processing the data")
    $("#waitingModal").modal("toggle");

    $.ajax({
        type: "POST",
        url: "projects/search/",
        data: JSON.stringify({ email: email, password: password, searchString: searchString, property: property }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).then(result => {
        if (result.status == 0) {
            $("#waitingModal-header").text("Oops! Something went wrong");
            $("#waitingModal-body").text(result.msg)
            return
        }
        $("#manageProjectTable").empty()
        let elem; //element of the creaate table rows
        elem += "<tr><td>Project ID</td><td>" + result.data[0]._id + "</td></tr>";
        elem += "<tr><td>Project Name</td><td>" + result.data[0].name + "</td></tr>";
        elem += "<tr><td>Project Created By</td><td>" + result.data[0].createdBy + "</td></tr>";
        elem += "<tr><td>Project Device Count</td><td>" + result.data[0].needDeviceCount + "</td></tr>";
        elem += "<tr><td>Project least CPU</td><td>" + result.data[0].leastCPU + "</td></tr>";
        elem += "<tr><td>Project least RAM</td><td>" + result.data[0].leastRAM + "</td></tr>";
        elem += "<tr><td>Project OS</td><td>" + result.data[0].os + "</td></tr>";
        elem += "<tr><td>Project Description</td><td>" + result.data[0].description + "</td></tr>";
        elem += "<tr><td>Project Notice</td><td>" + result.data[0].notice + "</td></tr>";
        elem += "<tr><td>Project Total Tasks</td><td>" + result.totalTask.length + "</td></tr>";
        elem += "<tr><td>Project Software</td><td>";
        for (const soft of result.data[0].softwareID) {
            elem += " <a href='/software/" + soft + "'>" + soft + "</a>";
        }
        elem += "</td></tr>";
        elem += "<tr><td>Project Image</td><td><img src='/" + result.data[0].img + "'></td></tr>";
        elem += "<tr><td>Project Devices</td><td>";
        for (const device of result.data[0].devices) {
            elem += device;
        }
        elem += "</td></tr>";
        elem += "<tr><td>Project Time</td><td>" + new Date(result.data[0].time).toString() + "</td></tr>";

        elem += "<tr><td>Suspend Project Data</td><td>";
        elem += '<button class="btn btn-outline-secondary btn-block" type="button" onclick="suspendProject(' + "'" + result.data[0]._id + "'" + ')">';
        elem += "Suspend Project</button></td></tr>";

        elem += "<tr><td>Download Project Data</td><td>";
        elem += '<button class="btn btn-outline-secondary btn-block" type="button" onclick="downloadProject(' + "'" + result.data[0]._id + "'" + ')">';
        elem += "Download Project</button></td></tr>";

        $("#manageProjectTable").append(elem), elem = "";

        //allTaskKeyDetail
        $("#allTaskKeyDetail").empty();

        //show of the all task under this project
        if (result.taskData.length == 0) {
            $("#allTaskKeyDetail").append("<tr><td>No </td><td>Tasks</td></tr>");
        } else {
            $("#allTaskKeyDetail").empty();
            result.totalTask.forEach((task, i) => {
                $("#allTaskKeyDetail").append("<tr><td>" + task._id + "</td><td>" + task.name + "</td></tr>");
            });
        }

        //show of the nearest added 3 task details
        if (result.taskData.length == 0) {
            $("#manageTaskTable").empty();
            $("#manageTaskTable").append("<tr><td>No </td><td>Tasks</td></tr>");

        } else {
            $("#manageTaskTable").empty()
            result.taskData.forEach((task, i) => {
                if (i != 0) {
                    elem += "<tr class='bg-dark text-white text-md'><td>Property</td><td>Value</td></tr>";
                    $("#manageTaskTable").append(elem)
                    elem = "";
                }

                elem += "<tr><td>Task ID</td><td>" + task._id + "</td></tr>";
                elem += "<tr><td>Task ProjectID</td><td>" + task.project_id + "</td></tr>";
                elem += "<tr><td>Task name</td><td>" + task.name + "</td></tr>";
                elem += "<tr><td>Task Method</td><td>";
                if (task.method == 0) {
                    elem += "For all devices (this task will do all devices)";
                }
                if (task.method == 1) {
                    elem += "For the task first getting device";
                }
                if (task.method == 2) {
                    elem += "Target device (This task run on targeted device(s)"
                }
                elem += "</td></tr>";
                elem += "<tr><td>Task Data</td><td>" + task.data + "</td></tr>";
                elem += "<tr><td>Task Status</td><td>" + task.status + "</td></tr>";
                elem += "<tr><td>Task FinishedBy</td><td>" + task.finishedby + "</td></tr>";
                elem += "<tr><td>Task Result</td><td>" + JSON.stringify(task.result) + "</td></tr>";
                elem += "<tr><td>Task Target Devices</td><td>" + task.targetDevice.replace(",", " <br> ") + "</td></tr>";
                elem += "<tr><td>Task Target Created By</td><td>" + task.createdBy + "</td></tr>";
                elem += "<tr><td>Task Target Added Time</td><td>" + new Date(task.addedTime).toString() + "</td></tr>";
                $("#manageTaskTable").append(elem)
                elem = "";
            });
        }
        setTimeout(() => {
            $("#waitingModal").modal("toggle");
        }, 600);

    }).catch(e => {
        $("#waitingModal-header").text("Oops! Something went wrong");
        $("#waitingModal-body").text("Connection with the server is interupted. Please try again")
    })
}
/**
 * This function call to server and suspend the given project
 * @param {String} projectID project ID that needs to be suspend
 */
async function suspendProject(projectID) {
    const reason = prompt("What is the reason of suspenging");
    if (reason == "") { alert("Input cant be empty."); return }
    if (reason == null) { alert("No change effected"); return }

    $("#waitingModal-header").text("Please wait");
    $("#waitingModal-body").text("Processing...............")
    $("#waitingModal").modal("toggle");

    $.ajax({
        type: "POST",
        url: "projects/suspend/",
        data: JSON.stringify({ email: email, password: password, projectID: projectID, reason: reason }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).then(result => {
        if (result.status == 0) {
            $("#waitingModal-header").text("Oops!!! somthing went wrong!");
            $("#waitingModal-body").text(result.msg);
            return;
        }
        $("#waitingModal-header").text("Success!!!");
        $("#waitingModal-body").text(result.msg);
        return;
    }).catch((e) => {
        $("#waitingModal-header").text("Oops!!! somthing went wrong!");
        $("#waitingModal-body").text("Connection with the server is broken. Please try again");
        return;
    })
}
//requesting project data from the server
function searchProject(projectID, status) {
    return $.ajax({
        type: "POST",
        url: "projects/search/id",
        data: JSON.stringify({ email: email, password: password, projectID: projectID, status: status }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    });
}

async function searchTask() {
    const searchString = $("#searchTaskString").val().trim();
    const property = $("#taskProperty").val().trim();

    if (searchString == "" || (property != "taskid" && property != "name")) { return (alert("Search String or task property is incorrect")) }
    //showing the model of loading
    $("#waitingModal-header").text("Please wait...");
    $("#waitingModal-body").text("Hangon while processing the data")
    $("#waitingModal").modal("toggle");

    $.ajax({
        type: "POST",
        url: "projects/search/task",
        data: JSON.stringify({ email: email, password: password, searchString: searchString, property: property }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).then(result => {
        if (result.status == 0) {
            $("#waitingModal-header").text("Oops!. Error!!!");
            $("#waitingModal-body").text(result.msg);
        } else {
            let elem = "";
            $("#manageTaskTable").empty()
            result.data.result.forEach((task, i) => {
                if (i != 0) {
                    elem += "<tr class='bg-dark text-white text-md'><td>Property</td><td>Value</td></tr>";
                    $("#manageTaskTable").append(elem)
                    elem = "";
                }
                elem += "<tr><td>Task ID</td><td>" + task._id + "</td></tr>";
                elem += "<tr><td>Task ProjectID</td><td>" + task.project_id + "</td></tr>";
                elem += "<tr><td>Task name</td><td>" + task.name + "</td></tr>";
                elem += "<tr><td>Task Method</td><td>";
                if (task.method == 0) {
                    elem += "For all devices (this task will do all devices)";
                }
                if (task.method == 1) {
                    elem += "For the task first getting device";
                }
                if (task.method == 2) {
                    elem += "Target device (This task run on targeted device(s)"
                }
                elem += "</td></tr>";
                elem += "<tr><td>Task Data</td><td>" + task.data + "</td></tr>";
                elem += "<tr><td>Task Status</td><td>" + task.status + "</td></tr>";
                elem += "<tr><td>Task FinishedBy</td><td>" + task.finishedby + "</td></tr>";
                elem += "<tr><td>Task Result</td><td>" + JSON.stringify(task.result) + "</td></tr>";
                elem += "<tr><td>Task Target Devices</td><td>" + task.targetDevice.replace(",", " <br> ") + "</td></tr>";
                elem += "<tr><td>Task Target Created By</td><td>" + task.createdBy + "</td></tr>";
                elem += "<tr><td>Task Target Added Time</td><td>" + new Date(task.addedTime).toString() + "</td></tr>";
                $("#manageTaskTable").append(elem)
                elem = "";

            });
            //show of the all task under this project
            if (result.data.taskList.length == 0) {
                $("#allTaskKeyDetail").append("<tr><td>No </td><td>Tasks</td></tr>");
            } else {
                $("#allTaskKeyDetail").empty();
                $("#allTaskKeyDetail").append("<tr class='bg-secondary text-white text-center font-weight-bold'><td colspan='2'>Found " +
                    result.data.taskList.length + " tasks</td></tr>");
                result.data.taskList.forEach((task, i) => {
                    $("#allTaskKeyDetail").append("<tr><td>" + task._id + "</td><td>" + task.name + "</td></tr>");
                });
            }

            setTimeout(() => {
                $("#waitingModal").modal("toggle");
            }, 500);
        }

    }).catch(e => {
        $("#waitingModal-header").text("Oops!!! somthing went wrong!");
        $("#waitingModal-body").text("Connection with the server is broken. Please try again");
        return;
    })
}

/**
 * 
 * @param {*} projectID 
 */
async function downloadProject(projectID) {
    if (projectID.trim().length != 24) {
        $("#waitingModal-header").text("Oops!!! ERROR!");
        $("#waitingModal-body").text("Project ID is not valid. Please try again");
        $("#waitingModal").modal("toggle");
    }
    $("#waitingModal-header").text("Processing");
    $("#waitingModal-body").text("Please wait");
    $("#waitingModal").modal("toggle");
    $.ajax({
        type: "POST",
        url: "projects/report/download",
        data: JSON.stringify({ email: email, password: password, projectID: projectID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).then(result => {
        if (result.status == 0) {
            $("#waitingModal-header").text("Oops!!! ERROR!");
            $("#waitingModal-body").text(result.msg);
            $("#waitingModal").modal("toggle");
        } else {
            $("#waitingModal-header").text("Success");
            $("#waitingModal-body").text(result.msg);
            $("#waitingModal").modal("toggle");
        }
    }).catch(e => {
        $("#waitingModal-header").text("Oops!!! ERROR!");
        $("#waitingModal-body").text("Something went wrong please try again later.");
        $("#waitingModal").modal("toggle");
    })
}

/**
 * Search device 
 */
function searchDevice() {
    try {
        const deviceID = $("#searchDeviceIDtxt").val().trim();
        if (deviceID == "") {
            return (alert("Dont make empty string"));
        }
        $("#waitingModal-header").text("Processing");
        $("#waitingModal-body").text("Please wait. processing.....");
        $("#waitingModal").modal("toggle");
        $.ajax({
            type: "POST",
            url: "devices/search/deviceid",
            data: JSON.stringify({ email: email, password: password, deviceID: deviceID }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Oops!!! ERROR!");
                $("#waitingModal-body").text(result.msg);
                return
            } else {
                $("#deviceDataSBDI").empty()
                $("#projectDataSDBI").empty()
                $("#downloadButtonSBDI").empty()
                $("#deviceDataSBDI").append("<tr><Td>Device ID</td><td>" + result.data.deviceResult[0]._id + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device User ID</td><td>" + result.data.deviceResult[0].userID + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device UUID</td><td>" + result.data.deviceResult[0].UUID + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device RAM</td><td>" + result.data.deviceResult[0].RAM + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device CPU</td><td>" + result.data.deviceResult[0].CPU + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device Network ( Mbps )</td><td>" + result.data.deviceResult[0].network + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device Storage (GB) </td><td>" + result.data.deviceResult[0].hdd + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device Name</td><td>" + result.data.deviceResult[0].deviceName + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device OS</td><td>" + result.data.deviceResult[0].deviceOS + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device Status</td><td>" + result.data.deviceResult[0].deviceStatus + "</td></tr>")
                $("#deviceDataSBDI").append("<tr><Td>Device Added Time</td><td>" + Date(result.data.deviceResult[0].addedTime).toString() + "</td></tr>")
                $("#downloadButtonSBDI").append(
                    '<button class="btn btn-outline-secondary btn-block" type="button" onclick="downloadCSV(' + "['deviceDataSBDItbl','projectsDataSBDItbl'], 'SBDI'" + ')">Download Data</button>');

                $("#downloadButtonSBDI").append(
                    '<button class="btn btn-outline-danger btn-block" type="button" onclick="deactivateDevice(' + "'" + result.data.deviceResult[0]._id + "'" + ')">Deactivate Device</button>');

                result.data.projectResult.forEach((value, index) => {
                    $("#projectDataSDBI").append("<tr><td>" + (index + 1) + "</td><Td>" + value._id + "</td><td>" + value.name + "</td></tr>");
                })

                setTimeout(() => {
                    $("#waitingModal").modal("toggle");
                }, 500);
            }
        }).catch(e => {
            $("#waitingModal-header").text("Oops!!! ERROR!");
            $("#waitingModal-body").text("Something went wrong please try again later.");
            $("#waitingModal").modal("toggle");
        });
    } catch (e) {
        $("#waitingModal-header").text("Oops!!! ERROR!");
        $("#waitingModal-body").text("Something went wrong please try again later.");
        $("#waitingModal").modal("toggle");
    }
}

async function searchDeviceByUIDbtn() {
    try {
        const userID = $("#searchDeviceByUID").val().trim();
        if (userID == "") { return (alert("Empty string not allowed")) }
        $("#waitingModal-header").text("Processing");
        $("#waitingModal-body").text("Please Wait");
        $("#waitingModal").modal("toggle");
        $.ajax({
            type: "POST",
            url: "devices/search/userID",
            data: JSON.stringify({ email: email, password: password, userID: userID }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Error");
                $("#waitingModal-body").text(result.msg);
                $("#waitingModal").modal("toggle");
                return;
            } else {
                $("#deviceDataByUserID").empty();
                $("#downloadButton").empty();
                let elem = "";
                result.data.forEach((value, index) => {
                    elem += "<tr><td>" + (index + 1) + "</td><td>" + value._id + "</td><td>" + value.deviceName + "</td><td>" + value.userID + "</td><td>"
                        + value.UUID + "</td><td>" + value.RAM + "</td><td>" + value.CPU + "</td><td>" + value.network + "</td><td>";
                    elem += value.hdd + "</td><td>" + value.deviceOS + "</td><td>" + value.deviceStatus + "</td><td>" + value.addedTime + "</td></tr>";
                    $("#deviceDataByUserID").append(elem);
                    elem = '';
                })
                $("#downloadButton").append("<tr> <td  colspan='12'> " +
                    '<button class="btn btn-outline-secondary btn-block" type="button" onclick="downloadCSV(' + "['deviceDataByUserIDtbl'], 'SBUID'" + ')">Download Data</button>' +
                    "</td></tr>");
                setTimeout(() => {
                    $("#waitingModal").modal("toggle");
                }, 500);
            }
        }).catch(e => {
            $("#waitingModal-header").text("Oops!!! ERROR!");
            $("#waitingModal-body").text("Something went wrong please try again later.");
            $("#waitingModal").modal("toggle");
        });
    } catch (e) {
        $("#waitingModal-header").text("Oops!!! ERROR!");
        $("#waitingModal-body").text("Something went wrong please try again later.");
        $("#waitingModal").modal("toggle");
    }
}

/**
 * This function deactivate given device
 * @param {String} deviceID Device ID that needs to deactivate
 */
async function deactivateDevice(deviceID = '') {
    try {
        $("#waitingModal-header").text("Processing.");
        $("#waitingModal-body").text("Please wait... ");
        $("#waitingModal").modal("toggle");
        $.ajax({
            type: "POST",
            url: "devices/statechange/deactivate",
            data: JSON.stringify({ email: email, password: password, deviceID: deviceID }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Ops!!! Error!");
                $("#waitingModal-body").text(result.msg);
                return
            }
            $("#waitingModal-header").text("Sucesss");
            $("#waitingModal-body").text(result.msg);
            return
        }).catch(() => {
            $("#waitingModal-header").text("Error");
            $("#waitingModal-body").text("Connection between server and client is interupterd");
        })
    } catch (e) {
        $("#waitingModal-header").text("Ops!!! Error");
        $("#waitingModal-body").text("There was an error. Please try again.");
    }
}

/**
 * This function show the device data
 * @returns 
 */
async function searchByDeviceUUID() {
    try {
        $("#waitingModal-header").text("Please Wait");
        $("#waitingModal-body").text("Hangon processing");
        $("#waitingModal").modal("toggle");
        const uuid = $("#searchDeviceUUIDtxt").val().trim();
        $.ajax({
            type: "POST",
            url: "devices/search/uuid",
            data: JSON.stringify({ email: email, password: password, uuid: uuid }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Oops!!! ERROR!");
                $("#waitingModal-body").text(result.msg);
                return
            } else {
                $("#deviceDataUUID").empty()
                $("#projectDataUUID").empty()
                $("#downloadButtonUUID").empty()
                $("#deviceDataUUID").append("<tr><Td>Device ID</td><td>" + result.data.deviceResult[0]._id + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device User ID</td><td>" + result.data.deviceResult[0].userID + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device UUID</td><td>" + result.data.deviceResult[0].UUID + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device RAM</td><td>" + result.data.deviceResult[0].RAM + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device CPU</td><td>" + result.data.deviceResult[0].CPU + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device Network ( Mbps )</td><td>" + result.data.deviceResult[0].network + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device Storage (GB) </td><td>" + result.data.deviceResult[0].hdd + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device Name</td><td>" + result.data.deviceResult[0].deviceName + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device OS</td><td>" + result.data.deviceResult[0].deviceOS + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device Status</td><td>" + result.data.deviceResult[0].deviceStatus + "</td></tr>")
                $("#deviceDataUUID").append("<tr><Td>Device Added Time</td><td>" + Date(result.data.deviceResult[0].addedTime).toString() + "</td></tr>")
                $("#downloadButtonUUID").append(
                    '<button class="btn btn-outline-secondary btn-block" type="button" onclick="downloadCSV(' + "['deviceDataUUIDtbl','projectDataUUIDtbl'], 'SBDUUID'" + ')">Download Data</button>');

                $("#downloadButtonUUID").append(
                    '<button class="btn btn-outline-danger btn-block" type="button" onclick="deactivateDevice(' + "'" + result.data.deviceResult[0]._id + "'" + ')">Deactivate Device</button>');

                result.data.projectResult.forEach((value, index) => {
                    $("#projectDataUUID").append("<tr><td>" + (index + 1) + "</td><Td>" + value._id + "</td><td>" + value.name + "</td></tr>");
                })

                setTimeout(() => {
                    $("#waitingModal").modal("toggle");
                }, 500);
            }
        }).catch(() => {
            $("#waitingModal-header").text("Oops!!! ERROR!");
            $("#waitingModal-body").text("Some error happend. Please refresh and try again");
            return
        })
    } catch (e) {
        $("#waitingModal-header").text("Oops!!! ERROR!");
        $("#waitingModal-body").text("Please refresh and try again");
        return
    }
}

/**
 * this function show the given user all data
 */
async function userManagement() {
    try {
        const searchString = $("#searchUsertxt").val().trim();
        const containString = $("#userProperty").val().trim();

        $("#waitingModal-header").text("Please Wait");
        $("#waitingModal-body").text("Hangon processing");
        $("#waitingModal").modal("toggle");

        $.ajax({
            type: "POST",
            url: "user/search/",
            data: JSON.stringify({ email: email, password: password, searchString: searchString, containString: containString }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Server saying something");
                console.log(result.msg)
                $("#waitingModal-body").text(result.msg);
                return
            }
            //clear the tables
            $("#manageUserbtn").empty()
            $("#userData").empty()
            $("#userContributedData").empty()
            $("#userDeviceData").empty()
            $("#userProjectData").empty()
            $("#downloadManageUserData").empty()

            //buttons for download data and suspend user
            $("#manageUserbtn").append(
                '<button class="btn btn-outline-secondary btn-block" type="button" onclick="downloadCSV(' + "['downloadManageUser'], 'UserData'" + ')">Download Data</button>'
            )

            $("#manageUserbtn").append(
                '<button class="btn btn-outline-danger btn-block" type="button" onclick="suspendUser(' + "'" + result.data.userProfile[0]._id + "'" + ')">Suspend User</button>'
            )
            //add user profile data
            $("#userData").append("<tr><td>ID</td><td>" + result.data.userProfile[0]._id + "</td></tr>")
            $("#userData").append("<tr><td>Name</td><td>" + result.data.userProfile[0].name + "</td></tr>")
            $("#userData").append("<tr><td>Email</td><td>" + result.data.userProfile[0].email + "</td></tr>")
            $("#userData").append("<tr><td>Created Data</td><td>" + Date(result.data.userProfile[0].date).toString() + "</td></tr>")
            $("#userData").append("<tr><td>Status</td><td>" + result.data.userProfile[0].status + "</td></tr>")
            $("#userData").append("<tr><td>Activated</td><td>" + result.data.userProfile[0].activated + "</td></tr>")
            $("#userData").append("<tr><td>Activated At</td><td>" + Date(result.data.userProfile[0].activated).toString() + "</td></tr>")

            //add data to contributed project
            result.data.userContributed.forEach((value, index) => {
                $("#userContributedData").append("<tr><td>" + (index + 1) + "</td><Td>" + value.projectID + "</td><td>" + Date(value.joinDate).toString() + "</td></tr>")
            })
            //add data to user device table
            result.data.userDevices.forEach((value, index) => {
                $("#userDeviceData").append("<tr><td>" + (index + 1) + "</td><td>" + value._id + "</td><td>" + value.deviceName + "</td><td>" +
                    value.deviceOS + "</td><td>" + value.deviceStatus + "</td></tr>")
            })
            //add data to userProjectData table
            result.data.userProjects.forEach((value, index) => {
                $("#userProjectData").append("<tr><td>" + (index + 1) + "</td><td>" + value._id + "</td><td>" + value.name + "</td><td>" + value.status + "</td><td>" + value.description + "</td></tr>")
            })

            //dwnload table
            $("#downloadManageUserData").append("<tr><td>ID</td><td>" + result.data.userProfile[0]._id + "</td></tr>")
            $("#downloadManageUserData").append("<tr><td>Name</td><td>" + result.data.userProfile[0].name + "</td></tr>")
            $("#downloadManageUserData").append("<tr><td>Email</td><td>" + result.data.userProfile[0].email + "</td></tr>")
            $("#downloadManageUserData").append("<tr><td>Created Data</td><td>" + Date(result.data.userProfile[0].date).toString() + "</td></tr>")
            $("#downloadManageUserData").append("<tr><td>Status</td><td>" + result.data.userProfile[0].status + "</td></tr>")
            $("#downloadManageUserData").append("<tr><td>Activated</td><td>" + result.data.userProfile[0].activated + "</td></tr>")
            $("#downloadManageUserData").append("<tr><td>Activated At</td><td>" + Date(result.data.userProfile[0].activated).toString() + "</td></tr>")
            $("#downloadManageUserData").append("<tr><td></td><td>" + "</td></tr>")

            $("#downloadManageUserData").append("<tr><td>Contributed Project ID</td><td> Contributed date</td></tr>")
            result.data.userContributed.forEach((value, index) => {
                $("#downloadManageUserData").append("<tr><Td>" + value.projectID + "</td><td>" + Date(value.joinDate).toString() + "</td></tr>")
            })
            $("#downloadManageUserData").append("<tr><td></td><td>" + "</td></tr>")

            $("#downloadManageUserData").append("<tr><td>Device ID</td><td> Device Name</td> <td> Device OS</td><td>Device Status</td></tr>")
            //add data to user device table
            result.data.userDevices.forEach((value, index) => {
                $("#downloadManageUserData").append("<tr><td>" + value._id + "</td><td>" + value.deviceName + "</td><td>" +
                    value.deviceOS + "</td><td>" + value.deviceStatus + "</td></tr>")
            })
            $("#downloadManageUserData").append("<tr><td></td><td>" + "</td></tr>")

            $("#downloadManageUserData").append("<tr><td>Project ID</td><td> Project Name</td> <td> Project Status</td><td>Project Desctiption</td></tr>")
            //add data to userProjectData table
            result.data.userProjects.forEach((value, index) => {
                $("#downloadManageUserData").append("<tr><td>" + value._id + "</td><td>" + value.name + "</td><td>" + value.status + "</td><td>" + value.description + "</td></tr>")
            })
            setTimeout(() => {
                $("#waitingModal").modal("toggle");
            }, 500);
        })
    } catch (e) {
        $("#waitingModal-header").text("Error");
        $("#waitingModal-body").text("Something went wrong. Please refresh and try again");
    }
}

async function suspendUser(userID) {
    try {
        $("#waitingModal-header").text("Please Wait");
        $("#waitingModal-body").text("Hangon processing");
        $("#waitingModal").modal("toggle");
        $.ajax({
            type: "POST",
            url: "user/deativate/",
            data: JSON.stringify({ email: email, password: password, userID: userID }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Error");
                $("#waitingModal-body").text(result.msg);
            } else {
                $("#waitingModal-header").text("Sucess");
                $("#waitingModal-body").text(result.msg);
            }
        })
    } catch (e) {
        $("#waitingModal-header").text("Error");
        $("#waitingModal-body").text("Please try again");
    }
}

async function adminManagement() {
    try {
        const searchString = $("#searchAdmintxt").val().trim();
        const containString = $("#adminProperty").val().trim();
        $("#waitingModal-header").text("Please Wait");
        $("#waitingModal-body").text("Hangon processing");
        $("#waitingModal").modal("toggle");
        $.ajax({
            type: "POST",
            url: "search/",
            data: JSON.stringify({ email: email, password: password, searchString: searchString, containString: containString }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Error");
                $("#waitingModal-body").text(result.msg);
                return
            }
            $("#adminData").empty();
            $("#downloadAdminData").empty();
            $("#adminData").append("<tr><td>" + result.data[0]._id + "</td><td>" + result.data[0].email + "</td><td>" + result.data[0].username + "</td><td>" + result.data[0].status +
                "</td><td>" + result.data[0].role + "</td><td>" + Date(result.data[0].createdDate).toString() + "</td><td>" + result.data[0].createdBy + "</td></tr>");
            $("#downloadAdminData").append(
                '<button class="btn btn-outline-secondary btn-block" type="button" onclick="downloadCSV(' + "['singleAdminTable'], 'singleAdmin'" + ')">Download Admin Data</button>'
            )
            $("#downloadAdminData").append(
                '<button class="btn btn-outline-danger btn-block" type="button" onclick="suspendAdmin(' + "'" + result.data[0]._id + "'" + ')">Suspend User</button>'
            )
            setTimeout(() => {
                $("#waitingModal").modal("toggle");
            }, 500);
        })
    } catch (e) {
        $("#waitingModal-header").text("Error");
        $("#waitingModal-body").text("Please try again");
    }
}
/**
 * This function suspend the given user
 * @param {String} adminID id that needs to suspend
 */
async function suspendAdmin(adminID) {
    try {
        $("#waitingModal-header").text("Processing");
        $("#waitingModal-body").text("Please Wait....");
        $("#waitingModal").modal("toggle");
        $.ajax({
            type: "POST",
            url: "suspend/",
            data: JSON.stringify({ email: email, password: password, adminID: adminID }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Error");
                $("#waitingModal-body").text(result.msg);
                return
            }
            $("#waitingModal-header").text("Success");
            $("#waitingModal-body").text(result.msg);
        })
    } catch (e) {
        $("#waitingModal-header").text("Error");
        $("#waitingModal-body").text("Please try again");
    }
}

async function newAdmin() {
    try {
        const newAdminEmail = $("#adminNewEmail").val().trim();
        const newAdminPassword = $("#adminNewPassword").val().trim();
        const newAdminRole = $("#adminNewRole").val().trim();
        const newAdminUsername = $("#adminNewUsername").val().trim();

        $("#waitingModal-header").text("Processing");
        $("#waitingModal-body").text("Please Wait....");
        $("#waitingModal").modal("toggle");

        $.ajax({
            type: "POST",
            url: "new/",
            data: JSON.stringify({
                email: email, password: password, newAdminEmail: newAdminEmail, newAdminPassword: newAdminPassword, newAdminRole: newAdminRole,
                newAdminUsername: newAdminUsername
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Error");
                $("#waitingModal-body").text(result.msg);
                return
            }
            $("#waitingModal-header").text("Success");
            $("#waitingModal-body").text(result.msg);
        })
    } catch (e) {
        $("#waitingModal-header").text("Error");
        $("#waitingModal-body").text("Please try again");
    }
}

async function resetAdmin() {
    try {
        const searchString = $("#resetPasswordtxt").val().trim();
        const searchProperty = $("#resetProperty").val().trim();
        $("#waitingModal-header").text("Processing");
        $("#waitingModal-body").text("Please Wait....");
        $("#waitingModal").modal("toggle");

        $.ajax({
            type: "POST",
            url: "password/reset",
            data: JSON.stringify({ email: email, password: password, searchString: searchString, searchProperty: searchProperty }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Sorry there was an error");
                $("#waitingModal-body").text(result.msg);
                return
            }
            $("#waitingModal-header").text("Done");
            $("#waitingModal-body").text("Done. Default Password is Slicon@123");
        })
    } catch (e) {
        $("#waitingModal-header").text("Error");
        $("#waitingModal-body").text("Please try again");
    }
}

async function changeMyPassword() {
    try {
        const newPassword = $("#changeMyPasswordtxt").val().trim();
        $("#waitingModal-header").text("Processing");
        $("#waitingModal-body").text("Please Wait....");
        $("#waitingModal").modal("toggle");

        $.ajax({
            type: "POST",
            url: "password/change",
            data: JSON.stringify({ email: email, password: password, newPassword: newPassword }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).then(result => {
            if (result.status == 0) {
                $("#waitingModal-header").text("Sorry there was an error");
                $("#waitingModal-body").text(result.msg);
                return
            }
            $("#waitingModal-header").text("Done");
            $("#waitingModal-body").text("Successfully changed the password. Please log in again");
        })
    } catch (e) {
        $("#waitingModal-header").text("Error");
        $("#waitingModal-body").text("Please try again");
    }
}
/**
 * This will download the given table data as CSV
 * @param {array} tableName with all table names
 * @param {String} fileName filename
 */
function downloadCSV(tableName, fileName) {
    if (tableName == "downloadManageUser") {
        $("#downloadManageUser").css({ 'visibility': 'visible', 'display': '' })
    }
    tableName.forEach((value, index) => {
        $('#' + value).first().table2csv('download', { filename: fileName + '.csv' });
    })
    if (tableName == "downloadManageUser") {
        $("#downloadManageUser").css({ 'visibility': 'hidden', 'display': 'none' })
    }
}

async function searchLog() {
    const userEmail = $("#searchLogUserID").val().trim();
    if (userEmail == "") {
        alert("Please enter valid user email");
        return;
    }
    $.ajax({
        type: "POST",
        url: "userlog/view/",
        data: JSON.stringify({ userEmail: userEmail, email: email, password: password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).then((data)=>{
        console.log(data.msg.length)
        console.log(data)
        if(data.msg.length == 0 || data.status ==0){
            alert("No data found. Please check user Email is correct.");
            return;
        }
        $("#userLogtblData").empty()
        data.msg.forEach(element => {
            let elem = "";
            elem += `<tr> <td> ${element._id}</td> <td> ${element.notification} </td> <td> ${element.date} </td> <td> ${JSON.stringify(element.data)} </td> </tr>`;
            $("#userLogtblData").append(elem)
        });
    })
    
}

//logout
function logout() {
    document.cookie = "email = ";
    document.cookie = "password = ";
    window.location.replace("http://siliconsociety.org/admin/login")
}