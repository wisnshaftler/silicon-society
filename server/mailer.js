const nodemailer = require("nodemailer");
require("dotenv/config");
const elogger = require("./logger");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendEmail = (_to, _subject, _body) => {

    const mailOption = {
        from: process.env.MAIL_USER,
        to: _to,
        subject: _subject,
        html: _body
    };

    transporter.sendMail(mailOption)
        .then(info => {
            //console.log(info)
        })
        .catch(error => {
            //console.log(mailOption)
            //console.log(error);
        })
}

/**
 * This function send the email to user
 * @param {String} _to reciver email address
 * @param {String} _subject subject of the email
 * @param {String} _body Body of the email
 * @param {String} reason Reason of the email sending
 */
async function adminSendMail(_to, _subject, _body, _attachment,  reason = '') {

    const mailOption = {
        from: process.env.MAIL_USER,
        to: _to,
        subject: _subject,
        html: _body
    };
    try {
        transporter.sendMail(mailOption)
            .then(result => {
                console.log(result)
                return (result)
            })
            .catch(e => {
                elogger.errorLogger({
                    data: "Error occures in the adminSendMail function in mailer js. While sending email to " + _to + " reason for the mail is  " + reason,
                    time: new Date(Date.now()),
                    error: e.message
                });
            })
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the adminSendMail function in mailer js.",
            time: new Date(Date.now()),
            error: e.message
        });
    }
}

module.exports = { sendEmail, adminSendMail };