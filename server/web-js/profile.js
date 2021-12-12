let model = ' <div class="modal fade" id="myModal"> <div class="modal-dialog modal-xl"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title" id="project-title">Modal Heading</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body"> Modal body.. </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> </div> </div> </div> </div> '
let projectID = '';
let email = '';
let password = '';

$(document).ready(function () {
    email = Cookies.get('email');
    password = Cookies.get('password');
    $.ajax({
        type: "POST",
        url: "profile/start",
        data: JSON.stringify({ email: email, password: password }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: (result) => {
            if (result.status == 0) {
                alert("Credentials incorrect please log in again");
                window.location.replace("http://127.0.0.1")
            }
            //add nos prj and contro to element
            $('#nos-prj').text("Your Projects " + result.projectResult.nos_project);
            $('#nos-contro').html("&nbsp;Your Contributions " + result.contributeResult.nos_contribute);
            $('#apisecret').val(result.profileResult.profile.apiSecret);
            $('#userID').val(result.profileResult.profile._id);

            //if there are projects 
            if (result.projectResult.nos_project >= 1) {
                for (const _projects of result.projectResult.projects) {
                    $('#project-element').append('<div class="row border"> <div class="col-sm-4 proj-box-img broder" > <img src="' + _projects.img
                        + '" width="200" height="200" class="border border-dark"> </div> <div class="col-8"> <h3>' + _projects.name + '</h3> ' +
                        ' <p>' + _projects.description + '</p> <p>Software ID ' + _projects.softwareID + ' </p> <p>Approved : ' + _projects.approved +
                        '</p> <p>Time : ' + new Date(_projects.time) + ' <p> Status ' + _projects.status + ' </p> <button type="button" class="btn  ' +
                        'btn-primary" onclick="getProject(' + "'" + _projects._id + "'" + ')">' + 'View Project</button>' + ' <span id="spin' + _projects._id + '">' +
                        '</span> </div></div><br>');
                }
            } else {
                $('#project-element').append('<div class="row border"><div class="col">There are no projects</div></div>');
            }
            //if there are contributions
            if (result.contributeResult.nos_contribute >= 1) {
                for (const _contro of result.contributeResult.contribute) {
                    $("#contro-element").append('<div class="row border"> <div class="col-sm-4 proj-box-img broder" > <img src="' + _contro.img
                        + '" width="200" height="200" class="border border-dark"> </div> <div class="col-8"> <h3>' + _contro.name + '</h3> ' +
                        ' <p>' + _contro.description + '</p> <p>Software ID ' + _contro.softwareID + ' </p> <p>Approved : ' + _contro.approved +
                        '</p> <p>Time : ' + new Date(_contro.time) + ' <p> Status ' + _contro.status + ' </p> <p> Device ID : ' + _contro.deviceID + '</p> <button type="button" class="btn  ' +
                        'btn-primary" onclick="downloadTask(' + "'" + _contro._id + "'" + ')">' + 'Download My Task</button>' + ' <span id="spin' + _contro._id + '">' +
                        '</span> </div></div><br>')
                }
            } else {
                $('#contro-element').append('<div class="row border"><div class="col">There are no contributions</div></div>');
            }

            //if there are devices
            if (result.devicesResult.nos_devices >= 1) {
                let elem = "";
                for (const _device of result.devicesResult.devices) {
                    elem = (' <p style="text-align:center;">' + _device.deviceName + '</p>');
                    elem += (' <table class="table table-dark table-striped"> <thead><tr><th>Property</th><th>Value</th></tr>  <tbody id="modal-task-' + _device._id + '">');
                    elem += (' <tr> <td> Device ID </td> <td> ' + _device._id + ' </td> </tr> ');
                    elem += (' <tr> <td> Device UUID </td> <td> ' + _device.UUID + ' </td> </tr> ');
                    elem += (' <tr> <td> Device RAM </td> <td> ' + _device.RAM + ' MB</td> </tr> ');
                    elem += (' <tr> <td> Device CPU </td> <td> ' + _device.CPU + ' </td> </tr> ');
                    elem += (' <tr> <td> Device Network  </td> <td> ' + _device.network + ' </td> </tr> ');
                    elem += (' <tr> <td> Device Storage Space </td> <td> ' + _device.hdd + ' GB</td> </tr> ');
                    elem += (' <tr> <td> Device Name </td> <td> ' + _device.deviceName + ' </td> </tr> ');
                    elem += (' <tr> <td> Device OS </td> <td> ' + _device.deviceOS + ' </td> </tr> ');
                    elem += (' <tr> <td> Device Status </td> <td> ' + _device.deviceStatus + ' </td> </tr> ');
                    elem += (' <tr> <td> Device Added Time </td> <td> ' + _device.addedTime + ' </td> </tr> ');
                    elem += ('</tbody></table>');
                    if (_device.deviceStatus == "active") {
                        elem += ('<button type="button" class="btn btn-outline-danger btn-block" onclick="changeDeviceStatus(' + "'" + _device._id + "','inactive'" + ')">Deactivate Device ' + _device._id + '</button>');
                    }
                    if (_device.deviceStatus == "inactive") {
                        elem += ('<button type="button" class="btn btn-outline-primary btn-block" onclick="changeDeviceStatus(' + "'" + _device._id + "','active'" + ')">Activete Device</button>')
                    }
                    $('#devices-element').append(elem);
                    $('#devices-element').append("<hr style=' width:75%' class='bg-dark'>");
                    elem = "";
                }
            } else {
                $('#devices-element').append('<div class="row border"><div class="col">There are no devices you connected</div></div>');
            }
            if (result.processors.length >= 1) {
                for (const _processor of result.processors) {
                    $("#project-processor-list").append('<option value="' + _processor.Processor + '" id="' + _processor._id + '">' + _processor['Base speed & Cores'] + '</option>')
                }
            } else {
                $("#project-processor-list").append('<option value="Error please refresh the webpage"></option>');
            }

            $(".loading").remove();
            $(".container-fluid").css({ 'display': '', 'animation': '3s fadeIn', 'animation-fill-mode': 'forwards' });
        },
        error: () => {
            document.url = "/profile";
        }
    });
    // add learn more modals 
    $("#modelLoader").append(window.atob("PGRpdiBjbGFzcz0ibW9kYWwgZmFkZSIgaWQ9ImNvbXBsZVByb2plY3RNb2RlbCI+CiAgICAgICAgICAgIDxkaXYgY2xhc3M9Im1vZGFsLWRpYWxvZyAgbW9kYWwtbGciPgogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ibW9kYWwtY29udGVudCI+CgogICAgICAgICAgICAgICAgICAgIDwhLS0gTW9kYWwgSGVhZGVyIC0tPgogICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9Im1vZGFsLWhlYWRlciI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz0ibW9kYWwtdGl0bGUiPkNvbXBsZXRpbmcgcHJvamVjdDwvaDQ+CiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iY2xvc2UiIGRhdGEtZGlzbWlzcz0ibW9kYWwiPiZ0aW1lczs8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICAgICAgICAgICAgPCEtLSBNb2RhbCBib2R5IC0tPgogICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9Im1vZGFsLWJvZHkiPgogICAgICAgICAgICAgICAgICAgICAgICBJZiB5b3VyIHByb2plY3QgaXMgZG9uZSAobm8gbW9yZSB0YXNrIHRvIGRvLCBhbGwgeW91ciBhaW1zIGFuZCBnb2FscyBhcmUgY29tcGxldGUpIHRoZW4gY2xvc2UKICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHByb2plY3QuCiAgICAgICAgICAgICAgICAgICAgICAgIFRvIGRvIHRoYXQsIGVudGVyIGJlbG93IHRleHQgYm94IHlvdXIgcHJvamVjdCBJRCBhbmQgY2xpY2sgb24gdGhlICdDb21wbGV0ZSBQcm9qZWN0JyBidXR0b24uCiAgICAgICAgICAgICAgICAgICAgICAgIEFmdGVyIGNsaWNrIG9uIHRoZSBwcm9qZWN0IGNvbXBsZXRlIGJ1dHRvbiwgYWxsIGFjdGl2ZSB0YXNrIGFyZSBtYXJrIGFzIGRvbmUuIE5vIG9uZSBjYW4KICAgICAgICAgICAgICAgICAgICAgICAgY29udHJpYnV0ZSB0byB0aGUgcHJvamVjdC4KICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICAgICAgICAgICAgPCEtLSBNb2RhbCBmb290ZXIgLS0+CiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ibW9kYWwtZm9vdGVyIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJidG4gYnRuLWRhbmdlciIgZGF0YS1kaXNtaXNzPSJtb2RhbCI+Q2xvc2U8L2J1dHRvbj4KICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgPC9kaXY+"));
    //add learn more modal for update password
    $("#modelLoader").append(window.atob("PGRpdiBjbGFzcz0ibW9kYWwgZmFkZSIgaWQ9ImNoYW5nZVBhc3N3b3JkTW9kYWwiPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJtb2RhbC1kaWFsb2cgIG1vZGFsLWxnIj4KICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9Im1vZGFsLWNvbnRlbnQiPgoKICAgICAgICAgICAgICAgICAgICA8IS0tIE1vZGFsIEhlYWRlciAtLT4KICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJtb2RhbC1oZWFkZXIiPgogICAgICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9Im1vZGFsLXRpdGxlIj5VcGRhdGUgUGFzc3dvcmQ8L2g0PgogICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImNsb3NlIiBkYXRhLWRpc21pc3M9Im1vZGFsIj4mdGltZXM7PC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgPC9kaXY+CgogICAgICAgICAgICAgICAgICAgIDwhLS0gTW9kYWwgYm9keSAtLT4KICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJtb2RhbC1ib2R5Ij4KV2hlbiBjaGFuZ2luZyB0aGUgcGFzc3dvcmQsIHlvdSBtdXN0IGJlIG5lZWRzIHRvIGxvZ2luIGFnYWluIGluIHRoZSBkZXNrdG9wIHNvZnR3YXJlLiBOZWVkIHRvIGxvZ2luIGFnYWluIHRvIHRoaXMgd2Vic2l0ZS4gCiAgICAgICAgICAgICAgICAgICAgPC9kaXY+CgogICAgICAgICAgICAgICAgICAgIDwhLS0gTW9kYWwgZm9vdGVyIC0tPgogICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9Im1vZGFsLWZvb3RlciI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iYnRuIGJ0bi1kYW5nZXIiIGRhdGEtZGlzbWlzcz0ibW9kYWwiPkNsb3NlPC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgPC9kaXY+CgogICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2Pg=="));
});

async function changeDeviceStatus(deviceID, status) {
    deviceID = deviceID.trim();
    status = status.trim();
    if (deviceID == "") { return (alert("Device ID is invalid. Please reload the webpage")); }
    if (status == "") { return (alert("Device status is invalid. Please reload the webpage")); }

    const result = await $.ajax({
        type: "POST",
        url: "profile/device/update",
        data: JSON.stringify({ email: email, password: password, deviceID: deviceID, status: status }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
    console.log(JSON.stringify(result));
}

/**
 * Get the task id and send it to download the task that i have contributed and done
 */
async function downloadTask(id) {
    const result = await $.ajax({
        type: "POST",
        url: "profile/project/contribution/myUtilize",
        data: JSON.stringify({ email: email, password: password, projID: id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });

    if (result.status == 0) {
        alert(result.msg);
        return;
    }
    var blob = new Blob([result]);//create new Blob
    var link = document.createElement('a');//create new a
    link.href = window.URL.createObjectURL(blob);
    link.download = "MyTask-" + id + ".csv";
    link.click();
}
//getProjectDetails
let getProjectTimeOutCounter = 0;
async function getProject(id) {
    //add the spinner to the project button left side
    $("#spin" + id).append('<div class="spinner-border text-warning"></div>');
    $.ajax({
        type: "POST",
        url: "profile/project/",
        data: JSON.stringify({ email: email, password: password, projID: id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 5000,
    }).then(function (result) {

        if (result.status == 0) {
            console.log(JSON.stringify(result))
            alert("The project id is not valid please try again.");
            $("#spin" + id).empty(); //remove added spinner
            return;
        }
        const projectDetails = result.projectDetails[0];
        const taskDetails = result.taskDetails;

        projectID = projectDetails._id;
        $("#modal-project-name").text(projectDetails.name);
        $("#modal-table-body").append(' <tr> <td> Name </td> <td> ' + projectDetails.name + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> ID </td> <td> ' + projectDetails._id + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Device Count </td> <td> ' + projectDetails.needDeviceCount + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Rewarded </td> <td> ' + projectDetails.rewarded + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Minimum Processor </td> <td> ' + projectDetails.leastCPU + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Minimum RAM </td> <td> ' + projectDetails.leastRAM + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Approved </td> <td> ' + projectDetails.approved + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Project Status </td> <td> ' + projectDetails.status + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Project OS </td> <td> ' + projectDetails.os + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Separate Task </td> <td> ' + projectDetails.separateTask + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Software ID </td> <td> ' + projectDetails.softwareID + ' </td> </tr> ');
        $("#modal-table-body").append(' <tr> <td> Project Description </td> <td> ' + projectDetails.description + ' </td> </tr>');
        $("#modal-table-body").append(' <tr> <td> Project Notice </td> <td> ' + projectDetails.notice + ' </td> </tr>');
        $("#modal-table-body").append(' <tr> <td> Project Icon </td> <td> <img src="' + projectDetails.img + '" width="200" height="200" class="border border-dark"> </td> </tr>');
        $("#modal-table-body").append(' <tr> <td> Contributed Devices  </td> <td> ' + projectDetails.devices.length + ' </td> </tr>');
        $("#modal-table-body").append(' <tr> <td> Contributed List  </td> <td> ' + projectDetails.devices + ' </td> </tr>');

        $("#modal-task").append('<hr class="bg-dark">');
        $("#modal-task").append('<h4>Number or tasks ' + result.taskCount + '</h4> <pre>Here only shows newest 15 tasks. To view all task please download the task report </pre>');
        $("#modal-task").append('<button type="button" class="btn btn-primary btn-block" onclick="getTaskData(' + "'" + projectDetails._id + "'" + ')" id="task-download">' +
            ' Download All Task Results </button> ');

        taskDetails.forEach(_task => {
            $("#modal-task").append('<p style="text-align:center;">' + _task._id + '</p>');
            $("#modal-task").append('<table class="table table-dark table-striped"> <thead><tr><th>Property</th><th>Value</th></tr>  <tbody id="modal-task-' + _task._id + '">');
            $('#modal-task-' + _task._id).append('<tr> <td> Task Name </td> <td> ' + _task.name + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task method </td> <td> ' + _task.method + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task Data </td> <td> ' + JSON.stringify(_task.data) + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task Added @ </td> <td> ' + Date(_task.addedTime) + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task Result </td> <td> ' + JSON.stringify(_task.result) + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task Status </td> <td> ' + _task.status + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task target device </td> <td> ' + _task.targetDevice + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task created @ </td> <td> ' + Date(_task.addedTime) + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task finished by </td> <td> ' + _task.finishedby + ' </td> </tr>');
            $('#modal-task-' + _task._id).append('<tr> <td> Task finished @ </td> <td> ' + Date(_task.finishedTime) + ' </td> </tr>');
            $("#modal-task").append('</tbody></table>');
        });

        //add new task
        $("#modal-task").append('<hr class="bg-dark">');
        $('#modal-task').append('<h4>Add new TASK</h4>');
        $('#modal-task').append(window.atob("PGRpdiBjbGFzcz0iZm9ybS1ncm91cCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPSJ0YXNrLW5hbWUiPlRhc2sgTmFtZSA8L2xhYmVsPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9InRleHQiIGNsYXNzPSJmb3JtLWNvbnRyb2wiIGlkPSJ0YXNrLW5hbWUiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPSJUYXNrIE5hbWUgKENoYXJhY3RlcnMgbXVzdCBiZSBhbHBoYW51bWFyaWMuIE1heGltdW0gc2l6ZSBpcyAyMCwgbXVzdCBiZSBzdGFydCB3aXRoIGxldHRlcikiPgogICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZm9ybS1ncm91cCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPSJ0YXNrLW1ldGhvZCI+VGFzayBNZXRob2QgPC9sYWJlbD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9ImZvcm0tY29udHJvbCIgaWQ9InRhc2tfbWV0aG9kIiBvbmNoYW5nZT0idGFza19tZXRob2QoKSIgcmVxdWlyZWQ+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0iMCI+MCAtIEZvciBhbGwgZGV2aWNlcyAodGhpcyB0YXNrIHdpbGwgZG8gYWxsIGRldmljZXMpPC9vcHRpb24+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0iMSI+MSAtIEZvciBmaXJzdCBnZXR0aW5nIGRldmljZTwvb3B0aW9uPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9IjIiPjIgLSBUYXJnZXQgZGV2aWNlIChOZWVkcyB0byBhZGQgZGV2aWNlcyBJRHMpPC9vcHRpb24+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImZvcm0tZ3JvdXAiIGlkPSJ0YXJnZXQtZGV2aWNlLWNvbnRhaW5lciIgc3R5bGU9InZpc2liaWxpdHk6IGhpZGRlbjsgZGlzcGxheTogbm9uZTsiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj0idGFzay1kZXZpY2UiPlRhcmdlciBEZXZpY2VzPC9sYWJlbD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSJ0ZXh0IiBjbGFzcz0iZm9ybS1jb250cm9sIiBpZD0idGFzay1kZXZpY2UiIHBsYWNlaG9sZGVyPSJUYXJnZXQgRGV2aWNlcyBJRHMuIFlvdSBjYW4gdGFyZ2V0IHRhc2sgdG8gb25lIGRlaXZjZSBvciBtb3JlLiBQbGVhc2Ugc2VwYXJhdGUgZGV2aWNlIElEcyB1c2luZyBjb21tYSA6LSBleDsgZGV2aWNlSWQxLGRldmljZUlkMiIKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9ImZvcm0tZ3JvdXAiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj0idGFzay1kYXRhIj5UYXNrIERhdGE8L2xhYmVsPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPSJmb3JtLWNvbnRyb2wiIHJvd3M9IjUiIGlkPSJ0YXNrLWRhdGEiCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9IkFkZCB0YXNrIERhdGEgaGVyZS4gVGFzayBkYXRhIG11c3QgYmUgaW4gdGV4dCIgcmVxdWlyZWQ+PC90ZXh0YXJlYT4KICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+CgogICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJidG4gYnRuLXByaW1hcnkgYnRuLWJsb2NrIiBpZD0idGFza19zcGlubmVyIiBkaXNhYmxlZAogICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9InZpc2liaWxpdHk6IGhpZGRlbjsgZGlzcGxheTogbm9uZTsiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9InNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtIj48L3NwYW4+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb2FkaW5nLi4KICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+IDxicj4KICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iZm9ybS1ncm91cCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImJ0biBidG4tb3V0bGluZS1kYXJrIGJ0bi1ibG9jayIgb25jbGljaz0iYWRkVGFzaygpIj5BZGQKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUYXNrPC9idXR0b24+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2Pgo="));

        $("#spin" + id).empty(); //remove added spinner
        //showing the project model
        $("#loading-model").modal({ backdrop: 'static', keyboard: false });
    }).catch(function (e) {
        if (e.statusText == 'timeout') {
            if (getProjectTimeOutCounter <= 2) {
                getProjectTimeOutCounter += 1;
                $("#spin" + id).empty(); //remove added spinner
                getProject(id);
                return
            }
            alert("Connection inturrupted please try again");
            getProjectTimeOutCounter = 0;
        }
        $("#spin" + id).empty(); //remove added spinner
    })
}

function modal_clear() {
    $("#modal-project-name").text('');
    $("#modal-table-body").empty();
    $("#modal-task").empty();
}

//check the new task method and add the get device ID element
function task_method() {
    const method_value = $("#task_method").val();
    if (method_value == 2) {
        $("#target-device-container").css({ "visibility": "visible", "display": "" });
    } else {
        $("#target-device-container").css({ "visibility": "hidden", "display": "none" });
    }
}

//if project contributers get rewards run those code to get rewards value
function project_reward() {
    const rewarded = $("#project-rewarded").val();
    if (rewarded == "true") {
        $("#project-rewad-value-container").css({ "visibility": "visible", "display": "" });
    } else {
        $("#project-rewad-value-container").css({ "visibility": "hidden", "display": "none" });
    }
}

function imagePreview() {
    $("#imgpreview").empty();
    let [file] = $("#project-image")[0].files;
    $("#imgpreview").append('<img src="' + URL.createObjectURL(file) + '"width="200" height="200" >');
}
/**
 * Validate the add new project required tada
 */
function addNewProject() {
    const projectName = $("#project-name").val().trim();
    const deviceCount = $("#project-device-count").val().trim();
    const rewarded = $("#project-rewarded").val().trim();
    const processor = $("option[value='" + $("#project-processor").val() + "']").attr("id");
    const RAM = $("#project-ram").val().trim();
    const separateTask = $("#project-separate-task").val().trim();
    const projectDescription = $("#project-description").val().trim();
    const projectImage = $("#project-image")[0].files;
    //const projectSoftware = $("#project-software")[0].files;
    const project_os = $("#project-os").val().trim();

    if (projectName == "" || projectDescription == "" || processor == "") { return (alert("Some required fields are empty please check")) }
    if (isNaN(Number(deviceCount)) || isNaN(Number(RAM))) { return (alert("Device count or RAM value is incorrect pelase check")) }
    if (rewarded != "true" && rewarded != "false") { return (alert("Rewarded value is incorrect please refresh the webpage")) }
    if (separateTask != "true" && separateTask != "false") { return (alert("Separate task value is incorrect please refresh the webpage")) }
    if (projectImage.length != 1) { return (alert("Project image not correct. Please check")) }

    let formData = new FormData();
    //    formData.append("software", projectSoftware["0"]);
    //   formData.append("software", projectSoftware["1"]);
    formData.append("image", projectImage[0]);
    formData.append("os", project_os);
    formData.append("projectName", projectName);
    formData.append("deviceCount", deviceCount);
    formData.append("rewarded", rewarded);
    formData.append("processor", processor);
    formData.append("ram", RAM);
    formData.append("separateTask", separateTask);
    formData.append("projectDescription", projectDescription);
    formData.append("email", email);
    formData.append("password", password);
    $.ajax({
        url: 'profile/project/newProject/',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function (data) {
            if (data.status == 0) {
                alert("Project ID is :- " + JSON.stringify(data.msg))
            } else {
                alert("Project ID is :- " + JSON.stringify(data.msg.projectID))
            }
        }
    });
}

//submit project software
//require project id and software
function submitSoftware() {
    const projectID = $("#project-id").val().trim();
    const projectSoftware = $("#project-software")[0].files;
    let formData = new FormData();
    formData.append("software", projectSoftware["0"]);
    formData.append("software", projectSoftware["1"]);
    formData.append("projectid", projectID);
    formData.append("email", email);
    formData.append("password", password);//60c4c684cb60e4160043cecb
    $.ajax({
        url: 'profile/project/software/',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function (data) {
            alert(data.msg);

        }
    });
}

//add task
async function addTask() {
    const taskName = $("#task-name").val().trim();
    const method_value = $("#task_method").val().trim();
    const task_data = $("#task-data").val().trim();
    const target_device = $("#task-device").val().trim();

    if (target_device == "" && method_value == "2") {
        alert("Target device ID is incorrect");
        return;
    }
    if (taskName == "" || method_value == "" || task_data == "") {
        alert("Some required fields are not filled. Please check");
        return;
    }

    $("#task_spinner").css({ "visibility": "visible", "display": "" });
    const result = await $.ajax({
        type: "POST",
        url: "profile/project/addTask/",
        data: JSON.stringify({ email: email, password: password, projID: projectID, taskName: taskName, method: method_value, task_data: task_data, target_device: target_device }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    });
    $("#task_spinner").css({ "visibility": "hidden", "display": "none" });
    alert(result.msg);
    $("#task-name").val('');
    $("#task_method").val('');
    $("#task-data").val('');
    $("#task-device").val('');
}

/**
 * Task id or task name get, send it to server receive the result and add data to this
 */
async function searchTask() {
    $("#taskEditarea").empty();
    const taskNameID = $("#getTaskIDorName").val().trim();
    if(taskNameID == "" || taskNameID.length <2 )return(alert("please enter valid data"));
    const result = await $.ajax({
        type: "POST",
        url: "profile/project/searchTask",
        data: JSON.stringify({ email: email, password: password, taskNameID: taskNameID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });
    if (result.status == 0) {
        alert(result.msg);
        $("#getTaskIDorName").val('');
        return;
    }
    result.result.forEach(_task => {
        $("#taskEditarea").append('<p style="text-align:center;">' + _task._id + '</p>');
        $("#taskEditarea").append('<table class="table table-dark table-striped"> <thead><tr><th>Property</th><th>Value</th></tr>  <tbody id="taskEditarea-' + _task._id + '">');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task Name </td> <td> <input id=' + "'name" + _task._id + "'" + ' value=' + "'" + _task.name + "'" + ' type="text" size="100" > </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task method </td> <td> ' + _task.method + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task Data </td> <td> ' + JSON.stringify(_task.data) + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task Added @ </td> <td> ' + Date(_task.addedTime) + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task Result </td> <td> ' + JSON.stringify(_task.result) + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task Status </td> <td> ' + _task.status + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task target device </td> <td> ' + _task.targetDevice + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task created @ </td> <td> ' + Date(_task.addedTime) + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task finished by </td> <td> ' + _task.finishedby + ' </td> </tr>');
        $('#taskEditarea-' + _task._id).append('<tr> <td> Task finished @ </td> <td> ' + Date(_task.finishedTime) + ' </td> </tr>');
        $("#taskEditarea").append('</tbody></table>');
        $("#taskEditarea").append('<div class="form-group"><button type="button" class="btn btn-outline-primary btn-block" onclick="updateTask(' + "'" + _task._id + "','added'" + ')">Update</button></div>')
        $("#taskEditarea").append('<div class="form-group"><button type="button" class="btn btn-outline-danger btn-block" onclick="updateTask(' + "'" + _task._id + "','suspend'" + ')">Suspend task ' + _task.name + '</button></div>')
    });
    $("#getTaskIDorName").val('');
}
/**
 * This function do the update the task data
 */
async function updateTask(taskID, status) {
    const name = $('#name' + taskID).val().trim();
    if (name == "") { return (alert("Name cant be empty")) }
    $.ajax({
        type: "POST",
        url: "profile/project/updateTask/",
        data: JSON.stringify({ email: email, password: password, taskID: taskID, status: status, name: name }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ((result) => {
            if (result.status == 0) {
                alert(result.msg);
                return;
            }
            alert(result.msg);
            $("#getTaskIDorName").val(taskID);
            searchTask();
        })
    })
}

//getting task data
async function getTaskData(id) {
    $("#task-download").append('<span class="spinner-grow spinner-grow-sm" id="task-loading-btn"></span>');
    $.ajax({
        type: "POST",
        url: "profile/project/getTask/",
        data: JSON.stringify({ email: email, password: password, projID: id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: ((result) => {
            if (result.status == 0) {
                alert(result.msg);
                $("#task-loading-btn").remove();
                return;
            }
            var blob = new Blob([result]);//create new Blob
            var link = document.createElement('a');//create new a
            link.href = window.URL.createObjectURL(blob);
            link.download = "taskDetails-" + id + ".csv";
            link.click();
            $("#task-loading-btn").remove();
        })
    });
}

/**
 * Complete the project 
 */
async function completeProject() {
    const projectID = $("#project_id_complete").val().trim();
    $("#waitingModal-header").text("Please wait...")
    $("#waitingModal-body").text("Processing.....")
    $("#waitingModal").modal("show");
    $.ajax({
        type: "POST",
        url: "profile/project/complete/",
        data: JSON.stringify({ email: email, password: password, projectID: projectID }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 8000,
    }).then(function (result) {
        if (result.status == 0) {
            $("#waitingModal-header").text("Something wrong!!!")
            $("#waitingModal-body").text(result.msg);
            return;
        }
        $("#waitingModal-header").text("Done")
        $("#waitingModal-body").text(result.msg);
        return;
    }).catch(function (e) {
        if (e.statusText == 'timeout') {
            $("#waitingModal-header").text("OPS!!!!")
            $("#waitingModal-body").text("Connecting with the server is interrupted. Please try again")
        }
    });
    console.log((result));
}


//update password 
function updatePassword() {
    const newPassword = $("#newPassowrd").val().trim();

    if (newPassword.length < 8) {
        alert("Password is short");
        return;
    }
    //check password have lovercase letter and uppercase letter
    if (newPassword.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) == null) {
        alert("Password needs lowercase and uppercase character");
        return;
    }
    // check password contains special character
    if (newPassword.match(/([!,%,&,@,#,$,^,*,?,_,~])/) == null) {
        alert("Password needs special character");
        return;
    }
    // check password have number
    if (newPassword.match(/([0-9])/) == null) {
        alert("Password needs number");
        return;
    }
    //hash the password using SHA256 algorithm
    const hashPass = CryptoJS.SHA256(newPassword).toString();

    $("#waitingModal-header").text("Changin password. Please wait...")
    $("#waitingModal-body").text("Processing.....")
    $("#waitingModal").modal("show");

    $.ajax({
        type: "POST",
        url: "profile/change/password",
        data: JSON.stringify({ email: email, password: password, newPassword: hashPass }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout: 8000,
    }).then((result) => {
        console.log(result)
        if (result.status == 0) {
            $("#waitingModal-header").text("Something wrong!!!")
            $("#waitingModal-body").text(result.msg);
            return;
        }
        if (result.status == 1) {
            $("#waitingModal-header").text("Done")
            $("#waitingModal-body").text(result.msg);
            Cookies.remove('password');
            Cookies.remove('email');
            alert("Password change is successfull. Now you are redirect to login page")
            window.location.replace("http://127.0.0.1")
            return;
        }
    }).catch((e) => {
        if (e.statusText == 'timeout') {
            $("#waitingModal-header").text("Ops!!! Timeout")
            $("#waitingModal-body").text("Connection with the server interrupted. Please try again");
            return;
        }
    })
}

function logout() {
    document.cookie = "email = ";
    document.cookie = "password = ";
    window.location.replace("http://127.0.0.1")
}