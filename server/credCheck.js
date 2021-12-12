const mongoClient = require("mongodb").MongoClient;
const joi = require("joi");
const elogger = require("./logger");
require("dotenv/config");

//create schema for login details check
const credentialsSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'biz'] } }).required(),
    password: joi.string().alphanum().min(64).max(64).required(),
});

//const validateCredentials = credentialsSchema.validate({email: req.body.email, password: req.body.password});

async function checkIt(email, password) {
    //validate the email and password
    const validity = await credentialsSchema.validate({ email: email, password: password });

    //return data
    if (validity.error) { return false }

    const client = await mongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true });
    const db = client.db("silicon-society");

    const result = await db.collection('user').find({ email: email, password: password, status: "active", activated: true }).toArray();

    if (result.length == 1) { return true }
    if (result.length != 0) { return result.length }
}

async function getIt(email, password) {

    //validate the email and password
    const validity = await credentialsSchema.validate({ email: email, password: password });

    //return data
    if (validity.error) { return false }

    const client = await mongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true });
    const db = client.db("silicon-society");

    const result = await db.collection('user').find({ email: email, password: password, status: "active" });

    return result.toArray();
}

//-----------------------------------------admin credentials check-----------------------------------------------------
const adminSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'biz'] } })
        .required(),
    password: joi.string()
        .alphanum()
        .min(64)
        .max(64)
        .required(),
})

async function checkAdmin(email, password) {
    try {
        const validity = await adminSchema.validate({ email: email, password: password });
        if (validity.error) { return { status: 0, msg: "Email or password is incorrect" } }

        const client = await mongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true });
        const db = client.db("silicon-society");
        const result = await db.collection('admin').find({ email: email, password: password }).toArray();

        if (result.length == 0) {
            return ({ status: 0, msg: "No account find. Recheck email and password" });
        }
        if (result[0].status == "suspended") {
            return ({ status: 0, msg: "Account is suspended. Please contact admins" });
        }
        if (result[0].status == "active") {
            return ({ status: 1, msg: "Success" })
        }
    } catch (e) {
        elogger.errorLogger({
            data: "Error occures in the checkAdmin function in credCheck.",
            time: new Date(Date.now()),
            error: [e.message, e]
        });
        console.log(e)
        return ({ status: 0, msg: "something wronog please try again" })
    }
}

async function getAdmin(email, password) {
    const validity = await adminSchema.validate({ email: email, password: password });
    if (validity.error) { return { status: 0, msg: "Email or password is incorrect" } }

    const client = await mongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true });
    const db = client.db("silicon-society");
    const result = await db.collection('admin').find({ email: email, password: password }).toArray();
    return (result);
}

module.exports = { getIt, checkIt, checkAdmin, getAdmin };