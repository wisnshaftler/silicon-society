const express = require("express");
const mongoClient = require("mongodb").MongoClient;
const path = require("path");
require("dotenv/config");
const dbConnection = require("./dbConnection");
const router = express.Router();
const app = express();
const elogger = require("./logger");
const fileUpload = require("formidable");
const cluster = require("cluster");
const os = require("os");
const numCpu = os.cpus().length;

//handle the JSON
app.use(express.json());
app.use(express.static);

//catch user body reqyest errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        elogger.errorLogger({//loging as error
            data: "Error occures by user request",
            time: new Date(Date.now()),
            error: err
        });
        return res.status(400).send({status: 0, msg:"Error. Please try again later" }); // Bad request
    }
    next();
});

//import create user route
const createUser = require('./routes/create-user');

//import email confirm route
const mailConfirm = require('./routes/mailConfirm');

//import login handling route
const loginRoute = require("./routes/login");

//import profile page handling route
const profileRoute = require("./routes/profile");

//import admin page handling route
const adminRoute = require("./routes/admin");

//import software page for handle the software API requests
const softwareRoute = require("./routes/software");

//import API page for handle client software API requests(v1)
const apiRoute = require("./routes/api");

//use API for degault API communication (v1)
app.use('/api/v1/', apiRoute);

//ause software for default software communication
app.use('/software', softwareRoute);

//use admin for admin works
app.use('/admin', adminRoute);

//use create user when create user request receive
app.use('/create-user', createUser);

//call the route when receive the email confirmation
app.use('/mailConfirm', mailConfirm);

//use login route handle the user logins
app.use('/login', loginRoute);

//use progile router for handle the 
app.use('/profile', profileRoute);

//use web-pages for all clients
app.use('/web-pages/', express.static(path.join(__dirname, '/web-pages')));

//use web-js for all clients
app.use('/web-js/', express.static(path.join(__dirname, '/web-js')));

//use img for all images
app.use('/img', express.static(path.join(__dirname, '/img')));

//use software for all project software download
app.use('/software', express.static(path.join(__dirname, '/soft')));

//use reports forlder for all project report download
app.use('/report', express.static(path.join(__dirname, '/reports')));

//load homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/web-pages', 'home.html'));
});

//404 page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/web-pages', '404.html'));
    return;
});

//handle new login creation

//connect database
dbConnection.connectDB;

//web server runnig port defining
const port = process.env.PORT || 3000;

if(cluster.isMaster){
    for (let i=0; i<numCpu; i++){
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal)=>{
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    })
}else {
    app.listen(port, () => console.log(`server ${process.pid} run in ${port}`));
}

// //start sertver listening
// app.listen(port, () => {
//     console.log('Server running and listening on port ', port);
    
// });
