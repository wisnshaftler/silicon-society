'''
import requests
import json
import time
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import base64

secretKey = "7d7cd92a9c3055f30f8943b5092abb8e"
taskData = "DNiarfTpHRDLGRFWZD4M91MEFGk6Sfdm4h20KBFGTnE="

obj = AES.new(secretKey.encode("UTF-8"), AES.MODE_ECB)

taskDataInBynary = (base64.b64decode(taskData))
print(taskDataInBynary)
plaintext = obj.decrypt(taskDataInBynary)
plaintext = str(plaintext,"UTF-8")
print(len(plaintext))
plaintext = plaintext.replace(plaintext[-1],"")
print(len(plaintext))

text = "asd"
text = bytes(text, encoding="ASCII")
enc = obj.encrypt(pad(text, 32))
enc = base64.b64encode(enc).decode("ASCII")
print(enc)
'''

import hashlib
import random

string = ("a")
num = random.random()

while True:
    num = random.random()
    text = string+str(num)
    text = text.encode()
    hashValue = hashlib.sha256(text).hexdigest()
    
    if (hashValue[:2] == "000"):
        print(hashValue)
        break
    