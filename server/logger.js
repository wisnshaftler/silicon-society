const db = require("./dbConnection").useDB;

//when report the error its capture and insert in to the errorlog collection in DB
const errorLogger = (data) => {
    db().collection('errorLog').insertOne(data)
    .then(result => {
        if(result != null){
            console.log("reported error at " + new Date(Date.now()).toISOString());
        }
    })
    
}

//user change logger
const userLogger = (data) => {
    db().collection('userLog').insertOne(data);
    console.log("Reported user behaviour at " + new Date( Date.now()).toISOString());
}

//user login logger
const loginLogger = (data) =>{
    db().collection('userLogin').insertOne(data);
    console.log("User logging added to Databse " + new Date( Date.now()).toISOString());
}

module.exports = {errorLogger, userLogger, loginLogger};