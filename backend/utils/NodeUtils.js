const fs = require('fs');
const mysql = require("mysql");
const path = require("path");
const moment = require("moment/moment");//npm i moment --legacy-peer-deps
// const {PDFDocument} = require('pdf-lib');
const {Blob} = require('buffer');

// const csv = require("csv-parser");
const DebugModeOn = true;
const TAG = "NodeUtils";

function printLog(...logs) {
    if (DebugModeOn) console.log(TAG, ...logs);
}

function printError(...logs) {
    if (DebugModeOn) console.error(TAG, ...logs);
}


/**
 * Creates an SQL connection.
 */
function createMySQLConnection({
                                   host = "", user = "", password = "", database = "", port = "", debug = false
                               }) {
    return mysql.createConnection({
        host: host, user: user, password: password, database: database, port: port, debug: debug
    });
}

function fileExistsSync(file) {
    return fs.existsSync(file)
}

/** Read CSV column data and returns it in the following json format:-
 *
 * <pre>
 *     [//rows
 *      {//row1
 *          column1: 'column1 data',
 *          column2: 'column2 data',
 *          column3: 'column3 data'
 *      },
 *      {//row2
 *          column1: 'column1 data',
 *          column2: 'column2 data',
 *          column3: 'column3 data'
 *      }
 *    ]
 * </pre>
 *
 * NOTE: Error data can be retrieved by using "error" key from
 * the return data if any error occurs.
 *
 * @param csvFile CSV file to be read.
 * @param delimiter The delimiter option defaults to a comma (,).
 *              If the data from the file you’re trying to parse uses some other delimiter
 *              like a semicolon (;), or a pipe, you can specify that with this option.
 */
const readCSV = ({csvFile}) => {
    if (fileExistsSync(csvFile)) {
        try {
            let csvRecords = []

            const csvParser = require('csv-parser');
            fs.createReadStream(csvFile)
                .on('error', (err) => {
                    return {"ParsingError": err + ""}
                })
                .pipe(csvParser())
                .on('data', (row) => {
                    // printLog("row: ", row)
                    csvRecords.push(row)
                })
                .on('end', () => {
                    // handle end of CSV
                })
            return csvRecords
        } catch (e) {
            return {"error": "ReadError: Error occurred while reading CSV file. Cause: " + e}
        }
    } else {
        return {"error": "FileNotExists: File '" + csvFile + "' doesn't exist."}
    }
}


function getDirFiles(dir, ext = "", fullPath = true, onlyExisting = false) {
    let files = fs.readdirSync(dir);
    let outFiles = files;
    if (checkNull(ext, "")) {
        outFiles = files.filter(file => path.extname(file) === ext);
    } else {
        outFiles = files;
    }
    if (isBoolTrue(fullPath)) {
        const tempFiles = [];
        for (let i = 0; i < outFiles.length; i++) {
            let filePath = path.join(dir, outFiles[i]);
            if (isBoolTrue(onlyExisting) && fileExistsSync(filePath)) {
                tempFiles.push(filePath);
            } else {
                tempFiles.push(filePath);
            }
        }
        outFiles = tempFiles;
    }
    return outFiles;
}

function getDir(currDir = __dirname, dirName) {
    return path.join(currDir, dirName);

}

function getCurrDirFile(currDir = __dirname, subDir, subDirFile) {
    return path.join(currDir, subDir, subDirFile);

}

function readCurrDirJsonFile(currDir = __dirname, subDir, subDirFileToRead, readAsync = true) {
    const filePath = path.join(currDir, subDir, subDirFileToRead);
    return readJsonFile(filePath, readAsync);
}

function readCurrDirFile(currDir = __dirname, subDir, subDirFileToRead, readAsync = true) {
    const filePath = path.join(currDir, subDir, subDirFileToRead);
    return readFile(filePath, readAsync);
}

/**
 * Read a json file.
 *
 * @param {*} jsonFile Json file to read.
 * @param {*} encoding Type of the encoding to use when reading the file.
 * @returns Returns a JSON object containing the contents of the file
 */
function readJsonFile(jsonFile, readAsync = false, encoding = "utf-8") {
    let outData = {};
    // try {
    let data = fs.readFileSync(jsonFile, encoding);
    // data = data.replace(/^\uFEFF/, ''); // Remove BOM if present
    outData = JSON.parse(data);
    // } catch (e) {
    //     printError(TAG, e);
    //     outData = {};
    // }
    return outData;
}

async function readJsonFileAsync(jsonFile, encoding = "utf-8") {
    return new Promise((resolve, reject) => {
        fs.readFile(jsonFile, (err, data) => {
            if (err) {
                printError(TAG, 'readJsonFileAsync', err);
                return reject(err);
            }
            let outData = data;
            outData = JSON.parse(data);
            return resolve(outData);
        });
    });
}

/**
 * Read a text file.
 *
 * @param {*} file Json file to read.
 * @param {*} readAsync Whether to read the file asynchronously or synchronously.
 * @param {*} encoding Type of the encoding to use when reading the file.
 * @returns Returns a JSON object containing the contents of the file
 */
function readFile(file, readAsync = false, encoding = "utf-8") {
    let outData = {};
    if (readAsync) {
        const data = fs.readFileSync(file, encoding);
        outData = data;
        printLog(data);
    } else {
        fs.readFile(file, (err, data) => {
            if (err) throw err;
            outData = data;
        });
    }
    return outData;
}

/**
 * Read file to an array of lines.
 *
 * @param file File to read
 * @param printData If set true, it'l console data.
 */
function readFileToArr({file, printData = false}) {
    let outData = []

    const fs = require('fs')
    const eventStream = require('event-stream')

    const pipe = fs.createReadStream(file)
        .pipe(eventStream.split())
        .pipe(eventStream.mapSync(function (line) {
            //pause the readstream
            pipe.pause();
            // if (printData === true || printData === "true") printLog("readFile.line:", line);
            outData.push("\n" + line);
            pipe.resume();
        })
            .on('error', function (err) {
                //printLog('Error:', err);
                return err
            })
            .on('end', function () {
                // printLog('Finish reading.');
            }));
    return outData
}

function writeFile({file, data, append = false, newLine = true, options = "utf8", create = true, sync = false}) {
    if (create === true) {
        createFile({file: file})
    }

    if (append === true || append === "true") {
        fs.readFile(file, options, (err, readData) => {
            if (err) throw err;
            writeSimpleStringInFile({file: file, data: readData + ((newLine === true || newLine === "true") ? "\n" : "") + data, sync: sync})
        });
    } else {
        writeSimpleStringInFile({file: file, data: data, sync: sync})
    }

}

function writeSimpleStringInFile({file, data = '', sync = false}) {
    if (isBoolTrue(sync)) {
        fs.writeFileSync(file, data, err => {
            if (err) {
                printError(err)
                return err
            } else {
                return true
            }
        })
    } else {
        fs.writeFile(file, data, err => {
            if (err) {
                printError(err)
                return err
            } else {
                return true
            }
        })
    }
}

async function writeFileAsync({file, data}) {
    try {
        await fs.writeFile(file, data, err => {
            if (err) {
                printError(err);
                return err
            } else {
                return true
            }
        })
    } catch (e) {
        printError(TAG, 'Error writing file:', file, 'error:', e);
    }
}

function createFile({file, mode = 'w'}) {
    fs.open(file, mode, (err, file) => {
        if (err) {
            return err;
        } else {
            printLog('Saved!');
            return file
        }
    });
}

function appendFile({file, data}) {
    fs.appendFile(file, data, (err) => {
        if (err) {
            throw err;
            // return err;
        } else {
            printLog('Saved!');
            return file
        }
    });
}

/**Returns file dir path.
 *
 * Example:
 * <pre>
 *     const file="D:\some\where\file.txt"
 *     output: D:\some\where
 * </pre>
 * */
function getFileDir(filePath) {
    return path.dirname(filePath)
}

/**Returns file dir name only.
 *
 * Example:
 * <pre>
 *     const file="D:\some\where\file.txt"
 *     output: where
 * </pre>
 * */
function getFileDirName({filePath}) {
    return path.basename(path.dirname(filePath))
}

/**Returns file name with extension.*/
function getFileName(file) {
    return path.parse(file).base
}

/**Returns file extension.*/
function getFileExt(file) {
    return path.parse(file).ext
}

function renameFilesWithPrefix(files, prefix = "") {
    if (checkNullArr(files)) {
        if (checkNull(prefix, "")) {
            files.forEach(file => {
                const filePath = path.parse(file);
                const newFilePath = path.join(filePath.dir, prefix + filePath.base);

                fs.renameSync(file, newFilePath);
                printLog(`${file} has been renamed to ${newFilePath}`);
            });
        }
    } else {
        printError("Specified 'files' is not an array: ", files);
    }
}

