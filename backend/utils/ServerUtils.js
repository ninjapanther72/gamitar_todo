const {
    DebugModeOn, Constants, TEST_LOGIN_USERNAME, TodoItemKeys,
} = require("../config/ServerConfig");
const {
    getNestedArrIndexValue, checkNullArr, isBoolTrue, checkNullStr, formatDate, getArrLen, getDefJsonValue, boolToBinary, getArrIndexValue, parseInteger, checkNullJson
} = require("./NodeUtils");
const {getGamitarDbCon} = require("./DbConn");

const TAG = "ServerUtils";

const DbConn = getGamitarDbCon();

async function fetchUserDataFromDatabase(username, password, checkPw = true) {
    const fun = 'fetchUserDataFromDatabase:';
    try {
        //fetch user-data with username
        let fetchedData = await fetchDataShortcut(username, password, 'username');
        // log(fun, 'fetchedData:-username ', fetchedData);

        //fetch user-data with email if nothing found with username
        if (!checkNullArr(fetchedData) && checkNullStr(username)) {
            fetchedData = await fetchDataShortcut(username, password, 'email');
            // log(fun, 'fetchedData:-email ', fetchedData);
        }

        //fetch user-data with mobile if nothing found with username or email
        if (!checkNullArr(fetchedData) && checkNullStr(username)) {
            fetchedData = await fetchDataShortcut(username, password, 'mobile');
            // log(fun, 'fetchedData:-mobile ', fetchedData);
        }
        return getArrIndexValue(fetchedData, 0, {});
    } catch (e) {
        logErr(fun, e);
        return {};
    }

    async function fetchDataShortcut(email_username_mob, pw, targetCol) {
        const fetchQry = `select *
                          from user_data
                          where ${targetCol} = '${email_username_mob}'
                              ${isBoolTrue(checkPw) ? ` and password = '${pw}'` : ''};`;
        return await execDbQuery(fetchQry, []);
    }
}

async function resetUserPassword(username, password) {
    const fun = 'resetUserPassword:';
    try {
        //change pw with username
        let pwChanged = await updatePwShortcut(username, password, 'username');
        // log(fun, 'pwChanged:-username ', pwChanged);

        //change pw with email
        if (pwChanged === false) {
            pwChanged = await updatePwShortcut(username, password, 'email');
            // log(fun, 'pwChanged:-email ', pwChanged);
        }

        //change pw with mobile
        if (pwChanged === false) {
            pwChanged = await updatePwShortcut(username, password, 'mobile');
            // log(fun, 'pwChanged:-mobile ', pwChanged);
        }
        return {success: pwChanged, message: pwChanged ? 'Password reset successfully' : "Couldn't reset password!"};
    } catch (e) {
        logErr(fun, e);
        return {};
    }

    async function updatePwShortcut(email_username_mob, pw, targetCol) {
        const updateQry = `update user_data
                           set password="${pw}"
                           where ${targetCol} = "${email_username_mob}"; `;
        const fetchedData = await execDbQuery(updateQry, [0]);
        // log(fun, 'updatePwShortcut.fetchedData:', fetchedData);
        return parseInteger(getDefJsonValue(fetchedData, 'affectedRows')) > 0;
    }
}

async function registerNewUser(reqBody) {
    const fun = 'registerNewUser:';
    try {
        log(fun, 'reqBody:', reqBody);

        const username = getDefJsonValue(reqBody, 'username');
        const email = getDefJsonValue(reqBody, 'email');
        const mobile = getDefJsonValue(reqBody, 'mobile');
        const pw = getDefJsonValue(reqBody, 'password');
        const firstName = getDefJsonValue(reqBody, 'firstName');
        const lastName = getDefJsonValue(reqBody, 'lastName');

        const canProceed = true;
        if (canProceed) {
            let usernameExists = checkNullJson(await fetchUserDataFromDatabase(username, null, false));
            let emailExists = checkNullJson(await fetchUserDataFromDatabase(email, null, false));
            let mobileExists = checkNullJson(await fetchUserDataFromDatabase(mobile, null, false));

            log(fun, 'usernameExists-username:', usernameExists);
            log(fun, 'usernameExists-email:', emailExists);
            log(fun, 'usernameExists-mobile:', mobileExists);

            if (usernameExists) {
                return {message: "Username already exists!", success: false};
            } else if (emailExists) {
                return {message: "Email already exists!", success: false};
            } else if (mobileExists) {
                return {message: "Mobile already exists!", success: false};
            } else {
                const insertQry = `INSERT INTO gamitar_todo_db.user_data
                                       (username, email, password, mobile, first_name, last_name, active, created_date)
                                   VALUES ("${username}", "${email}", "${pw}", '${mobile}', "${firstName}", "${lastName}", 1, '${new Date()}');`;

                const fetchedData = await execDbQuery(insertQry, [0]);
                log(fun, 'fetchedData: ', fetchedData);

                const success = parseInteger(getDefJsonValue(fetchedData, 'affectedRows')) > 0;
                return {
                    message: success ? "Registration successful!" : "Registration failed, please try again", success: success, data: fetchedData
                };
            }
        } else {
            return {message: 'Registration data received (For testing)'};
        }
    } catch (e) {
        logErr(fun, e);
        return e;
    }
}

