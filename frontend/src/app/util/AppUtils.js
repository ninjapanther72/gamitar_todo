import {App_THEME_VARIANT, BaseReqUrl, DebugModeOn, GlobalKeyStore} from "../config/AppConfig";
import {
    checkNull,
    checkNullStr,
    createTimeout,
    getDefJsonValue,
    getElement,
    getJsonValueFromNestedKeys,
    isBoolTrue,
    parseInteger
} from "../../trident-react-ui/ReactUtils.js";
import axios from "axios";

const TAG = "AppUtils";

export async function sendRequest({
                                      reqUrl,
                                      reqOptions = {},
                                      // axiosConfig = AxiosConfig,
                                      type = 'post',
                                      setState,
                                      nestedKeys = [],
                                      tag = TAG,
                                      onFetchBegin = null,
                                      onFetched = null,
                                      onError = null,
                                      fun = 'sendRequest:'
                                  }) {
    return new Promise((resolve, reject) => {
        if (checkNull(onFetchBegin)) onFetchBegin();
        printLog(tag, `Sending request ${DebugModeOn ? `(via: ${reqUrl})` : ''}...`);
        // return axios[type](reqUrl, reqOptions, axiosConfig)
        // return axios[type](reqUrl, reqOptions)
        const authToken = getSessionAuthToken();
        // printLog(fun, tag, `authToken:`, authToken);

        axios.defaults.headers.common['Authorization'] = `${authToken}`;

        const axiosConfig = {
            // ...AxiosConfig,
            // headers: {
            //     ...AxiosConfig.headers,
            //     'Authorization': `Bearer ${authToken}`,
            // },

            baseURL: BaseReqUrl,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
                "X-Requested-With": "XMLHttpRequest",
                'Authorization': authToken,
            },
            withCredentials: true,
            // timeout: 5000
        };

        // return axios[type](BaseReqUrl + reqUrl, reqOptions, axiosConfig)
        // return axios[type](reqUrl, reqOptions, axiosConfig)
        return axios[type](BaseReqUrl + reqUrl, reqOptions, axiosConfig)
            .then(async (res) => {
                const fetchedData = await res.data;
                // printLog(fun, tag, `fetchedData:`, fetchedData);

                const data = getJsonValueFromNestedKeys(fetchedData, nestedKeys, fetchedData);
                if (setState) setState(data);
                if (checkNull(onFetched)) onFetched(fetchedData);
                return resolve(data);
            })
            .catch((err) => {
                printError(fun, tag, err);
                if (checkNull(onError)) onError(err);
                return reject(err);
            })
    });
}

export function focusFormIdElement(id, onlyFocus = false, inputFocusDuration = 3000) {
    try {
        if (checkNullStr(id)) {
            const element = getElement(id, 'id');
            // logTest("focusIdField.element:", element);
            createTimeout(() => {
                try {
                    element.focus();
                } catch (e) {
                    printError(TAG, e);
                }
                if (!isBoolTrue(onlyFocus)) {
                    try {
                        element.classList.remove(App_THEME_VARIANT);
                        element.classList.add("danger");
                        createTimeout(() => {
                            element.classList.remove("danger");
                            element.classList.add(App_THEME_VARIANT);
                        }, inputFocusDuration);
                    } catch (e) {
                        printError(TAG, e);
                    }
                }
            }, parseInteger(inputFocusDuration) / 4);
        }
    } catch (e) {
        printError(TAG, e);
    }
}


export function getSessionFieldValue(fieldKey, defValue) {
    return getDefJsonValue(getSessionData(), fieldKey, defValue);
}

export function getSessionAuthToken() {
    // return getDefJsonValue(getSessionFieldValue(GlobalKeyStore.userSessionLsData), GlobalKeyStore.userAuthToken);
    // return getJsonValueFromNestedKeys(getSessionData(), [GlobalKeyStore.userSessionLsData, GlobalKeyStore.userAuthToken]);
    // printLog('getSessionAuthToken.getSessionData():', getSessionData());
    return localStorage.getItem(GlobalKeyStore.userAuthToken);
}

export function getSessionData() {
    try {
        return JSON.parse(localStorage.getItem(GlobalKeyStore.userSessionLsData));
    } catch (e) {
        printError(TAG, 'getSessionFieldValue', e);
        return {};
    }
}

export function printLog(...logs) {
    if (DebugModeOn) console.log(...logs);
}

export function printError(...logs) {
    if (DebugModeOn) console.error(...logs);
}

export function printWarn(...logs) {
    if (DebugModeOn) console.warn(...logs);
}
