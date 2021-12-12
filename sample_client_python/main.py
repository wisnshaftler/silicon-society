
import requests
import json
import time
from  Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad
import base64
import random
import hashlib

userID = "60831ae4aa3cf3385c451260"
deviceUUID = "C527A621-7DA8-E011-A4BB-B870F4ABD9BF"
projectID = "612341bf71c3354900c4d498"
secretKey = "7d7cd92a9c3055f30f8943b5092abb8e"

while True:
  #search tasks
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
    print('\nFound task to do')
    print(f'\nTotal received Tasks count is {len(response["msg"])}')
    taskName = response['msg'][0]['name']
    taskData = response['msg'][0]['data']
    taskID = response['msg'][0]['taskID']
  else:
    print('\nNo task found. Retry in after 10 sec')
    time.sleep(10)
    continue

  print("Task received successfully... \n")
  print(f'Task name : {taskName}')
  print(f'Task data (encrypted) : {taskData}')
  print(f'Task id : {taskID}')

  obj = AES.new(secretKey.encode("UTF-8"), AES.MODE_ECB)

  taskDataInBynary = base64.b64decode(taskData)
  plaintext = obj.decrypt(taskDataInBynary)
  plaintext = (str(plaintext,"UTF-8"))
  plaintext = plaintext.replace(plaintext[-1],"")
  
  print(f'Task data (decrypted) : {plaintext}')

  #send to server task is processing
  url = "http://siliconsociety.org/api/v1/task/received"
  
  payload = json.dumps( {
    "projectID":projectID,
    "taskID":taskID,
    "userID":userID
  })

  headers = {
    'Content-Type': 'application/json'
  }

  response = requests.request("PUT", url, headers=headers, data=payload)
  response = response.json()

  if(response['status']==1):
    print("\nTask receiving successfully. Server updated")
    print("\nProcessing Task......")
  else:
    print("Task didnt complete receiving. retrying")
    continue
  
  while True:
    num = random.random()
    text = plaintext+str(num)
    text = text.encode()
    hashValue = hashlib.sha256(text).hexdigest()

    if(hashValue[:2] == "00"):
      print(f'\nHash value {hashValue} found')
      break
    else:
      continue
  
  #send to server task is complete
  url = "http://siliconsociety.org/api/v1/task/complete"
  
  hashValue = bytes(hashValue, encoding="ASCII")
  encrypted = obj.encrypt(pad(hashValue, 32))
  encrypted = base64.b64encode(encrypted).decode("ASCII")

  payload = json.dumps( {
    "projectID":projectID,
    "taskID":taskID,
    "userID":userID,
    "deviceUUID": deviceUUID,
    "data": encrypted
  })

  headers = {
    'Content-Type': 'application/json'
  }

  response = requests.request("PUT", url, headers=headers, data=payload)
  response = response.json()

  if(response['status'] == 1):
    print("\nTask completed. Listening to new tasks")
    continue
  else:
    print("\nCant reach server. Trying again.")
  
  break 