function renameFilesWithPostfix(files, postfix = "") {
    if (checkNullArr(files)) {
        if (checkNull(postfix, "")) {
            files.forEach(file => {
                const {dir, name, ext} = path.parse(file);
                const newFilePath = `${name}${postfix}${ext}`;
                fs.renameSync(file, path.join(dir, newFilePath));
                printLog(`${file} has been renamed to ${newFilePath}`);
            });
        }
    } else {
        printError("Specified 'files' is not an array: ", files);
    }
}

function renameFiles(files, prefix = "", postfix = "") {
    if (checkNullArr(files)) {
        files.forEach(file => {
            const {dir, name, ext} = path.parse(file);
            const newFileName = `${prefix}${name}${postfix}${ext}`;
            const newFilePath = path.join(dir, newFileName);
            fs.renameSync(file, newFilePath);
            printLog(`${file} has been renamed to ${newFilePath}`);
        });
    } else {
        printError("Specified 'files' is not an array: ", files);
    }
}

function renameFilesWithReplace(files, replace = "", replaceWith = "") {
    if (checkNullArr(files)) {
        if (checkNull(replace, "")) {
            files.forEach(file => {
                const {dir, name, ext} = path.parse(file);
                const newFileName = `${name}${ext}`.replaceAll(replace, replaceWith);
                const newFilePath = path.join(dir, newFileName);
                fs.renameSync(file, newFilePath);
                printLog(`${file} has been renamed to ${newFilePath}`);
            });
        }
    } else {
        printError("Specified 'files' is not an array: ", files);
    }
}

function sendResponseOnNullField({res, field, value, print = true}) {
    if (!checkNull(value)) {
        const msg = `${field} cannot be empty`;
        if (checkNull(res, "")) {
            const resMsg = {
                message: msg
            };
            res.send(resMsg)
        }
        if (isBoolTrue(print)) {
            printError(msg);
        }
        return false;
    } else {
        return true;
    }
}

function sendResponse({res, msg, success = undefined, errorMsg = null, data = null, print = true, code = null}) {
    var resMsg = {}
    if (checkNull(res, "")) {
        // resMsg = { message: msg };
        resMsg = {message: !isStr(msg) ? jsonToStr(msg) : msg};
        if (isBoolTrue(success) || !isBoolTrue(success)) {
            resMsg['success'] = success;
        }
        if (checkNullStr(code)) {
            resMsg['code'] = code;
        }
        if (checkNull(data, "")) {
            resMsg['data'] = data;
        }
        if (checkNull(errorMsg, "")) {
            resMsg['error'] = errorMsg;
        }
        (checkNullStr(code)) ? res.status(code).send(resMsg) : res.send(resMsg)
    }
    if (isBoolTrue(print)) {
        checkNull(errorMsg) ? printError("sendResponse()", errorMsg) : printLog("sendResponse()", resMsg);
    }
}

function sendErrResponse({res, msg, error, msgKey = "message", print = true}) {
    const resMsg = {};
    resMsg[msgKey] = msg;
    if (checkNull(res)) res.send(resMsg);
    if (isBoolTrue(print)) printError(error);
}

function sendResponseOnEmptyField({res, fieldName, fieldData, check = "empty", success = undefined, print = true, code = null}) {
    if (checkNull(res) && !checkNull(fieldData, "")) {
        const resMsg = {};
        resMsg['message'] = `${fieldName} cannot be ${check}`;
        if (isBoolTrue(success) || !isBoolTrue(success)) {
            resMsg['success'] = success;
        }
        if (checkNullStr(code)) {
            resMsg['code'] = code;
        }
        (checkNullStr(code)) ? res.status(code).send(resMsg) : res.send(resMsg)
    }
    if (isBoolTrue(print)) printError(`${fieldName} cannot be ${check} `)
    // if (checkNull(res)) res.send(fieldName + " cannot be " + check + " (" + fieldName + ":" + fieldData + ")")
    // if (isBoolTrue(print )) printLog(fieldName + " cannot be " + check + " (" + fieldName + ":" + fieldData + ")")
}

/**
 * Sends an error message using specified `res` object if the field/s is/are empty.
 * Returns true if the field/s is/are not empty and false otherwise.
 */
function sendResponseOnEmptyFields({res, fieldNames = [], fieldValues = [], success = false, print = true, code = null}) {
    var ok = false;
    if (checkNullArr(fieldNames)) {
        for (var i = 0; i < fieldNames.length; i++) {
            const fieldName = fieldNames[i];
            const fieldValue = fieldValues[i];
            if (checkNullStr(fieldValue)) {
                ok = true;
            } else {
                ok = false;
                sendResponseOnEmptyField({
                    res: res, fieldName: fieldName, fieldValue: fieldValue, check: "empty", success: !success, print: false, code: code
                });
                break;
            }
        }
        if (isBoolTrue(print)) printLog(transformListsIntoJson(fieldNames, fieldValues))
    }
    return ok;
}


/**
 * Sends an error message using specified `res` object if the field/s is/are empty.
 * Returns true if the field/s is/are not empty and false otherwise.
 */
function sendResponseOnEmptyJsonValues({res, jsonData = {}, success = false, print = true, code = null}) {
    const nullCheckData = jsonDataToLists(jsonData);
    const nullCheckNames = nullCheckData[0];
    const nullCheckValues = nullCheckData[1];
    return sendResponseOnEmptyFields({res: res, fieldNames: nullCheckNames, fieldValues: nullCheckValues, success: success, print: print, code: code});
}

function transformListsIntoJson(list1 = [], list2 = []) {
    const result = list1.reduce((obj, key, index) => {
        obj[key] = list2[index];
        return obj;
    }, {});
    return result;
}

/**
 * Format dates with customizable date-format.
 *
 * @param date The date to format
 * @param div Separator between date elements
 * @param day Type of day format: numeric | 2-digit | undefined
 * @param month Type of month format: numeric | 2-digit | long | short | narrow | undefined
 * @param year Type of year format: numeric | 2-digit | undefined
 * @param hour Type of hour format: numeric | 2-digit | undefined
 * @param minute Type of minute format: numeric | 2-digit | undefined
 * @param second Type of second format: numeric | 2-digit | undefined
 * @param locales Timezone locale.
 * @param hour12 12 hour time or 24 hour time.
 * @param time Add time or not in the end.
 *
 */
