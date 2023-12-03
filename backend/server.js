const process = require('node:process');

const express = require("express");
require("dotenv").config({path: ".env"});
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {getGamitarDbCon} = require("./utils/DbConn");
const session = require('express-session');
const {
    ReqUrls,
    Messages,
} = require("./config/ServerConfig");
const {
    getDefJsonValue, getNestedArrIndexValue, parseInteger, checkNullJson, sendResponse, checkNullStr,
} = require("./utils/NodeUtils");
const {
    printLog, printError,
} = require("./utils/ServerUtils");
const ServerUtils = require("./utils/ServerUtils");
const SERVER_PORT = process.env.BACKEND_PORT;

const INTERNAL_SERVER_ERR_MSG = Messages.serverErrorMsg;
const FETCH_SUCCESS_MSG = Messages.fetchSuccessMsg;
const FETCH_ERROR_MSG = Messages.fetchErrMsg;
const UPLOAD_SUCCESS_MSG = Messages.uploadSuccessMsg;
const UPLOAD_ERROR_MSG = Messages.uploadErrMsg;
const RECORD_DELETE_SUCCESS_MSG = Messages.recordDeleteSuccessMsg;
const RECORD_DELETE_ERROR_MSG = Messages.recordDeleteErrorMsg;

const TAG = "Server.js";


const server = express();

// Enable CORS for all routes
server.use(cors({
    // origin: true
    origin: process.env.FRONTEND_ORIGIN_URL, // Replace with the actual origin of your React app
    credentials: true,
}));

// Parse request of content-type-application/x-www-form-urlencoded
server.use(bodyParser.json({limit: "50mb"}));
server.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000, //limit: To avoid PayloadTooLargeError
}));

server.use(cookieParser());


//------------------------------------session management start------------------------------------
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY;
// const SESSION_EXPIRE_TIME = process.env.SESSION_EXPIRE_TIME;
const SESSION_EXPIRE_TIME = 100000;

// Use the express-session middleware
server.use(
    session({
        secret: SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}, // Set secure to true if using HTTPS
    })
);

function verifyAuthToken(req, res, next) {
    // log('verifyAuthToken.req:', req);
    // log('verifyAuthToken.req.headers:', req.headers);
    // const {authToken} = req.cookies || req.headers.Authorization;
    try {
        const authToken = req.headers.authorization;
        // log('verifyAuthToken.authToken:', authToken);
        if (checkNullStr(authToken)) {
            // Verify the token
            jwt.verify(authToken, SESSION_SECRET_KEY, (err, decoded) => {
                if (err) {
                    // log('verifyAuthToken.err:', err);
                    return res.send({message: 'Authentication failed! Please try again :(', success: false});
                } else {
                    // Token is valid, save user ID to request object for later use
                    req.userId = decoded.id;
                    req.userData = decoded.userData;
                    req.loginSuccess = checkNullJson(decoded.userData);
                    // log('verifyAuthToken.decoded.id:', decoded.id);
                    next();
                }
            });
        } else {
            return res.send({message: 'Session expired, please login again!', success: false});
        }
    } catch (e) {
        logErr(e)
        return res.send({message: 'Authentication failed! Please try again :(', success: false});
    }
}

async function checkIfLoginUserValid(fetchedUserData, reqPw) {
    const fun = 'checkIfLoginUserValid:';
    return new Promise(function (resolve, reject) {
        const fetchedDbPw = getDefJsonValue(fetchedUserData, 'password');
        // log(fun, 'reqPw:', reqPw, 'fetchedDbPw:', fetchedDbPw);
        // log(fun, 'password-MATCH', fetchedDbPw == reqPw);

        // if (checkNullJson(fetchedUserData) && bcrypt.compareSync(password, fetchedDbPw)) {
        if (checkNullJson(fetchedUserData) && reqPw == fetchedDbPw) {
            try {
                // token is created and shared with the client
                const token = jwt.sign({id: getDefJsonValue(fetchedUserData, 'id'), userData: fetchedUserData}, SESSION_SECRET_KEY, {
                    expiresIn: SESSION_EXPIRE_TIME
                });

                // return the information including token as JSON
                resolve({message: 'Successfully logged-in!', success: true, data: {token: token, userData: fetchedUserData}});
            } catch (e) {
                logErr(fun, e);
                resolve({message: 'Login failed!', success: false, error: e, data: {token: null, userData: null}});
            }
        } else {
            resolve({message: 'Invalid credentials!', success: false, data: {token: null, userData: null}});
        }
    })
}

