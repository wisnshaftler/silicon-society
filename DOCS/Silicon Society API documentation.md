# Silicon Society

This is REST API documentation of the silicon society platform. This API requires to work with the your project client application development. We are provide sample codes and structure in this documentation.
Using this API you have to send device UUID, user ID like required fields. You can find those in the `C:\silicon_society\defaultData.json` path.

**All the server sending task data and user sending task result and task data are encrypted using the project creators secret key. This secret key needs to use in client side for decrypt and get actual data. All cipher text needs to in base64 format. Encryption algorithm is AES-256-ECB**

In this API, developer needs to know client side users (person who contributed to your project) device located in C:\silicon_society\defaultData.json . This JSON file contains, device UUID, device owners ID, and device owners email address. Sample JSON file is here.

```json
{
  "user_id": "00031ae4aa3cf3385c451111",
  "user_email": "testing@cilisonsociety.com",
  "UUID": "C527A621-7DA8-E011-A4BB-B870F4ABD9B4"
}
```



#### <u>Get available tasks</u>

GET /api/v1/task/search/

Parameters
`projectID`  -  |*String*|	contains project ID.
`deviceUUID` - |*String*|	contains device UUID.
`userID` - |*String*| 	Contains user ID.

sample JSON request data.

```json
{
    "projectID": "6127950f0ebbc2328c22c49f",
    "deviceUUID": "C527A621-7DA8-E011-A4BB-B870F4ABD9BF",
    "userID": "60831ae4aa3cf3385c451260"
}
```

sample python request

```python
import requests
import json

url = "siliconsociety.org/api/v1/search/task/"

payload = json.dumps({
  "projectID": "6127950f0ebbc2328c22c49f",
  "deviceUUID": "C527A621-7DA8-E011-A4BB-B870F4ABD9BF",
  "userID": "60831ae4aa3cf3385c451260"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

```

<u>Sample Responses</u>
		*If Error*

```json
{
    "status": 0,
    "errorCode": 1,
    "msg": "Primary data incomplete"
}
```

​		*If Success* 

```json
{
    "status": 1,
    "msg": [
        {
            "name": "testing API task",
            "method": "0",
            "data": "DNiarfTpHRDLGRFWZD4M91MEFGk6Sfdm4h20KBFGTnE=",
            "addedTime": "2021-08-23T06:52:16.502Z",
            "taskID": "612345a0a28b853ad0c1eb85"
        }
    ]
}
```

​	

<u>Responses</u>
`Error Code` : 1 - Required fields are not correct.
`Error Code` : 2 - Device cannot find.
`Error Code` : 3 - Requested project is not contributed by this device
`Error Code` : 4 - This project is not active
`Error Code` : 5 - There are no task to do

`Success` : JSON object with task name, id, method, data, addedTime

After receiving the task, user must needs to send the project successfully received message.

#### Set Task received successfully

PUT /api/v1/task/received

Parameters
`projectID` - |*String*| Project ID
`taskID` - |*String*| Task ID

Sample JSON request data

```json
{
    "projectID": "612341bf71c3354900c4d498",
    "taskID": "612345a0a28b853ad0c1eb85"
}
```

sample python request

```python
import requests
import json

url = "siliconsociety.org/127.0.0.1/api/v1/task/received"

payload = json.dumps({
  "projectID": "612341bf71c3354900c4d498",
  "taskID": "612345a0a28b853ad0c1eb85"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("PUT", url, headers=headers, data=payload)

print(response.text)

```

<u>Sample Response</u>
		If error

```json
{
    "status": 0,
    "errorCode": 1,
    "msg": "Data is invalid"
}
```

​		If success

```json
{
    "status": 1,
    "msg": "Done"
}
```

<u>Responses</u>
`ErrorCode` : 1 - Invalid data
`ErrorCode` : 2 - Requested project is not active
`ErrorCode` : 3 - Requested task is not found
`ErrorCode` : 4 - Requested task already utilizing

`Success` : JSON object with status and msg

After that client device process the requested data and create the output. In here, you can send the output data to server. Make sure you encrypt all the task processed data (task result) using your own encryption key (which mean SiliconSociety given secret key) and make output encoded to **base64** format. Also, you can use user private encryption key and encrypt task data first and generated cyperdata encrypt using SiliconSociety  given secret key and send to the server.

#### Task successfully finished

PUT /api/v1/task/complete