const formatDateAdvance = ({
                               date = new Date(),
                               div = '-',
                               day = '2-digit',
                               month = 'short',
                               hour = '2-digit',
                               minute = '2-digit',
                               second = undefined,
                               year = 'numeric',
                               locales = 'en-IN',
                               hour12 = true,
                               time = false
                           }) => {
    try {
        //OPTIONS:
        // localeMatcher?: "best fit" | "lookup" | undefined;
        //         weekday?: "long" | "short" | "narrow" | undefined;
        //         era?: "long" | "short" | "narrow" | undefined;
        //         year?: "numeric" | "2-digit" | undefined;
        //         month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
        //         day?: "numeric" | "2-digit" | undefined;
        //         hour?: "numeric" | "2-digit" | undefined;
        //         minute?: "numeric" | "2-digit" | undefined;
        //         second?: "numeric" | "2-digit" | undefined;
        //         timeZoneName?: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined;
        //         formatMatcher?: "best fit" | "basic" | undefined;
        //         hour12?: boolean | undefined;
        //         timeZone?: string | undefined;
        const dateData = new Date(date);
        const options = {day: day, month: month, year: year};
        if (time === true) {
            options['hour'] = hour;
            options['minute'] = minute;
            options['second'] = second;
            options['hour12'] = hour12;
        }
        const formattedDate = dateData.toLocaleDateString(locales, options).replaceAll(/\//g, div);
        // Output: "25/02/2023"
        return formattedDate;
    } catch (e) {
        printError(TAG, e);
        return date;
    }
}

/**Returns date in the specified format.
 *
 * @hide It uses 'moment.js' library (npm install moment --save).
 *
 * @param date Custom date. Default is current date.
 * @param format Date format for date to be formatted in.
 *               Default is "yyyy-MM-DD" (2022-05-25).
 */
function formatDate(date = new Date(), format = "yyyy-MM-DD") {
    try {
        return (moment(date).format(format) + "").replaceAll("Invalid date", '').replaceAll("invalid date", '')
    } catch (e) {
        console.error(e);
        return '';
    }
}

const getCurrDateTime = ({date = new Date(), locales = 'en-IN', timeZone = 'Asia/Kolkata', time = true, hour12 = true}) => {
    const options = {
        timeZone: timeZone, year: 'numeric', month: 'short', day: 'numeric', // hour: 'numeric',
        // minute: 'numeric',
        // hour12: hour12
    };
    if (time === true) {
        options['hour'] = 'numeric';
        options['minute'] = 'numeric';
        options['hour12'] = hour12;
    }

    const formatter = new Intl.DateTimeFormat(locales, options);
    const formattedDate = formatter.format(date);

    return formattedDate;
}

async function createImageFromBase64(base64String, imagePath) {
    try {
        // create a buffer from the base64 string and write it to a file
        const buffer = Buffer.from(base64String, 'base64');
        await fs.promises.writeFile(imagePath, buffer);
        // insert the file path into the database
        // const filepath = `/ images / ${ imagePath } `;
        // const [result] = await connection.execute('INSERT INTO images (filepath) VALUES (?)', [filepath]);
    } catch (e) {
        console.err(e)
    }
}

async function getDirItems({
                               dirPath, includeFiles = true, includeDirs = false, recursive = false, extensions = [], exactMatch = false
                           }) {
    return new Promise((resolve, reject) => {
        if (checkNullStr(dirPath) && fileExistsSync(dirPath)) {
            if (fs.statSync(dirPath).isDirectory()) {
                try {
                    const fileList = [];
                    const files = fs.readdirSync(dirPath);

                    files.forEach((file) => {
                        const filePath = path.join(dirPath, file);
                        const stats = fs.statSync(filePath);

                        if (stats.isFile() && isBoolTrue(includeFiles)) {
                            const fileName = exactMatch ? file : file.toLowerCase();

                            if (extensions.length === 0 || extensions.some((ext) => fileName.endsWith(ext))) {
                                fileList.push(filePath);
                            }
                        } else if (stats.isDirectory() && isBoolTrue(includeDirs)) {
                            fileList.push(filePath);
                            if (isBoolTrue(recursive)) {
                                const recursiveFiles = getDirItems({
                                    dirPath: filePath,
                                    includeFiles: includeFiles,
                                    includeDirs: includeDirs,
                                    recursive: recursive,
                                    extensions: extensions,
                                    exactMatch: exactMatch
                                });
                                fileList.push(...recursiveFiles);
                            }
                        }
                    });
                    return resolve(fileList);
                } catch (e) {
                    printError(TAG, `Error: ${e}`);
                    return resolve([]);
                }
            } else {
                printError(TAG, `Path is not directory (${dirPath})`);
                return resolve([]);
            }
        } else {
            printError(TAG, `Directory path is empty or doesn't exist (${dirPath})`);
            return resolve([]);
        }
    });
}

// =================================Common functions start================================
function formatJson(value, indent = 4, withTab = false) {
    return JSON.stringify(value, null, withTab ? "\t" : indent);
}

function makeJsonDataUploadable(src) {
    if (checkNull(src)) {
        let jStr = isJson(src) ? JSON.stringify(src) : src + ""
        jStr = JSON.parse(jStr.replace(/&quot;/ig, '"'))
        jStr = jStr
            .replace("'", "")
            .replace("''", "")
            .replace("\"", "")
            .replace("\u2019", "")
        jStr = removeApostrophes(jStr)
        return jStr
        // return src
    } else {
        return src
    }
}

function sanitizeJsonStr(src = {}) {
    let outData = src;
    if (checkNull(src)) {
        let jStr = (isJson(src) ? JSON.stringify(src) : src) + ""

        //Remove head inverted commas
        if (jStr.charAt(0) === "\"") jStr = jStr.slice(1)
        if (jStr.charAt(0) === "\"" && jStr.charAt(1) === "\"") jStr = jStr.slice(2)
        if (jStr.charAt(0) === "\"" && jStr.charAt(1) === "\"" && jStr.charAt(2) === "\"") jStr = jStr.slice(3)
        if (jStr.charAt(0) === "\"" && jStr.charAt(1) === "\"" && jStr.charAt(2) === "\"" && jStr.charAt(3) === "\"") jStr = jStr.slice(4)

        //Remove trailing inverted commas
        if (jStr.charAt(jStr.length - 1) === "\"") jStr = jStr.slice(0, -1)
        if (jStr.charAt(jStr.length - 1) === "\"" && jStr.charAt(jStr.length - 2) === "\"") jStr = jStr.slice(0, -2)
        if (jStr.charAt(jStr.length - 1) === "\"" && jStr.charAt(jStr.length - 2) === "\"" && jStr.charAt(jStr.length - 3) === "\"") jStr = jStr.slice(0, -3)

        outData = jStr
    }
    return outData;
}

function isJson(str) {
    try {
        const x = JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

function isCharAtEnd(str, at = 0, check = "") {
    return str.charAt(str.length - at) === check
}

function isCharAtStart(str, at = 0, check = "") {
    return str.charAt(at) === check
}

function isNull(obj, checkExtra = "") {
    return obj === undefined || obj === null || obj === checkExtra
}

function getDefValue(src, defValue = "", checkExtra = null) {
    return checkNull(src, checkExtra) ? src : checkNull(defValue) ? defValue : "";
}

function getDefValueStr(src, defValue = "") {
    return checkNullStr(src) ? src : checkNullStr(defValue, true, null) ? defValue : "";
}

function isArr(obj) {
    return Array.isArray(obj);
}

/**
 * Returns true if the object is not null and not undefined.
 */
function checkNull(obj, checkExtra = null) {
    return obj !== undefined && obj + "" !== 'undefined' && obj !== null && obj + "" !== 'null' && (obj + "").toLowerCase() !== 'nan' && obj !== checkExtra
}

/**
 * Returns true if the json-object is not null and not undefined and size is also not empty.
 */
function checkNullJson(obj) {
    try {
        // return checkNull(obj, "") && checkNull(obj, {}) && Object.keys(obj).length >= 0;
        return Object.keys(obj).length > 0;
    } catch (e) {
        return false;
    }
}

/**
 * Returns true if the object is not null and not undefined.
 */
function checkNullStr(obj, trim = true, checkExtra = '') {
    return checkNull(trim ? (obj + "").trim() : obj, checkExtra)
}

function arrayHasStr(checkStr, strList, matchCase = false) {
    for (const listItem of strList) {
        if (matchCase ? (listItem + '').includes(checkStr) : (listItem + '').toLowerCase().includes((checkStr + '').toLowerCase())) {
            return true;
        }
    }
    return false;
}

function trim(str) {
    return (str + '').trim();
}

/**
 * Returns true if all the input-values are not null otherwise false.
 */
function checkNullInputValues(values = []) {
    let allGood = false;
    if (checkNullArr(values)) {
        for (let value of values) {
            if (checkNullStr(value)) {
                allGood = true;
            } else {
                allGood = false;
                break;
            }
        }
    }
    return allGood;
}

/**
 * Returns true if the object is equal to "[object Object]".
 */
function checkObjEqual(obj, check = "[object Object]") {
    return obj !== check
}

function isArrEmpty(obj = []) {
    return (checkNull(obj)) && obj.length === 0
}

function checkNullArr(obj = []) {
    // return (checkNull(obj)) && obj.length > 0
    return (checkNull(obj)) && Array.isArray(obj) && obj.length > 0;

}

function toJsonStr(src = "", indent = 4, replacer = undefined) {
    return JSON.stringify(JSON.parse(src.replace(/&quot;/ig, '"')), replacer, indent)
}

function jsonToStr(src, indent = 4, replacer = null) {
    try {
        let data = JSON.stringify(src, replacer, indent);
        // data = data.replaceAll("\"", "").replaceAll('"', "");
        return data;
    } catch (error) {
        return src;
    }
}

function strToJson(src) {
    try {
        let data = JSON.parse(src);
        return data;
    } catch (error) {
        return src;
    }
}

function isStr(obj) {
    try {
        return typeof obj === 'string';
    } catch (e) {
        return false;
    }
}

function deleteJsonKey(src, key) {
    try {
        delete src[key];
    } catch (error) {
    }
}

function jsonHasKey(src, key) {
    try {
        return src.hasOwnProperty(key);
    } catch (error) {
        return false;
    }
}

function deleteJsonValue(src, key) {
    let outData = src;
    try {
        if (outData.hasOwnProperty(key)) {
            delete outData[key];
        }
        return outData;
    } catch (e) {
        return src;
    }
}

function removeApostrophes(src, replacement = "") {
    return src.replace(/'/g, replacement);
}


/**
 * Removes symbols (e.g. #, /, :, @, +) that are invalid for file naming from file name
 *
 * NOTE: pass only name of the file, NOT it's complete path
 */
function purifyFilename(fileName, replacement = "_", symbols = ["#", "%", "&", "{", "}", "\\", "/", "//", "<", ">", "?", "/", "$", "!", "'", ":", "@", "+", "`", " | ", "=", " * "]) {
    let outName = fileName + ""
    if (checkNull(outName)) {
        for (let symbol of symbols) {
            // if (outName.includes(symbol)) {
            outName = outName.replace(symbol, replacement)
            // }
        }
    }
    return outName
}

/**Returns the factorial of the specified number*/
function factorial(number) {
    if (number >= 0) {
        if (number === 0) {
            return 0
        } else {
            let factorial = 1;
            for (let i = number; i >= 1; i--) {
                factorial = factorial * i
            }
            printItem(factorial)
            return factorial
        }
    } else {
        return false
    }
}

/**Returns true if the number is prime or false on the vice-versa.
 * PrimeNumber= A number (only natural number, greater than 0 or equal to 0(num>=0)) that is divided by only itself or 1, known as prime number.*/
function isPrime(number) {
    let is = false
    if (number >= 0) {
        number = parseInt(number)

        if (number === 0 || number === 1) {
            is = false
        } else {
            for (let i = 2; i < number; i++) {
                is = i % 2 === 0;
            }
        }
    }
    return is
}

/**Returns true if the number is armstrong or false on the vice-versa.
 * Armstrong number: If the number is equal to its sum of the digits cube, also called narcissistic number. Example: 371=(3*3*3)+(7*7*7)+(1*1*1)*/
function isArmstrong(number, showMessage = false) {
    number = parseInt(number)
    let is = false
    let cubeSum = 0;
    if (number === 0) {
        is = false

        if (showMessage) alert(`${number} is not armstrong because its zero.`)
    } else {
        let digits = number.toString().split(``)
        let singleDigit = digits.map(Number)
        for (let i = 0; i < singleDigit.length; i++) {
            cubeSum += (singleDigit[i] * singleDigit[i] * singleDigit[i])
        }
        if (number === cubeSum) {
            is = true

            if (showMessage) alert(`${number} is an armstrong number.`)
        } else {
            is = false

            if (showMessage) alert(`${number} is not an armstrong number.`)
        }
    }
    return is
}

function splitAnything(item) {
    return (item + "").toString().split(``)
}


/**Splits and returns a string. If start index is 1 it will return the string after the index value and if 0 it will return the string from 0 index till the
 *  split character*/
function extractString(string, splitChar, before = true) {
    return string.split(splitChar)[(before) ? 0 : 1]
    // return string.split(splitChar).pop()
}

function randomStr(length = 10, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    var result = '';
    var charLen = chars.length;
    let newLength = parseInt(length)
    newLength = newLength > charLen ? charLen : newLength

    for (let i = 0; i < newLength; i++) {
        result += chars.charAt(Math.floor(Math.random() * charLen));
    }
    return result;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function removeArrItem(arr, index) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === index) {
            arr.splice(i, 1);
        }
    }
    return arr
}

function getStrInitials(str, delimiter = ' ', limit = 2, middle = '', charAt = 0) {
    if (checkNull(str, "")) {
        let strArr = str.split(delimiter);
        if (strArr.length === 0) {
            strArr = str.split();
        }
        let initials = '';
        for (let i = 0; i < strArr.length; i++) {
            if (i < limit) {
                initials += middle + strArr[i].charAt(charAt).toUpperCase();
            }
        }
        return initials;
    } else {
        return str;
    }
}

function compareJsonItems(sortKey) {
    return function (a, b) {
        if (a[sortKey] > b[sortKey]) {
            return 1;
        } else if (a[sortKey] < b[sortKey]) {
            return -1;
        }
        return 0;
    }
}

function sortJsonList(jsonList, sortKey) {
    try {
        jsonList.sort(compareJsonItems(sortKey));
        return jsonList;
    } catch (e) {
        printError(TAG, e);
        return jsonList;
    }
}

function getMatchingStrFromArr(strToFind, strList, containing = true, matchCase = false) {
    if (isBoolTrue(containing)) {
        return strList.find((item) => isBoolTrue(matchCase) ? (item === strToFind) : ((item + '').toLowerCase().includes((strToFind + '').toLowerCase())));
    } else {
        return strList.find((item) => isBoolTrue(matchCase) ? (item === strToFind) : ((item + '').toLowerCase() === (strToFind + '').toLowerCase()));
    }
}

function isBoolTrue(boolValue, checkBinary = false, checkYN = false) {
    let value = boolValue === true || boolValue === 'true';
    if (!value && checkBinary) {
        value = isBinaryTrue(boolValue);
    }
    if (!value && checkYN) {
        const boolStr = (boolValue + "").toLowerCase().trim();
        value = boolStr === 'y' || boolStr === 'yes';
    }
    return value;
}

function boolToBinary(value) {
    return isBoolTrue(value) ? 1 : 0;
}

function isValueBool(value) {
    return checkNullStr(value, '') && (value === true || value === 'true' || value === false || value === 'false');
}

function getBoolValue(value, checkBinary = false) {
    return isValueBool(value) ? value : isBoolTrue(checkBinary) ? isBinaryTrue(value) : false;
}

function binaryToBool(value) {
    return isBinaryTrue(value);
}

function isBinaryTrue(value) {
    return value === 1 || value === '1';
}

function binaryToYN(value, yes = "YES", no = "NO") {
    return binaryToBool(value) ? yes : no;
}

function boolToYN(value, yes = "YES", no = "NO") {
    return isBoolTrue(value) ? yes : no;
}

/**
 * Convert file-size to human readable size.
 * Example: 5000.50 to 4.89 KB.
 *
 * It support the following sizes in order:
 *  Bytes, KB, MB, GB, TB, PB (ParaBytes), EB (ExaByte), ZB (ZettaByte), YB (YottaByte).
 */
function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}


/**
 * Calculate the size of a text.
 */
function getTextSize(src, readable = true) {
    let size = Buffer.byteLength(src + "", 'utf8');
    //Convert to human readable
    if (isBoolTrue(readable)) {
        size = formatFileSize(size);
    }
    return size;
}

function mapJsonKeys(r) {
    return r.keys().map(r);
}

function filterArrWithStart(arr, char) {
    return arr.filter(str => (str + "").startsWith(char));
}

function filterArrWithContain(arr, char) {
    return arr.filter(str => (str + "").includes(char));
}

function filterArrWithEnd(arr, char) {
    return arr.filter(str => (str + "").endsWith(char));
}

function getJsonListKeys(jsonList, key) {
    return jsonList.map(item => item[key]);
}


/**
 * Filters-out the json key-value data whose keys don't exist in the stringList.
 *
 * Implementation:
 * <pre>
 *     const jsonData = {
 *     Name: 'John',
 *     Age: 30,
 *      Email: 'john@example.com',
 *      City: 'New York'
 *     };
 *      const stringList = ['name', 'email'];
 *     const filteredData = filterJsonData(jsonData, stringList);
 *     printLog(filteredData); // Output: { Name: 'John', Email: 'john@example.com' }
 * </pre>
 */
function filterJsonDataWithList(data, stringList, ignoreCase = true) {
    // convert all stringList items to lowercase
    const lowerCaseList = stringList.map(str => isBoolTrue(ignoreCase) ? str.toLowerCase() : str);
    // iterate through the keys of the data object
    for (let key in data) {
        const item = (key + "")
        // check if the lowercase version of the key exists in the lowercase list
        if (!lowerCaseList.includes(isBoolTrue(ignoreCase) ? item.toLowerCase() : item)) {
            // if the key is not in the list, delete it from the data object
            delete data[item];
        }
        //loanRangeStart
        // loanRangeEnd
    }
    return data;
}

/**
 *Converts the string into a sentence case and if there are either spaces or hyphens or dashes or underscores or
 * capital-case letters occur and then makes a
 * whole string from those fractions and convert them into sentence case
 */

function mergeJsons(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}

/**
 * Change string case.
 *
 * Example usage:
 *
 * printLog(convertCase("hello world", "uppercase")); // HELLO WORLD
 * printLog(convertCase("HELLO WORLD", "lowercase")); // hello world
 * printLog(convertCase("hello world", "camelcase")); // helloWorld
 * printLog(convertCase("hello world", "capitalize")); // Hello World
 * printLog(convertCase("hello world. goodbye world.", "sentencecase")); // Hello world. Goodbye world.
 */
function changeStringCase(src, type = "upper" || "lower" || "camel" || "capitalize" || "sentence" || "variable", spaceCapitals = false) {
    let data = src + "";
    if (isBoolTrue(spaceCapitals)) data = addSpaceBeforeStringUppercaseLetters(data);
    // else {
    switch (type) {
        case "upper":
            data = data.toUpperCase();
            break;
        case "lower":
            data = data.toLowerCase();
            break;
        case "camel":
            data = data.replaceAll(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
            // }).replaceAll(/\s+/g, '');
            break;
        case "capitalize":
            data = data.toLowerCase().replaceAll(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
            break;
        case "sentence":
            data = data.toLowerCase().replaceAll(/(^\s*\w|[\.\?!]\s*\w)/g, function (c) {
                return c.toUpperCase();
            });
            break;
        case "variable": {
            // Remove leading and trailing spaces
            data = data.trim();

            // Replace non-alphanumeric characters with spaces
            data = data.replace(/[^a-zA-Z0-9]/g, ' ');

            // Split the string into words
            const words = data.split(' ');

            // Convert each word to lowercase and capitalize the first letter
            const formattedWords = words.map((word, index) => {
                if (index === 0) {
                    return word.toLowerCase();
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
            });

            // Join the words and remove spaces
            data = formattedWords.join('');
        }
            break;
        default:
            data = src;
            break;
    }
    // }
    return data;
}

/**
 * Takes a JSON object and returns two lists - one containing sentence-case keys and another containing corresponding values:
 */
function jsonDataToLists(data, cased = true) {
    const keys = Object.keys(data).map((key) => isBoolTrue(cased) ? addSpaceBeforeStringUppercaseLetters(key) : key);
    const values = Object.values(data);
    return [keys, values];
}

function addSpaceBeforeStringUppercaseLetters(str) {
    return str.replace(/([A-Z])/g, ' $1');
}

function formatIndianCurrency(num, currencySymbol = "₹") {
    const denominations = [{value: 100000000000, symbol: "Kharab"}, {value: 1000000000, symbol: "Arab"}, {value: 10000000, symbol: "Cr"}, {
        value: 100000, symbol: "L"
    }, {value: 1000, symbol: "k"}, {value: 1, symbol: ""},];

    for (let i = 0; i < denominations.length; i++) {
        if (num >= denominations[i].value) {
            const quotient = Math.floor(num / denominations[i].value);
            const remainder = num % denominations[i].value;
            const symbol = denominations[i].symbol;

            if (remainder === 0) {
                return currencySymbol + quotient + symbol;
            } else if (remainder < 10 && i < denominations.length - 1) {
                return currencySymbol + quotient + ".0" + remainder + symbol;
            } else {
                return currencySymbol + quotient + remainder + symbol;
            }
        }
    }
}

function concatStrings(srcList = [], connector = "", defValue = "", defNullValue = "", skipValues = ['']) {
    let outValue = "";
    if (!checkNullArr(srcList)) return defValue;
    if (!checkNullArrWithDropEmpty(skipValues)) skipValues = [''];
    for (let i = 0; i < srcList.length; i++) {
        const element = trim(checkNullStr(srcList[i]) ? srcList[i] : '');
        if (!checkNullStr(element)) {
            if (checkNullArr(skipValues) && !skipValues.includes(defNullValue)) {
                outValue += defNullValue;
                if (i < srcList.length - 1 && (!skipValues.includes(srcList[i + 1]))) {
                    outValue += connector;
                }
            }
        } else if (!skipValues.includes(element)) {
            outValue += element;
            if (i < srcList.length - 1 && (!skipValues.includes(srcList[i + 1]))) {
                outValue += connector;
            }
        }
    }
    if ((outValue + "").trim() === (connector + "").trim()) {
        outValue = "";
    }
    if ((trim(outValue)[trim(outValue).length - 1]) === trim(connector)) {
        outValue = outValue.substring(0, trim(outValue).length - 1);
    }
    return trim(checkNullStr(outValue) ? outValue : defValue);
}

function getDefStrValueWithPostfix(srcStr, defValue = "", postfix = "") {
    if (checkNullStr(srcStr)) {
        return srcStr + postfix;
    } else {
        if (checkNullStr(defValue)) {
            return defValue + postfix;
        } else {
            return defValue;
        }
    }
}

function getDefStrValueWithPrefix(srcStr, defValue = "", prefix = "") {
    if (checkNullStr(srcStr)) {
        return prefix + srcStr;
    } else {
        if (checkNullStr(defValue)) {
            return prefix + defValue;
        } else {
            return defValue;
        }
    }
}

function dropArrValue(arr, element) {
    try {
        const index = arr.indexOf(element);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    } catch (e) {
        return arr;
    }
}

function getJsonKeyName(data, keyToCheck, defKey = "", keyCase = 'capitalize', spaceCapitals = true) {
    if (keyToCheck in data) {
        let key = keyToCheck;
        key = changeStringCase(key, keyCase, spaceCapitals);
        return key;
    } else {
        return defKey;
    }
}

function populateArr(arr = [], value = undefined, iter = 0) {
    for (let i = 0; i < iter; i++) {
        arr.push(value);
    }
    return arr;
}

function getSMNameFromUrl(url) {
    let urlx = (url + "").toLowerCase();
    if (urlx.includes('linkedin')) {
        return 'linkedin';
    } else if (urlx.includes('youtube')) {
        return 'youtube';
    } else if (urlx.includes('twitter')) {
        return 'twitter';
    } else if (urlx.includes('instagram')) {
        return 'instagram';
    } else if (urlx.includes('facebook')) {
        return 'facebook';
    } else {
        urlx = removeHttpsAndDomain(urlx);
        // https://www.adamtenfordemd.com/about
        // return 'unknown';
        return urlx;
    }
}

function removeHttpsAndDomain(url) {
    try {
        const regex = /^(https?:\/\/)?(www\.)?([^\/]+)/i;
        const matches = regex.exec(url);
        if (matches && matches.length > 3) {
            const domain = matches[3];
            const domainWithoutExtension = domain.replace(/\.[^.]+$/, '');
            return domainWithoutExtension;
        }
        return url;
    } catch (e) {
        return url;
    }
}

function getArrLen(obj = []) {
    var len = 0;
    try {
        // len = checkNullArr(arr) ? arr.length : 0;
        // if (checkNullArr(arr)) {
        if (checkNull(obj) && obj.length > 0) {
            len = obj.length;
        }
    } catch (e) {
        len = -1;
        // printLog(e);
    }
    return len;
}

function sliceArr(arr, start, end) {
    try {
        return arr.slice(start, end);
    } catch (e) {
        printError(TAG, e);
        return []
    }
}

function getDefJsonValue(src, key, defValue = "") {
    let value = "";
    try {
        if (jsonHasKey(src, key)) value = src[key];
        if (!checkNullStr(value)) value = defValue;
    } catch (error) {
        value = defValue;
    }
    return value;
}

function jsonValueIncludes(src, key, checkValue) {
    return (getDefJsonValue(src, key) + '').includes(checkValue);
}

function getDefJsonValueByCompare({src, key, keyAlt, defValue = "", prefix = "", postfix = ""}) {
    try {
        const oldValue = getDefJsonValue(src, key, defValue);
        const newValue = getDefJsonValue(src, keyAlt, defValue);
        let outValue = checkNullStr(oldValue) ? oldValue : newValue;
        outValue = concatStrings([prefix, outValue, postfix], defValue);
        return outValue;
    } catch (e) {
        printError(TAG, e);
    }
}

function dropArrEmptyValues(arr) {
    return arr.filter((value) => checkNullStr(value, true));
}

/**
 * Drop duplicate element from the array
 */
function dropArrDuplicates(arr) {
    return (checkNull(arr) && isArr(arr)) ? arr.filter((elem, index) => arr.indexOf(elem) === index) : arr;
}

function getJsonValueFromNestedKeys(obj, keys, defaultValue) {
    try {
        let value = obj;
        for (let key of keys) {
            try {
                value = value[key];
            } catch (error) {
                return defaultValue;
                // return value || defaultValue;
            }
        }
        return value || defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

function getArrIndexValue(arr = [], index, defValue = 0) {
    try {
        return arr[index] || defValue
    } catch (e) {
        return defValue;
    }
}

function getNestedArrIndexValue(nestedList, indices = [], defValue = '') {
    if (!checkNullArr(indices) || !checkNullArr(nestedList)) return nestedList;
    try {
        const index = indices[0];
        const remainingIndices = indices.slice(1);
        if (checkNull(nestedList[index])) {
            return getNestedArrIndexValue(nestedList[index], remainingIndices);
        } else {
            return defValue;
        }
    } catch (e) {
        // printError(TAG,e);
        return defValue;
    }
}

function getStrSplitArrIndexValue(src, index, delimiter = "", defValue = "") {
    try {
        return getArrIndexValue((src + "").split(delimiter), index, defValue)
    } catch (e) {
        return defValue;
    }
}

function geStrArrIndexValue(src, index, delimiter = "", defValue = "") {
    try {
        return (src + "").charAt(index);
    } catch (e) {
        return defValue;
    }
}

function calcDuration(startTime) {
    try {
        return formatTimeMS(performance.now() - startTime);
    } catch (e) {
        printError(TAG, 'calcDuration:', e);
        return -1;
    }
}

function convertObjToArr(obj = {}) {
    const outArr = []
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const item = {};
            item[key] = obj[key];
            outArr.push(item);
        }
    }
    return outArr;
}

function formatTimeMS(ms) {
    try {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const remainingSeconds = seconds % 60;
        const remainingMinutes = minutes % 60;

        const formattedTime = [];
        if (hours > 0) {
            formattedTime.push(`${hours}h`);
        }
        if (remainingMinutes > 0) {
            formattedTime.push(`${remainingMinutes}m`);
        }
        if (remainingSeconds > 0) {
            formattedTime.push(`${remainingSeconds}s`);
        }
        return formattedTime.join(' ');
    } catch (e) {
        printError(TAG, 'formatTimeMS:', e);
        return '';
    }
}

function getSqlUploadableStr(string) {
    let modifiedStr = (string + "").replaceAll("'", "''");
    modifiedStr = modifiedStr.replaceAll("''''", "''");
    return modifiedStr;
}

function jsonHasNestedKey(obj, keysToCheck = []) {
    try {
        if (!obj || typeof obj !== 'object' || keysToCheck.length === 0) {
            return false;
        }
        let currentObj = obj;
        for (const key of keysToCheck) {
            if (!currentObj.hasOwnProperty(key)) {
                return false;
            }
            currentObj = currentObj[key];
        }
        return true;
    } catch (e) {
        printError(TAG, e);
    }
}

/**
 * Returns an array containing specified values to the n number.
 */
function getPopulatedArr(value = undefined, iter = 0) {
    const arr = [];
    for (let i = 0; i < iter; i++) {
        arr.push(value);
    }
    return arr;
}

function dropListEmptyElements(list = [], valuesToCheckToRemove = []) {
    try {
        return list.filter((item) => {
            if (!checkNullStr(item)) return false;
            return !(checkNullArr(valuesToCheckToRemove) && valuesToCheckToRemove.includes(item));
        });
    } catch (e) {
        printError(e);
        return list;
    }
}

function replaceInString(inputString, replaceStrings = [], replacement = '') {
    if (!checkNullStr(inputString) || !checkNullArr(replaceStrings)) {
        return inputString;
    }
    for (const replaceStr of replaceStrings) {
        inputString = inputString.replace(new RegExp(replaceStr, 'g'), replacement);
    }
    return inputString;
}

function checkNullArrWithDropEmpty(obj = []) {
    return ((checkNull(obj) && isArr(obj)) && obj.length > 0) && checkNullArr(dropListEmptyElements(obj));
}

/**
 * Reorder the keys of an object using a list of keys to use against.
 *
 * @param {Object} obj - Object whose keys are to be re-ordered.
 * @param {Array} orderKeys - Keys to use when re-ordering the keys of the object (default to <code>false</code>).
 * @param {Boolean} dropUnmatched - The path to an icon image.
 *
 * @example
 * const obj = {name: 'Roger', data: 'Unavailable', label: 'College', mark: 'N/A', field: 'Chemistry'};
 * const orderKeys = ['label', 'data', 'name', 'mark'];
 *
 * const reorderedObj = reorderJsonObjKeys(obj, orderKeys, dropUnmatched: true);
 * console.log(reorderedObj);
 * //output (dropUnmatched: true): {label: 'College', data: 'Unavailable', name: 'Roger', mark: 'N/A'}
 * //output (dropUnmatched: false): {label: 'College', data: 'Unavailable', name: 'Roger', mark: 'N/A', field: 'Chemistry'}
 */
function reorderJsonObjKeys(obj, orderKeys = [], dropUnmatched = false) {
    if (!checkNullJson(obj) || !checkNullArr(orderKeys)) return obj;
    const orderedObj = {};
    for (const key of orderKeys) {
        if (obj.hasOwnProperty(key)) {
            orderedObj[key] = obj[key];
        }
    }
    if (!dropUnmatched) {
        for (const key in obj) {
            if (!orderedObj.hasOwnProperty(key)) {
                orderedObj[key] = obj[key];
            }
        }
    }

    return orderedObj;
}

/**
 * Reorder objects containing list using a set of keys.
 *
 * @example
 * // Usage example:
 * const jsonList = [{name: 'bd', data: ''}, {name: 'immo'}, {name: 'edu'}, {name: 'asso'}];
 * const orderKeys = ['edu', 'bd', 'asso'];
 * const reorderedList = reorderJsonList(jsonList, orderKeys, 'name', true);
 * console.log(reorderedList);
 * // Output: [ { name: 'edu' }, { name: 'bd', data: '' }, { name: 'asso' } ]//dropUnmatched: true
 * // Output: [ { name: 'edu' }, { name: 'bd', data: '' }, { name: 'asso' }, {name: 'immo'} ]//dropUnmatched: false
 *
 * @param {Array} jsonList - Json objects containing list that is to be re-ordered.
 * @param {Array} orderKeys - List of keys for re-ordering json-list.
 * @param {String} targetKey - Name of the key whose value will be used.
 * @param {boolean} dropUnmatched - Whether to drop unmatched items or add them at the end.
 * @returns {Array} - Reordered list.
 */
function reorderJsonList(jsonList = [], orderKeys = [], targetKey, dropUnmatched = false) {
    if (!checkNullArr(jsonList) || !checkNullArr(orderKeys) || !checkNullStr(targetKey)) return jsonList;
    try {
        let outList = jsonList.filter(item => orderKeys.includes(item[targetKey]));
        if (isBoolTrue(dropUnmatched)) {
            outList.sort((a, b) => orderKeys.indexOf(a[targetKey]) - orderKeys.indexOf(b[targetKey]));
        } else {
            const unmatchedItems = jsonList.filter(item => !orderKeys.includes(item[targetKey]));
            outList = outList.concat(unmatchedItems);
        }
        return outList;
    } catch (e) {
        printError(TAG, e);
        return jsonList;
    }
}


function combineJsonValues(obj = {}, keys = [], connector = ',', defValue = '') {
    if (!checkNullJson(obj) || !checkNullArr(keys)) return defValue;
    let outValue = '';
    keys.forEach((key) => {
        if (checkNullStr(key) && checkNullStr(obj[key])) {
            outValue += connector + obj[key];
        }
    });
    return outValue;
}

function dropJsonListDuplicates(jsonList = [], targetKey) {
    if (!checkNullArr(jsonList) || !checkNullStr(targetKey)) return jsonList;
    const uniqueMap = new Map();
    const uniqueList = [];
    jsonList.forEach((item) => {
        const keyValue = item[targetKey];
        if (!uniqueMap.has(keyValue)) {
            uniqueMap.set(keyValue, true);
            uniqueList.push(item);
        }
    });
    return uniqueList;
}

function isJsonValueTrue(obj, key) {
    return isBoolTrue(getDefJsonValue(obj, key));
}

/**
 * Description
 *
 * @example
 * // Example usage:
 * const list = [
 *     {selected: true, name: 'AA'},
 *     {selected: false, name: 'BB'},
 *     {selected: false, name: 'CC'},
 *     {selected: false, name: 'LL'},
 *     {selected: false, name: 'XX'},
 *     {selected: true, name: 'DD'},
 * ];
 *
 * // Move items with 'selected' set to true up in the list
 * const updatedList = moveJsonListItems(list, 'selected', true, true);
 * console.log(updatedList);
 * //Output:
 * [
 *   { selected: true, name: 'AA' },
 *   { selected: true, name: 'DD' },
 *   { selected: false, name: 'BB' },
 *   { selected: false, name: 'CC' },
 *   { selected: false, name: 'LL' },
 *   { selected: false, name: 'XX' }
 * ]
 *
 * @param {Array} list - List of Object/JSON-element to be modified.
 * @param {String} targetKey - Key to target.
 * @param {Any} commonKeyValue - Condition-value.
 * @param {Boolean} moveUp - Whether to move up or down the true-condition elements.
 *
 *
 */
function moveJsonListItems(list, targetKey, commonKeyValue, moveUp = true) {
    if (!checkNullArr(list) || !checkNullStr(targetKey) || !checkNullStr(commonKeyValue)) return list;
    try {
        const matchingItems = list.filter(item => item[targetKey] === commonKeyValue);
        const nonMatchingItems = list.filter(item => item[targetKey] !== commonKeyValue);
        if (moveUp) {
            return [...matchingItems, ...nonMatchingItems];
        } else {
            return [...nonMatchingItems, ...matchingItems];
        }
    } catch (e) {
        printError(e)
        return list;
    }
}

// =================================Common functions end================================


// =================================Node functions start================================

function getFileSize(filePath, readable = true) {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;

    let outSize = fileSizeInBytes;
    if (isBoolTrue(readable)) {
        outSize = formatFileSize(fileSizeInBytes);
    }
    return outSize;
}

function saveLogs({file, log, dateFormat = 'DD-MM-YYYY HH:mma', prefix = "Message:", postfix = "", charLimit = 120}) {
    try {
        const logEntries = Array.isArray(log) ? log : [log];
        const formattedLogs = logEntries.map((entry) => {
            let logItem = entry;
            //check if entry is json or string
            if (!typeof logItem === "string") {
            }
            logItem = jsonToStr(logItem);

            const truncatedEntry = (logItem + "").substring(0, charLimit); // Limit to first 120 characters
            return `[${formatDate(new Date(), dateFormat)}]: ${prefix} ${truncatedEntry}${postfix}`;
        });

        const logText = formattedLogs.join('\n') + '\n';

        const logFilePath = path.resolve(file);
        fs.appendFileSync(logFilePath, logText);
        // console.log('Logs saved successfully.');
        return true;
    } catch (error) {
        // console.error('Error saving logs:', error);
        return false;
    }
}

function deleteFile(filePath) {
    try {
        fs.unlinkSync(filePath);
    } catch (e) {
        printError(TAG, 'deleteFile:', "Couldn't delete the file:", filePath, 'Error', e);
    }
}

// const csv = require('csv-parser');

/**
 * Docs
 *
 * @example
 * readCSVFile('csv-file.csv', (error, data) => {
 *     if (error) {
 *         console.error('Error reading CSV:', error);
 *     } else {
 *         console.log('CSV Data:', data);
 *     }
 * });
 *
 * @param {string} filePath - CSV-file to read.
 * @param {function} callback - Callback to call when data is read or error occur.
 */
function readCSVFile(filePath, callback) {
    const csvData = {
        columns: [], rows: [],
    };

    // fs.createReadStream(filePath)
    //     .pipe(csv())
    //     .on('headers', (headers) => {
    //         csvData.columns = headers;
    //     })
    //     .on('data', (row) => {
    //         csvData.rows.push(Object.values(row));
    //     })
    //     .on('end', () => {
    //         if (callback) callback(null, csvData);
    //     })
    //     .on('error', (error) => {
    //         if (callback) callback(error, null);
    //     });
}

/**
 * Convert multiple image-bytes to image buffers (that can be saved as image files easily)
 *
 * Use:
 * <pre>
 *      const imageBytesList = [imageBytes1, imageBytes2, ...];
 *      const imageBuffers = convertBytesToImageBuffers(imageBytesList);
 * </pre>
 */
async function convertBytesListToImageBufferList(imageBytesList = [], encoding = 'base64') {
    const imageBuffers = await Promise.all(imageBytesList.map((imageBytes) => Buffer.from(imageBytes, encoding)));
    return imageBuffers;
}

/**
 * Store multiple image buffers in the system storage as files.
 *
 * Use:
 *
 * <pre>
 *     const imageBuffers = [imageBuffer1, imageBuffer2, ...];
 *     const filePaths = [filePath1, filePath2, ...];
 *     storeImageBuffersInSystem(imageBuffers, filePaths);
 * </pre>
 */
function storeImageBufferListInSystem(imageBuffers = [], filePaths = []) {
    imageBuffers.forEach((imageBuffer, index) => {
        const filePath = filePaths[index];
        fs.writeFileSync(filePath, imageBuffer);
        printLog(`Image stored at ${filePath}`);
    });
}

/**
 * Store multiple image bytes in the system storage as files.
 *
 * Use:
 * <pre>
 *      const imageBytesList = [imageBytes1, imageBytes2, ...];
 *      const filePaths = [filePath1, filePath2, ...];
 *      storeImageBytesInSystem(imageBytesList, filePaths);
 * </pre>
 */
async function storeImageBytesListInSystem(imageBytesList = [], filePaths = []) {
    return new Promise(async (resolve, reject) => {
        try {
            const imageBuffers = await convertBytesListToImageBufferList(imageBytesList);
            storeImageBufferListInSystem(imageBuffers, filePaths);
            return resolve(true);
        } catch (error) {
            printError('Error storing image bytes:', error);
            return resolve(false);
        }
    });
}

/**
 * Convert data-url formatted data into byte array.
 */
function convertImageDataURLToByteArr(dataURL) {
    const base64String = dataURL.split(",")[1];
    const binaryString = atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }

    return byteArray;
}

/**
 * Convert multiple data-url formatted data into list of multiple byte arrays.
 */
function convertImageDataURLListToByteArrList(dataURLItems = []) {
    if (!checkNullArrWithDropEmpty(dataURLItems)) return [];
    try {
        const items = [];
        for (let item of dataURLItems) {
            if (checkNullStr(item)) items.push(convertImageDataURLToByteArr(item));
        }
        return items;
    } catch (e) {
        printError(e)
        return [];
    }
}

/**
 * Convert a byte array to a data URL format.
 *
 * @param byteArray Data to be converted into data-url format.
 * @param mimeType Mime-type for the converted file, i.e image/jpeg or image/png etc.
 */
function convertByteArrToImageDataURL(byteArray = [], mimeType = "image/jpeg", encoding = "base64") {
    const binaryString = Array.from(byteArray, byte => String.fromCharCode(byte)).join('');
    const base64String = btoa(binaryString);
    return `data:${mimeType};${encoding},${base64String}`;
}

/**
 * Convert image file into byte-array.
 */
function convertImageIntoByteArr(imagePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const byteArr = Array.from(data);
                resolve(byteArr);
            }
        });
    });
}

