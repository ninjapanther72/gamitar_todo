const ServerUtils = require("./utils/ServerUtils");
const {printLog} = require("./utils/NodeUtils");
const crypto = require('crypto');

const TEST_LOGIN_USERNAME = 'john_doe';
const TEST_LOGIN_USERNAME_PW = 'test';

async function fetchTodoData() {
    const fetchedData = await ServerUtils.fetchTodoList(TEST_LOGIN_USERNAME);
    printLog('fetchTodoData.fetchedData:', fetchedData);
}

async function fetchUserData() {
    const fetchedData = await ServerUtils.fetchUserDataFromDatabase({
        username: TEST_LOGIN_USERNAME,
        password: TEST_LOGIN_USERNAME_PW,
    });
    printLog('fetchUserData.fetchedData:', fetchedData);
}

// fetchTodoData();
// fetchUserData();


// Generate a 256-bit (32-byte) random key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Secret Key:', secretKey);
