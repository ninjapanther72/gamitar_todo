import moment from "moment/moment";
import $ from 'jquery'

const TAG = "ReactUtils.js"

// =================================UI functions start================================
/**
 * Switch focus between elements of a list on tab press:
 */
export function handleTabFocus(elements = [], onTabClick) {
    let index = 0;
    const lastIndex = elements.length - 1;
    // elements[0].focus();
    $(elements[0]).focus();

    document.addEventListener('keydown', event => {
        if (event.key === 'Tab') {
            event.preventDefault();
            if (checkNull(onTabClick)) onTabClick(event);
            if (index === lastIndex) {
                index = 0;
            } else {
                index++;
            }
            $(elements[index]).focus();
            // elements[index].focus();
        }
    });
}

export function getParentHeight2(child, unit = "") {
    const parentH = child.parentNode.clientHeight;
    return checkNullStr(unit) ? parentH + unit : parentH;
}

export function getElement(src, selector = "id" || "class" || "tag" || "name") {
    let element = null;
    switch (selector) {
        case "class":
            element = document.getElementsByClassName(src);
            break;
        case "id":
            element = document.getElementById(src);
            break;
        case "name":
            element = document.getElementsByName(src);
            break;
        default:
            element = document.getElementsByTagName(src);
            break;
    }
    return element;
}

export function setTabTitle(title) {
    try {
        document.title = title;
    } catch (e) {
        printLog(e)
    }
}

export function getTabTitle() {
    return document.title;
}