//login-request
const loginReqUrl = ReqUrls.login;
server.post(loginReqUrl, async (req, res) => {
    const {username, password} = req.body;
    const fun = 'loginReqUrl:';
    log(fun, `Request received on: ${loginReqUrl}`);
    log(fun, 'req.body:', req.body);

    try {
        const fetchedUserData = await ServerUtils.fetchUserDataFromDatabase(username, password);
        const validationData = await checkIfLoginUserValid(fetchedUserData, password);
        // log(fun, 'fetchUserDataFromDatabase.fetchedUserData:', fetchedUserData);
        // log(fun, 'checkIfLoginUserValid.validationData:', validationData);
        sendResponse({res: res, msg: validationData.message, success: validationData.success, data: validationData.data});
    } catch (e) {
        logErr(fun, e);
        sendResponse({res: res, msg: 'Login failed!', success: false, error: e, data: {token: null}});
    }
});


// Apply middleware to all routes
// server.use(verifyAuthToken);

// Apply checkIfUserLoggedIn middleware only to routes that require authentication
// server.post('/protected', verifyAuthToken, checkIfUserLoggedIn, (req, res) => {
// server.post('/protected', checkIfUserLoggedIn, (req, res) => {
server.post('/protected', verifyAuthToken, (req, res) => {
    res.status(200).send('You are successfully logged in!');
});
server.post(ReqUrls.checkLoginAvailable, verifyAuthToken, (req, res) => {
    log(`Requests received on 'checkLogin'`);
    const success = checkNullJson(req.userData);
    res.send({success: success, message: success ? 'Login available' : 'Session expired, please login again'});
});

// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({message: 'Internal Server Error'});
});
//------------------------------------session management end--------------------------------------
//user-email-exists
const forgotUserPw_EmailExistCheckReqUrl = ReqUrls.forgotUserPw_EmailExistCheck;
server.post(forgotUserPw_EmailExistCheckReqUrl, async (req, res) => {
    const fun = 'forgotUserPw_EmailExistCheckReqUrl:';
    log(fun, `Request received on: ${forgotUserPw_EmailExistCheckReqUrl}`);
    try {
        const fetchedUserData = await ServerUtils.fetchUserDataFromDatabase(req.body.email || req.body.username, null, false);
        log(fun, 'fetchedUserData:', fetchedUserData);
        const success = checkNullJson(fetchedUserData);
        res.json({data: fetchedUserData, message: success ? 'User exists' : "User doesn't exist!", success: success});
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});

//reset-user-pw
const forgotUserPw_ResetPwReqUrl = ReqUrls.forgotUserPw_ResetPw;
server.post(forgotUserPw_ResetPwReqUrl, async (req, res) => {
    const fun = 'forgotUserPw_ResetPwReqUrl: ';
    log(fun, `Request received on: ${forgotUserPw_ResetPwReqUrl}`);
    try {
        log(fun, 'req.body:', req.body);
        const fetchedData = await ServerUtils.resetUserPassword(req.body.username, req.body.password);
        log(fun, 'resetUserPassword.fetchedData:', fetchedData);
        res.json(fetchedData);
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});

//registerUser
const registerUserReqUrl = ReqUrls.registerUser;
server.post(registerUserReqUrl, async (req, res) => {
    const fun = 'registerUserReqUrl: ';
    log(fun, `Request received on: ${registerUserReqUrl}`);
    try {
        const fetchedData = await ServerUtils.registerNewUser(req.body);
        log(fun, 'registerNewUser.fetchedData:', fetchedData);
        res.json(fetchedData);
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});

//fetch todo-list
const fetchTodoListReqUrl = ReqUrls.fetchTodoList;
server.get(fetchTodoListReqUrl, verifyAuthToken, async (req, res) => {
    const fun = 'fetchTodoListReqUrl:';
    log(fun, `Request received on: ${fetchTodoListReqUrl}`);
    try {
        // const {email, username, mobile} = req.session.userData;
        const {username} = req.userData;
        // log(fun, 'req.userData:', req.userData);

        const fetchedData = await ServerUtils.fetchTodoList(username);
        res.json({data: fetchedData, message: FETCH_SUCCESS_MSG, success: true});
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});

//add todo-item
const todoItemAddTaskReqUrl = ReqUrls.todoItem_AddTask;
server.post(todoItemAddTaskReqUrl, verifyAuthToken, async (req, res) => {
    const fun = 'todoItemAddTaskReqUrl:';
    log(fun, `Request received on: ${todoItemAddTaskReqUrl}`);
    try {
        const {username} = req.userData;
        log(fun, 'req.userData:', req.userData);

        const fetchedData = await ServerUtils.addNewTask(req.body, username);
        log(fun, 'fetchedData:', fetchedData);
        const success = parseInteger(getDefJsonValue(fetchedData, 'affectedRows')) > 0;
        res.json({data: fetchedData, message: success ? UPLOAD_SUCCESS_MSG : UPLOAD_ERROR_MSG, success: success});
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});

//edit todo-item
const todoItem_EditTaskReqUrl = ReqUrls.todoItem_EditTask;
server.post(todoItem_EditTaskReqUrl, verifyAuthToken, async (req, res) => {
    const fun = 'todoItem_EditTaskReqUrl:';
    log(fun, `Request received on: ${todoItem_EditTaskReqUrl}`);
    try {
        const fetchedData = await ServerUtils.editTaskName(req.body);
        log(fun, 'fetchedData:', fetchedData);
        const success = parseInteger(getDefJsonValue(fetchedData, 'affectedRows')) > 0;
        res.json({data: fetchedData, message: success ? UPLOAD_SUCCESS_MSG : UPLOAD_ERROR_MSG, success: success});
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});

//edit todo-item
const todoItem_moveTaskToCompletedReqUrl = ReqUrls.todoItem_moveTaskToCompleted;
server.post(todoItem_moveTaskToCompletedReqUrl, verifyAuthToken, async (req, res) => {
    const fun = 'todoItem_moveTaskToCompletedReqUrl:';
    log(fun, `Request received on: ${todoItem_moveTaskToCompletedReqUrl}`);
    try {
        const fetchedData = await ServerUtils.moveTaskToCompleted(req.body);
        log(fun, 'fetchedData:', fetchedData);
        const success = parseInteger(getDefJsonValue(fetchedData, 'affectedRows')) > 0;
        res.json({data: fetchedData, message: success ? UPLOAD_SUCCESS_MSG : UPLOAD_ERROR_MSG, success: success});
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});

//delete todo-item
const todoItem_deleteTaskReqUrl = ReqUrls.todoItem_deleteTask;
server.post(todoItem_deleteTaskReqUrl, verifyAuthToken, async (req, res) => {
    const fun = 'todoItem_deleteTaskReqUrl:';
    log(fun, `Request received on: ${todoItem_deleteTaskReqUrl}`);
    try {
        const fetchedData = await ServerUtils.deleteTask(req.body);
        log(fun, 'fetchedData:', fetchedData);
        const success = parseInteger(getDefJsonValue(fetchedData, 'affectedRows')) > 0;
        res.json({data: fetchedData, message: success ? RECORD_DELETE_SUCCESS_MSG : RECORD_DELETE_ERROR_MSG, success: success});
        log(fun, 'Data sent successfully');
    } catch (e) {
        logErr(fun, e);
        res.json({message: INTERNAL_SERVER_ERR_MSG, success: false, error: e});
    }
});


function log(...text) {
    printLog(TAG, ...text);
}

function logErr(...text) {
    printError(TAG, ...text);
}

server.listen(SERVER_PORT, () => {
    printLog(TAG, `Server is running on ${SERVER_PORT}`);
});