/**
 * Convert image-file into image data-URL format.
 */
function convertImageIntoDataUrl(imagePath) {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const dataUrl = `data:image/jpeg;base64,${data.toString('base64')}`;
                    return resolve(dataUrl);
                }
            });
        } catch (e) {
            printError(e);
            return resolve('');
        }
    });
}


/**
 * Convert image-bytes to image buffer (that can be saved as image file easily)
 *
 * Use:
 * <pre>
 *   const imageBytes = req.body.imageBytes or from any source;
 *   const imageBuffer = convertImageBytesToImage(imageBytes);
 * </pre>
 */
async function convertBytesToImageBuffer(imageBytes, encoding = 'base64') {
    return Buffer.from(imageBytes, encoding);
}

/**
 * Store image-buffer in system-storage as a file.
 *
 * Use:
 * <pre>
 *   const imageBuffer = youImageBuffer;
 *   storeImageBufferInSystem(imageBuffer);
 * </pre>
 */
function storeImageBufferInSystem(imageBuffer, filePath) {
    fs.writeFileSync(filePath, imageBuffer);
    printLog(`Image stored at ${filePath}`);
}

/**
 * Store image-bytes in system-storage as a file.
 *
 * Use:
 * <pre>
 *   const imageBytes = youImageBytes;
 *   const imagePath = "D:/some_path/your_file.jpg";
 *   storeImageBytesInSystem(imageBytes,imagePath);
 * </pre>
 */