parameters
`projectID` : |*String*| The project ID
`taskID` : |*String*| The completed task ID
`userID` : |*String*| The user completed the task (You can find the user ID in ‪C:\silicon_society\defaultData.json file in users computer )
`deviceUUID` : |*String*| The device UUID
`data` : |*String*| Task output (result) data.

Sample JSON request data

```json
{
    "projectID": "000341bf71c3354900c4d111",
    "taskID": "6r2d45t0a2tcb853ad0c1e111",
    "userID": "1231ae4aa3cf3385c451999",
    "deviceUUID": "002dAd2r1-7DA8-E011-A4BB-B870F4ABD9B5",
    "data": "c2FtcGxlCg=="
}
```

Sample Python request 

```python
import requests
import json

url = "siliconsociety.org/api/v1/task/complete"

payload = json.dumps({
  "projectID": "000341bf71c3354900c4d111",
  "taskID": "6r2d45t0a2tcb853ad0c1e111",
  "userID": "1231ae4aa3cf3385c451999",
  "deviceUUID": "002dAd2r1-7DA8-E011-A4BB-B870F4ABD9B5",
  "data": "c2FtcGxlCg=="
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("PUT", url, headers=headers, data=payload)

print(response.text)

```

<u>Sample Responses</u>
			If error 

```json
{
    "status": 0,
    "errorCode": 1,
    "msg": "Data is invalid"
}
```

​			If Success

```json
{
    "status": 1,
    "msg": "Done"
}
```

*Responses*
`ErrorCode` : 1 - Request data is invalid
`ErrorCode` : 2 - Project is not active
`ErrorCode` : 3 - Task cant find (Probably task id is invalid)
`ErrorCode` : 4 - The device that used to process the task cant find

`Success` : JSON object with status code = 1 and message.

Also, project owner can create task using API.

#### Create Task

POST /api/v1/task/create

<u>Parameters</u>
`projectID` : |*String*| Project ID (Required)
`taskName` : |*String*| Task Name. Must start with letter, maximum 20 characters (Required)
`userID` : |*String*| Project owner's ID (Required)
`data` : |*String*| Task primary data (the data that needs to process) (Required)
`taskMethod` : |*int*| Task method (same as the web portal) 0 for all devices, 1 for first getting device, 2 for targeted device(s) (Required)
`targetDevice` : |*String*| If this task is for targeted device or devices this field is required. This contains the device ID. Other vice this is not required. If there are more than one device, needs to separate deviceID using comma.

Sample JSON request

```json
{
    "projectID": "612341bf71c3354900c4d498",
    "taskName": "l12345a0a28",
    "userID": "6120cc5f4e1f3f21d039ddb4",
    "data": "13",
    "taskMethod" :"0",
    "targetDevice": "61274e6e73a8192e5c061502"
}
```

Sample python request

```python
import requests
import json

url = "siliconsociety.org/api/v1/task/create"

payload = json.dumps({
  "projectID": "612341bf71c3354900c4d498  ",
  "taskName": "l12345a0a28",
  "userID": "6120cc5f4e1f3f21d039ddb4",
  "data": "13",
  "taskMethod": "0",
  "targetDevice": "61274e6e73a8192e5c061502"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```

<u>Sample response</u>
		If error

```json
{
    "status": 0,
    "errorCode": 1,
    "msg": "Data is invalid"
}
```

​		If success

```json
{
    "status": 1,
    "msg": "Created"
}
```

*Responses*
`errorCode` : 1 - Request contains data is invalid
`errorCode` : 2 - Project is not authorized
`errorCode` : 3 - Requested device is not contributed to requested project

`Success` - Status code 1 with message

#### Find the device ID using UUID

GET /api/v1/device/search/deviceid

`uuid` : |*String*| Device UUID

Sample JSON request

```json
{
    "uuid":"C527A621-7DA8-E011-A4BB-B870F4ABD95F"
}
```

Sample python request

```python
import requests
import json

url = "siliconsociety.org/api/v1/device/search/deviceid"

payload = json.dumps({
  "uuid": "C527A621-7DA8-E011-A4BB-B870F4ABD9BF"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

```

Sample response
		If error

```json
{
    "status": 0,
    "errorCode": 1,
    "msg": "Request is not valid"
}
```

​		If success

```json
{
    "status": 1,
    "data": "61274e6e73a8192e5c061502"
}
```

*Responses*
`errorCode` : 1 - Request is not valid
`errorCode` : 2 - Cant find the device

`success` - status code is 1 with the data field contains the device ID

***<u>End of version 1 API.</u>***

