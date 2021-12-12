const crypto = require('crypto');

function encrypt(_key, text) {
    try{
        text = text.toString("UTF-8")
        const key = Buffer.from(_key, 'utf-8');
        const plaintext = Buffer.from(text, 'utf-8');
        const cipher = crypto.createCipheriv('aes-256-ecb', key, Buffer.from([]));
        let ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
        ciphertext= ciphertext.toString('base64')
        return ({status:1, data: ciphertext});
    }catch(e){
        return ({status:0, data:"error"})
    }
}

function decrypt(_key, text) {
    try {
        const key = Buffer.from(_key, 'utf-8');
        const decipher = crypto.createDecipheriv('aes-256-ecb', key, Buffer.from([]));
        let clearText = decipher.update(text, 'base64', 'utf8');
        clearText += decipher.final('utf-8')
        return ({status:1, data: clearText});
    } catch (e) {
        return ({status:0, data:"error"})
    }
}

module.exports = {encrypt, decrypt}