async function storeImageBytesInSystem(imageBytes, filePath) {
    return new Promise((resolve, reject) => {
        convertBytesToImageBuffer(imageBytes)
            .then(async (data) => {
                const bufferData = await data;
                // console.log("bufferData:", bufferData);
                storeImageBufferInSystem(bufferData, filePath);
                return resolve(true);
            })
            .catch((e) => {
                printError("Error converting bytes to buffer:", e);
                return reject(e);
            });
    })
}

/**
 *Convert an image to bytes.
 */
function convertImageToBytes(imagePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return reject(err);
            } else {
                const bytes = [...data];
                return resolve(bytes);
            }
        });
    });
}

/**
 *Convert an image to buffer.
 */
function convertImageToBuffer(imagePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    });
}

/**
 * Asynchronously multiple stores images (array of url-data) in the system.
 *
 * @param {Object} options - The options object.
 * @param {Array} options.names - Array of image names.
 * @param {Array|String} options.pathPrefix - Path prefix for storing images.
 * @param {Array} options.dataUrls - Array of image data URLs.
 * @param {String} options.ext - Image file extension (default is empty).
 * @returns {Promise<Object>} - A promise that resolves to an object containing saved image names as keys:
 *                              Promise Object: <code> {image1: true||false||error-msg (saved or not),  ...rest} </code>
 * @throws {Error} - Throws an error if storing images fails (implicitly handled).
 *
 * @example
 * // Usage example:
 * const names = ['image1', 'image2'];
 * const pathPrefix = '/path/to/images' or ['/path/to/images'] or ['/path/to/images', '/path2/to2/images2'];
 * const dataUrls = ['data:image/jpeg;base64,...', 'data:image/png;base64,...'];
 * const savedImages = await storeImages({ names, pathPrefix, dataUrls });
 * console.log(savedImages); // Output: { image1: true||false||error-msg (saved or not), ...rest }
 */