async function fetchTodoList(username) {
    const fun = 'fetchTodoList:';
    let formattedList = [];
    try {
        const fetchedData = await execDbQuery(`select *
                                               from todo_items
                                               where username = '${username}';`, []);
        // log(fun, 'fetchedData:', fetchedData);
        //format fetchedData
        if (checkNullArr(fetchedData)) {
            for (const element of fetchedData) {
                formattedList.push({
                    //COLUMNS: id, name, description, priority, completed, username, created_date, completed_date, modified_date

                    //         id: 'id',
                    //         taskName: 'task',
                    //         completed: 'completed',
                    //         priority: 'priority',
                    //         description: 'description',
                    //         createdDate: 'createdDate',

                    id: element.id,
                    taskName: element.name,
                    description: element.description,
                    priority: element.priority,
                    completed: isBoolTrue(element.completed, true, true),
                    createdDate: formatDateValue(element.created_date),
                    completedDate: formatDateValue(element.completed_date),
                    modifiedDate: formatDateValue(element.modified_date),
                    username: element.username,
                });
            }
        }
        // log(fun, 'formattedList:', formattedList, 'len:', getArrLen(formattedList));
        return formattedList;
    } catch (e) {
        logErr(fun, e);
    }
    return formattedList;
}

async function addNewTask(reqBody, username) {
    const fun = 'addNewTask:';
    try {
        // log(fun, 'reqBody:', reqBody);
        const Keys = TodoItemKeys;

        const taskItem = getDefJsonValue(reqBody, 'taskItem');
        const taskName = getDefJsonValue(taskItem, Keys.taskName);
        const description = getDefJsonValue(taskItem, Keys.description);
        const priority = getDefJsonValue(taskItem, Keys.priority);
        const completed = 0;
        const createdDate = new Date();

        const addQry = `INSERT INTO todo_items
                            (name, description, priority, completed, username, created_date)
                        VALUES ("${taskName}", "${description}", "${priority}", ${completed}, "${username}", '${createdDate}');`;

        const fetchedData = await execDbQuery(addQry, [0]);
        // log(fun, 'fetchedData: ', fetchedData);
        return fetchedData;
    } catch (e) {
        logErr(fun, e);
        return e;
    }
}

async function deleteTask(reqBody) {
    const fun = 'deleteTask:';
    try {
        // log(fun, 'reqBody:', reqBody);
        const taskId = getDefJsonValue(reqBody, 'id');

        const deleteQry = `DELETE
                           FROM todo_items
                           WHERE id = ${taskId}`;
        const fetchedData = await execDbQuery(deleteQry, [0]);
        // log(fun, 'fetchedData: ', fetchedData);
        return fetchedData;
    } catch (e) {
        logErr(fun, e);
        return e;
    }
}

async function editTaskName(reqBody) {
    const fun = 'editTask:';
    try {
        // log(fun, 'reqBody:', reqBody);
        const taskId = getDefJsonValue(reqBody, 'id');
        const newName = getDefJsonValue(reqBody, 'name');

        const updateQry = `UPDATE todo_items
                           set name="${newName}"
                           where id = ${taskId};`;
        const fetchedData = await execDbQuery(updateQry, [0]);
        // log(fun, 'fetchedData: ', fetchedData);
        return fetchedData;
    } catch (e) {
        logErr(fun, e);
        return e;
    }
}

async function moveTaskToCompleted(reqBody) {
    const fun = 'moveTaskToCompleted:';
    try {
        // log(fun, 'reqBody:', reqBody);
        const taskId = getDefJsonValue(reqBody, 'id');
        const completed = boolToBinary(isBoolTrue(getDefJsonValue(reqBody, 'completed'), true, true));

        const updateQry = `UPDATE todo_items
                           set completed=${completed}
                           where id = ${taskId};`;
        const fetchedData = await execDbQuery(updateQry, [0]);
        // log(fun, 'fetchedData: ', fetchedData);
        return fetchedData;
    } catch (e) {
        logErr(fun, e);
        return e;
    }
}

async function execDbQuery(query, resultNestedIndices = [0], defValue = {}, onFetched, onError) {
    const fun = "execDbQuery";
    if (DebugModeOn) log(fun, "query:", query);
    return new Promise((resolve, reject) => {
        try {
            DbConn.query(query, async (err, resultsX) => {
                if (err) {
                    logErr(fun, "Error:", err);
                    if (onError) onError(err);
                    return resolve(err);
                }
                let results = await resultsX;
                results = getNestedArrIndexValue(results, resultNestedIndices, defValue);
                if (onFetched) onFetched(results);
                return resolve(results);
            });
        } catch (e) {
            logErr(fun, e);
            return resolve(e);
        }
    });
}

function formatDateValue(dateValue, dateFormat = Constants.dateFormat) {
    let date = checkNullStr(dateValue, true) ? formatDate(dateValue, dateFormat) : "";
    return (date + '' === '1970-01-01') ? '' : date;
}

function log(...text) {
    printLog(TAG, ...text);
}

function logErr(...text) {
    printError(TAG, ...text);
}

function printLog(...logs) {
    if (DebugModeOn) console.log(...logs);
}

function printError(...logs) {
    if (DebugModeOn) console.error(...logs);
}

module.exports = {
    fetchUserDataFromDatabase,
    resetUserPassword,
    fetchTodoList,
    addNewTask,
    deleteTask,
    editTaskName,
    moveTaskToCompleted,
    formatDateValue,
    execDbQuery,
    printLog,
    printError,
    registerNewUser,
}