export function webIcon(iconUrl) {
    if (iconUrl != null) {
        let head = document.getElementsByTagName("head")[0]
        if (head != null) {
            try {
                let link = document.createElement("link")
                link.rel = "shortcut icon"
                link.href = iconUrl
                head.appendChild(link)
            } catch (e) {
                printLog(e)
            }
        }
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
export function formatDate(date = new Date(), format = "yyyy-MM-DD") {
    return moment(date).format(format)
}

export function addClass(element, className, add = true, check = true) {
    if (checkNull(element)) {
        if (isBoolTrue(add)) {
            if (isBoolTrue(check)) {
                if (!element.classList.contains(className)) element.classList.add(className)
            } else {
                element.classList.add(className)
            }
        } else {
            if (isBoolTrue(check)) {
                if (element.classList.contains(className)) element.classList.remove(className)
            } else {
                element.classList.remove(className)
            }
        }
    }
}

export function addClassInElements(elements = [], className, add = true, check = true) {
    if (checkNullArr(elements)) {
        for (let item of elements) addClass(item, className, add, check)
    }
}

function getWindowSize() {
    window.addEventListener('resize', (e) => {
        printLog('window resized to: ', window.innerWidth, 'x', window.innerHeight)
    })
}

// =================================UI functions end================================


// =================================Common functions start================================

export function getDefValue(src, defValue = "", checkExtra = null) {
    return checkNull(src, checkExtra) ? src : checkNull(defValue) ? defValue : "";
}

export function getDefValueStr(src, defValue = "", trim = true) {
    return checkNullStr(src, trim) ? src : (checkNullStr(defValue, true) ? defValue : "");
}

export function getDefValueNum(src, defValue = 0, trim = true) {
    return checkNullStr(src, trim) ? src : defValue;
}

export function getDefValueBool(src, defValue = false, trim = true) {
    return checkNullStr(src, trim) ? src : defValue;
}

export function getDimensionUnit(size) {
    const unit = size.match(/[a-z]+$/i);
    if (unit && getDimensionUnits().includes(unit[0])) {
        return unit[0];
    } else {
        return "";
    }
}

export function getDimensionUnits() {
    return ["px", "rem", "vh", "vw", "em", "ex", "cm", "mm", "in", "pt", "pc", "vmin", "vmax", "ch"];
}

export function getSizeValue(size) {
    try {
        const match = size.match(/([\d.]+)(px|rem|em|vw|vh|vmin|vmax|ex|ch|mm|pt|in|%)/);
        if (match) {
            const value = parseFloat(match[1]);
            return isNaN(value) ? 0 : value;
        } else {
            return 0;
        }
    } catch (error) {
        return size;
    }
}

export function addSize(value1 = "", value2 = "") {
    if (checkNullStr(value1) && checkNullStr(value2)) {
        return (getSizeValue(value1) + getSizeValue(value2)) + getDimensionUnit(value1);
    } else {
        return value1
    }
}

export function subtractSize(value1 = "", value2 = "", addUnit = true) {
    if (checkNull(value1, "") && checkNull(value2, "")) {
        // return (parseInt(value1.split(unit)[0]) - parseInt(value2.split(unit)[0]))  + getDimensionUnit(value1);
        return (getSizeValue(value1) - getSizeValue(value2)) + (isBoolTrue(addUnit) ? getDimensionUnit(value1) : '');
    } else {
        return value1
    }
}

export function multSize(value1 = "", value2 = "") {
    if (checkNull(value1, "") && checkNull(value2, "")) {
        // return (parseInt(value1.split(unit)[0]) * parseInt(value2.split(unit)[0]))  + getDimensionUnit(value1);;
        return (getSizeValue(value1) * getSizeValue(value2)) + getDimensionUnit(value1);
    } else {
        return value1
    }
}

export function divSize(value1 = "", value2 = "") {
    if (checkNull(value1, "") && checkNull(value2, "")) {
        // return (parseInt(value1.split(unit)[0]) / value2) + getDimensionUnit(value1);
        return (getSizeValue(value1) / getSizeValue(value2)) + getDimensionUnit(value1);
    } else {
        return value1
    }
}


export function pxToVh(valueInPx) {
    return (valueInPx / window.innerHeight) * 100;
    return ((parseInteger((valueInPx + '').replace('px', ''))) / window.innerHeight) * 100;
}

export function isBoolTrue(boolValue, checkBinary = false, checkYN = false) {
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

export function isJsonValueTrue(obj, key, checkBinary = false, checkYn = false) {
    return isBoolTrue(getDefJsonValue(obj, key), checkBinary, checkYn);
}

export function getArrIndexValue(arr = [], index, defValue = 0) {
    try {
        return arr[index] || defValue
    } catch (e) {
        return defValue;
    }
}

export function isValueBool(value) {
    return checkNullStr(value, '') && (value === true || value === 'true' || value === false || value === 'false');
}

export function getBoolValue(value, checkBinary = false) {
    return isValueBool(value) ? value : isBoolTrue(checkBinary) ? isBinaryTrue(value) : false;
}

export function boolToBinary(value) {
    return isBoolTrue(value) ? 1 : 0;
}


export function concatStrings(srcList = [], connector = "", defValue = "", defNullValue = "", skipValues = ['']) {
    let outValue = "";
    if (!checkNullArr(srcList)) {
        return defValue;
    }
    if (!checkNullArr(skipValues)) skipValues = [''];
    for (let i = 0; i < srcList.length; i++) {
        const element = srcList[i];
        if (!checkNullStr(element, true)) {
            if (checkNullArr(skipValues) && !skipValues.includes(defNullValue)) {
                outValue += defNullValue;
                if (i < srcList.length - 1 && (checkNullArr(skipValues) && !skipValues.includes(srcList[i + 1]))) {
                    outValue += connector;
                }
            }
        } else if (checkNullArr(skipValues) && !skipValues.includes(element)) {
            outValue += element;
            if (i < srcList.length - 1 && (checkNullArr(skipValues) && !skipValues.includes(srcList[i + 1]))) {
                outValue += connector;
            }
        }
    }
    if ((outValue + "").trim() === (connector + "").trim()) {
        outValue = "";
    }
    return checkNullStr(outValue) ? outValue : defValue;
}

export function binaryToBool(value) {
    return isBinaryTrue(value);
}

export function isBinaryTrue(value) {
    return value === 1 || value === '1';
}

export function binaryToYN(value, yes = "Yes", no = "No") {
    return binaryToBool(value) ? yes : no;
}

export function boolToYN(value, yes = "Yes", no = "No") {
    return isBoolTrue(value) ? yes : no;
}

export function ynToBool(value, yes = "Yes") {
    return (value + "").toLowerCase() === (yes + "").toLowerCase();
}

export function ynToBinary(value, yes = "Yes") {
    return (value + "").toLowerCase() === (yes + "").toLowerCase() ? 1 : 0;
}

export function trim(str) {
    return (str + '').trim();
}

export function isStr(obj) {
    try {
        return typeof obj === 'string';
    } catch (e) {
        return false;
    }
}

export function isJson(obj) {
    try {
        const parsed = JSON.parse(obj);
        return true;
    } catch (e) {
        return false;
        // try {
        //     const parsed = JSON.stringify(obj);
        //     return true;
        // } catch (e) {
        //     return false;
        // }
    }
}

export function isCharAtEnd(str, at = 0, check = "") {
    return str.charAt(str.length - at) === check
}

export function isCharAtStart(str, at = 0, check = "") {
    return str.charAt(at) === check
}

/**
 * Returns true if the object is not null and not undefined.
 */
export function checkNull(obj, checkExtra = null) {
    return obj !== undefined && obj + "" !== 'undefined' && obj !== null && obj + "" !== 'null' && (obj + "").toLowerCase() !== 'nan' && obj !== checkExtra
}

export function checkNullReverse(obj, checkExtra = null) {
    return obj === undefined || obj + "" === 'undefined' || obj === null || obj + "" === 'null' || obj === checkExtra
}

/**
 * Returns true if the json-object is not null and not undefined and size is also not empty.
 */

export function checkNullJson(obj, dropEmpty = false) {
    try {
        let objX = obj;
        if (isBoolTrue(dropEmpty)) {
            objX = dropJsonNullValues(objX);
        }
        return Object.keys(objX).length > 0;
    } catch (e) {
        return false;
    }
}


/**
 * Returns true if the object is not null and not undefined.
 */
export function checkNullStr(obj, trim = true) {
    return checkNull(trim ? (obj + "").trim() : obj, '')
    // return checkNull(trim ? (obj + "").trim() : obj, null) !== ''
}

export function arrayHasStr(checkStr, strList, matchCase = false) {
    for (const listItem of strList) {
        if (matchCase ? (listItem + '').includes(checkStr) : (listItem + '').toLowerCase().includes((checkStr + '').toLowerCase())) {
            return true;
        }
    }
    return false;
}

/**
 * Returns true if all the input-values are not null otherwise false.
 */
export function checkNullInputValues(values = []) {
    let allGood = false;
    if (checkNullArr(values)) {
        for (let value of values) {
            if (checkNull(value, "")) {
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
export function checkObjEqual(obj, check = "[object Object]") {
    return obj !== check
}

export function isArrEmpty(obj = []) {
    // return (checkNull(obj)) && obj.length === 0
    return checkNullArr(obj) && obj.length === 0
}

export function checkNullArr(obj = [], dropEmpty = false) {
    if (isBoolTrue(dropEmpty)) {
        return ((checkNull(obj) && isArr(obj)) && obj.length > 0) && dropListEmptyElements(obj).length > 0;
    } else {
        return (checkNull(obj) && isArr(obj)) && obj.length > 0
    }
}

export function checkNullArrWithDropEmpty(obj = []) {
    return ((checkNull(obj) && isArr(obj)) && obj.length > 0) && checkNullArr(dropListEmptyElements(obj));
}

/**
 * Returns the array length if the object is array otherwise -1;
 */
export function getArrLen(obj = [], defValue = -1) {
    var len = 0;
    try {
        // len = checkNullArr(arr) ? arr.length : 0;
        // if (checkNullArr(arr)) {
        if (checkNull(obj) && obj.length > 0) {
            len = obj.length;
        }
    } catch (e) {
        len = defValue;
        // printLog(e);
    }
    return len;
}

export function getStrLen(str, defValue = 0) {
    return checkNullStr(str) ? (str + "").length : defValue;
}

/**
 * Returns the json-data size if the object is json otherwise -1;
 */
export function getJsonLen(obj = []) {
    var len = 0;
    try {
        if (checkNull(obj)) {
            len = Object.keys(obj).length;
        }
    } catch (e) {
        len = -1;
        printError(e);
    }
    return len;
}

export function isArr(obj) {
    return Array.isArray(obj);
}


export function jsonToStr(src, indent = 4, replacer = null) {
    try {
        let data = !isStr(src) ? JSON.stringify(src, replacer, indent) : src;
        // data = data.replaceAll("\"", "").replaceAll('"', "");
        return data;
    } catch (e) {
        // printError("jsonToStr:", e);
        return src;
    }
}

export function jsonHasKey(src, key) {
    try {
        return src.hasOwnProperty(key);
    } catch (error) {
        return false;
    }
}

export function getDefJsonValue(src, key, defValue = "") {
    let value = "";
    try {
        if (jsonHasKey(src, key)) value = src[key];
        if (!checkNullStr((value))) value = defValue;
    } catch (error) {
        value = defValue;
    }
    return value;
}

export function getJsonValueFromNestedKeys(obj, keys = [], defValue = {}, dropEmpty = false) {
    try {
        if (!checkNullJson(obj) || !checkNullArr(keys)) return defValue;
        let value = obj;
        for (let key of keys) {
            try {
                if (checkNullStr(key, true)) {
                    value = value[key];
                } else {
                    return value;
                }
            } catch (error) {
                return defValue;
            }
        }
        return value || defValue;
    } catch (error) {
        return defValue;
    }
}


export function getStrInitials(str, delimiter = ' ', limit = 2, middle = '', charAt = 0) {
    if (checkNull(str, "")) {
        let strArr = (str + '').split(delimiter);
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

export function sortJsonList(jsonList, sortKey) {
    try {
        jsonList.sort(compareJsonItems(sortKey));
        return jsonList;
    } catch (e) {
        printError(TAG, e);
        return jsonList;
    }
}

export function addSpaceBeforeStringUppercaseLetters(str) {
    return str.replace(/([A-Z])/g, ' $1');
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
export function changeStringCase(src, type = "upper" || "lower" || "camel" || "capitalize" || "sentence" || "variable", spaceCapitals = false) {
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
            }).replaceAll(/\s+/g, '');
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

export function trimJsonValues(obj) {
    if (!checkNullJson(obj)) return obj;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].trim();
            } else if (typeof obj[key] === 'object') {
                obj[key] = trimJsonValues(obj[key]);
            }
        }
    }
    return obj;
}

export function dropListEmptyElements(list = [], valuesToCheckToRemove = []) {
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

export function dropJsonNullValues(obj) {
    for (let key in obj) {
        if (!checkNullStr(obj[key])) {
            delete obj[key];
        }
    }
    return obj;
}

export function dropJsonListDuplicates(jsonList = [], targetKey) {
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

export function sliceArr(arr, start, end) {
    try {
        return arr.slice(start, end);
    } catch (e) {
        printError(TAG, e);
        return []
    }
}

export function parseInteger(value, defValue = 0) {
    return checkNullStr(value) && !isNaN(value) ? parseInt(value) : defValue;
}

export function printLog(...logs) {
    console.log(...logs);
}

export function printError(...logs) {
    console.error(...logs);
}

export function printWarn(...logs) {
    console.warn(...logs);
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
export function createTimeout(callback, duration, clearImmediately = true) {
    const timeoutId = setTimeout(() => {
        if (checkNull(callback)) callback();
        if (isBoolTrue(clearImmediately)) clearTimeout(timeoutId);
    }, duration);
    if (!isBoolTrue(clearImmediately)) clearTimeout(timeoutId);
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
export function moveJsonListItems(list, targetKey, commonKeyValue, moveUp = true) {
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