async function storeImagesInSystem({names = [], pathPrefix = [] || '', dataUrls = [], ext = '', sep = ''}) {
    return new Promise(async (resolve, reject) => {
        if (!checkNullArr(names) || (isArr(pathPrefix) ? !checkNullArr(pathPrefix) : !checkNullStr(pathPrefix)) || !checkNullArr(dataUrls)) return resolve({});
        try {
            const savedImages = {};
            for (let i = 0; i < names.length; i++) {
                const name = names[i];
                const dataUrl = dataUrls[i];
                let pathOnly = isArr(pathPrefix) ? getDefValueStr(pathPrefix[i], pathPrefix[0]) : pathPrefix + '';
                // if (!(pathOnly + '').endsWith('/') || !(pathOnly + '').endsWith('\\')) pathOnly = pathOnly + '/';
                const imagePath = `${pathOnly}${sep}${name}${ext}`;
                try {
                    const imgBytes = convertImageDataURLToByteArr(dataUrl);
                    const imageBuffers = await convertBytesToImageBuffer(imgBytes);
                    storeImageBufferInSystem(imageBuffers, imagePath);
                    savedImages[name] = true;

                    if (i === names.length - 1) return resolve(savedImages);
                } catch (e) {
                    printError(TAG, e);
                    savedImages[name] = e;
                    if (i === names.length - 1) return resolve(savedImages);
                }
            }
        } catch (e) {
            printError(TAG, e);
            return resolve({});
        }
    });
};

