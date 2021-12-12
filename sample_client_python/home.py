import requests
import json
import time
import base64
import random
import hashlib

import eel
eel.init('assets')

@eel.expose
def mainLoop():

    while True:
        url = "http://siliconsociety.org/api/v1/task/search"

        payload = json.dumps({
            "projectID": "612341bf71c3354900c4d498",
            "deviceUUID": "C527A621-7DA8-E011-A4BB-B870F4ABD9BF",
            "userID": "60831ae4aa3cf3385c451260"
        })

        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("GET", url, headers=headers, data=payload)

        response = response.json()

        if(response['status'] ==1):
            print(f'\nTotal received Tasks count is {len(response["msg"])}')
            taskName = response['msg'][0]['name']
            taskData = response['msg'][0]['data']
            taskID = response['msg'][0]['taskID']
            
            eel.showDataInPage("Task received")
            eel.primaryData(taskName, taskData, taskID)
            eel.processData()
            break;
        else:
            eel.showDataInPage("No task found. Retry in after 10 sec")
            time.sleep(10)
            continue


eel.start('index.html')