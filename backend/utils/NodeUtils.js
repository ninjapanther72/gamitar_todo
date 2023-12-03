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

function parseInteger(value, defValue = 0) {
    return checkNullStr(value) && !isNaN(value) ? parseInt(value) : defValue;
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

function trim(str) {
    return (str + '').trim();
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

module.exports = {
    TAG,
    DebugModeOn,
    printLog,
    printError,
    getArrLen,
    getArrIndexValue,
    getNestedArrIndexValue,
    parseInteger,
    getCurrDateTime,
    sendResponse,
    formatDate,
    formatDateAdvance,
    isBoolTrue,
    boolToBinary,
    checkNullJson,
    checkNull,
    checkNullStr,
    trim,
    checkNullArr,
    getDefJsonValue
}