// async function convertPdfToByteArray(pdfPath) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const pdfBytes = await fs.promises.readFile(pdfPath);
//             const pdfDoc = await PDFDocument.load(pdfBytes);
//             const byteArray = await pdfDoc.save();
//             return resolve(byteArray);
//         } catch (e) {
//             printError(e);
//             return reject(e);
//         }
//     })
// }

async function convertPdfIntoDataUrl(pdfPath, encoding = 'base64') {
    return new Promise((resolve, reject) => {
        fs.readFile(pdfPath, (err, data) => {
            if (err) {
                return reject(err);
            } else {
                const dataUrl = `data:application/pdf;${encoding},${data.toString(encoding)}`;
                return resolve(dataUrl);
            }
        });
    });
}

async function convertFileToBlob(filePath) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const stream = fs.createReadStream(filePath);

        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        stream.on('error', (err) => {
            printError(TAG, "convertFileToBlob.err:", err);
            return resolve({});
        });

        stream.on('end', () => {
            const blob = new Blob(chunks);
            return resolve(blob);
        });
        // fs.readFile(filePath, (err, data) => {
        //     if (err) {
        //         printError(TAG, "convertFileToBlob.err:", err);
        //         return resolve({});
        //     } else {
        //         const blob = new Blob([data], {type: 'application/octet-stream'});
        //         return resolve(blob);
        //     }
        // });
    });
}

