const mongoClient = require("mongodb").MongoClient; // to handle the database
const app = require('./index'); //to stop the server if get error
require("dotenv/config"); //require this for get the .env file variables

//create variable for store the DB connections
var db;
//create database connection
const connectDB = mongoClient.connect(process.env.DB_CONNECTION,
    { useUnifiedTopology: true }, //server discover monitor engine enable
    function (error, _db){
        console.log("connected to db");
        db= _db.db("silicon-society"); ;
    }
);
const useDB = () => db; // return the db object value to the useDB function

const disconnectDB = () => db.close() //retutn the db.close() function to the discountDB function

module.exports = {connectDB, useDB, disconnectDB} // export the three functions 