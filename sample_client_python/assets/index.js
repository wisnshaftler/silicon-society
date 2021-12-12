let userID = "60831ae4aa3cf3385c451260"
let deviceUUID = "C527A621-7DA8-E011-A4BB-B870F4ABD9BF"
let projectID = "612341bf71c3354900c4d498"
let secretKey = "7d7cd92a9c3055f30f8943b5092abb8e"
let container = document.getElementById("container")
let projectData = "";
let taskName ="";
let  taskID = "";


function pythonCall(data){
    console.log(data)
}

function showDataInPage(data){
    console.log(data)
    $("#container").append("<div>"+data+"</div><br>")
}

function primaryData(_taskName, _taskData, _taskID){
    taskData = _taskData;
    taskID = _taskID
    taskName = _taskName;
}

function processData(){
    try {
        const key = new Buffer(secretKey, 'utf-8');
        const decipher = CryptoJS.createDecipheriv('aes-256-ecb', key, Buffer.from([]));
        let clearText = decipher.update(taskData, 'base64', 'utf8');
        clearText += decipher.final('utf-8')
        console.log(clearText)
        return ({status:1, data: clearText});
    } catch (e) {
        console.log(e)
        return ({status:0, data:"error"})
    }
}

eel.mainLoop()
eel.expose(pythonCall)
eel.expose(processData)
eel.expose(primaryData)
eel.expose(showDataInPage)