function convertDataUrlToBlob(dataUrl) {
    return new Promise((resolve, reject) => {
        try {
            const base64String = dataUrl.split(',')[1];
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const out = new Blob([byteArray], {type: 'application/octet-stream'});
            return resolve(out);
        } catch (e) {
            printError(TAG, "convertDataUrlToBlob.err:", e);
            return resolve({});
        }
    })
}

/**
 * Creates a timeout that executes the provided callback function after the specified duration.
 * Optionally, clears the timeout immediately after the callback execution based on the clearImmediately parameter.
 *
 * @param {number} duration - The duration in milliseconds after which the callback will be executed.
 * @param {Function} callback - The function to be executed after the specified duration.
 * @param {boolean} [clearImmediately=true] - Determines whether to clear the timeout immediately after callback execution. Defaults to <code>true</code>.
 *
 * @example
 * // Case 1: Clears the timeout immediately after callback execution
 * createTimeout(3000, () => {
 *   console.log("Timeout executed after 3 seconds.");
 * });
 *
 * // Case 2: Does not clear the timeout immediately after callback execution
 * createTimeout(5000, () => {
 *   console.log("Timeout executed after 5 seconds.");
 * }, false);
 */
function createTimeout(callback, duration, clearImmediately = true) {
    const timeoutId = setTimeout(() => {
        if (checkNull(callback)) callback();
        if (isBoolTrue(clearImmediately)) clearTimeout(timeoutId);
    }, duration);
    if (!isBoolTrue(clearImmediately)) clearTimeout(timeoutId);
}

function parseInteger(value, defValue = 0) {
    return checkNullStr(value) && !isNaN(value) ? parseInt(value) : defValue;
}

// const imagemin = require('imagemin');
// const imageminMozjpeg = require('imagemin-mozjpeg');
// /**
//  * Reduce image size using "imagemin" and "imagemin-mozjpeg" libraries.
//  */
// function reduceImageSize(imagePath, quality = 'low', maxFileSize = 100) {
//     return new Promise((resolve, reject) => {
//         imagemin.buffer(imagePath, {
//             plugins: [imageminMozjpeg({quality, maxFileSize})],
//         })
//             .then((optimizedImageBuffer) => {
//          return       resolve(optimizedImageBuffer);
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     });
// }
// =================================Node functions end================================

module.exports = {
    TAG,
    DebugModeOn,
    printLog,
    printError,
    appendFile,
    getArrLen,
    sliceArr,
    createFile,
    writeFile,
    readFileToArr,
    readFile,
    readJsonFileAsync,
    readJsonFile,
    readCurrDirFile,
    readCurrDirJsonFile,
    getCurrDirFile,
    getDir,
    getDirFiles,
    parseInteger,
    readCSV,
    fileExistsSync,
    createMySQLConnection,
    getCurrDateTime,
    getFileDirName,
    getFileDir,
    getFileName,
    getFileExt,
    renameFilesWithPrefix,
    renameFilesWithPostfix,
    renameFiles,
    renameFilesWithReplace,
    sendResponseOnNullField,
    sendResponse,
    sendErrResponse,
    sendResponseOnEmptyField,
    formatDate,
    formatDateAdvance,
    transformListsIntoJson,
    sendResponseOnEmptyJsonValues,
    sendResponseOnEmptyFields,
    formatJson,
    checkNullInputValues,
    arrayHasStr,
    sanitizeJsonStr,
    makeJsonDataUploadable,
    isCharAtEnd,
    isJson,
    isCharAtStart,
    isNull,
    getDefValue,
    getDefValueStr,
    isArr,
    checkNullJson,
    checkNull,
    checkNullStr,
    trim,
    checkObjEqual,
    deleteJsonKey,
    isStr,
    strToJson,
    jsonHasKey,
    isArrEmpty,
    toJsonStr,
    checkNullArr,
    jsonToStr,
    deleteJsonValue,
    removeApostrophes,
    purifyFilename,
    factorial,
    isPrime,
    isArmstrong,
    splitAnything,
    extractString,
    randomInt,
    compareJsonItems,
    randomStr,
    sortJsonList,
    getMatchingStrFromArr,
    getStrInitials,
    removeArrItem,
    isBoolTrue,
    boolToBinary,
    isValueBool,
    isBinaryTrue,
    getBoolValue,
    binaryToBool,
    binaryToYN,
    boolToYN,
    formatFileSize,
    getTextSize,
    mapJsonKeys,
    filterArrWithStart,
    filterArrWithContain,
    filterArrWithEnd,
    getJsonListKeys,
    filterJsonDataWithList,
    addSpaceBeforeStringUppercaseLetters,
    mergeJsons,
    changeStringCase,
    jsonDataToLists,
    formatIndianCurrency,
    populateArr,
    getSMNameFromUrl,
    getDefJsonValue,
    getJsonKeyName,
    concatStrings,
    getDefStrValueWithPostfix,
    getDefStrValueWithPrefix,
    convertBytesToImageBuffer,
    storeImageBufferInSystem,
    storeImageBytesInSystem,
    convertImageToBytes,
    convertImageToBuffer,
    storeImagesInSystem,
    convertBytesListToImageBufferList,
    storeImageBufferListInSystem,
    storeImageBytesListInSystem,
    getFileSize, // convertPdfToByteArray,
    convertImageDataURLToByteArr,
    convertImageDataURLListToByteArrList,
    convertByteArrToImageDataURL,
    convertImageIntoByteArr,
    convertDataUrlToBlob,
    convertFileToBlob,
    convertPdfIntoDataUrl,
    convertImageIntoDataUrl,
    dropArrValue,
    getArrIndexValue,
    getNestedArrIndexValue,
    geStrArrIndexValue,
    formatTimeMS,
    getSqlUploadableStr,
    jsonHasNestedKey,
    getPopulatedArr,
    replaceInString,
    calcDuration,
    convertObjToArr,
    getStrSplitArrIndexValue,
    getJsonValueFromNestedKeys,
    dropArrEmptyValues,
    dropArrDuplicates,
    dropListEmptyElements,
    checkNullArrWithDropEmpty,
    reorderJsonObjKeys,
    reorderJsonList,
    combineJsonValues,
    getDirItems,
    jsonValueIncludes,
    getDefJsonValueByCompare,
    deleteFile,
    isJsonValueTrue,
    createTimeout,
    moveJsonListItems,
    dropJsonListDuplicates,
    saveLogs, // reduceImageSize,
};
