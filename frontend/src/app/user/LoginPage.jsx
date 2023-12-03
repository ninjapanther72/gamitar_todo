import React, {useState} from 'react'
import {App_THEME_VARIANT as THEME, BaseReqUrl, GlobalKeyStore, ReqUrls, RouteUrls} from "../config/AppConfig";
import Button from "../../trident-react-ui/Button";
import {Anchor, Flexbox, Input, Label, Section} from "../../trident-react-ui";
import {CssVariant, FormInputCls} from "../../trident-react-ui/config/TridentConfigs";
import {useNavigate} from "react-router-dom";
import {focusFormIdElement, printError, printLog} from "../util/AppUtils";
import {
    changeStringCase,
    checkNullStr,
    getDefJsonValue,
    getJsonValueFromNestedKeys,
    isBoolTrue,
    isJsonValueTrue,
    jsonToStr,
    trimJsonValues
} from "../../trident-react-ui/ReactUtils";
import axios from "axios";

const LoginPage = ({}) => {
    const TAG = 'LoginPage';

    const navigate = useNavigate();

    const Fields = {
        username: 'username',
        password: 'password',
        submitAsLoader: 'submitAsLoader',
        submitDisable: 'submitDisable',

        panelMsg: 'panelMsg',
        panelMsgColor: 'panelMsgColor',
    };
    const [fieldsData, setFieldsData] = useState({});

    return (<div className={`row m-0 p-0 mt-2 jc-center`}>
        <div className={`m-0 p-0 jc-center col-sm-8 col-md-4 px-2 pb-1`}>
            <Section
                className={'px-5 py-3 w-100 h-auto'}
                title={'Login'}
                shadowVariant={'sm'}>
                <div className={'w-100 row p-0 m-0 mt-2'}>
                    {/*username/email/mobile*/}
                    <Input
                        variant={THEME}
                        wrapperClassName={`${FormInputCls._12_12}`}
                        className={`px-2`}
                        type={"text"}
                        id={Fields.username}
                        showMsg={false}
                        placeholder={'Enter Username/Email/Mobile'}
                        label={'Username/Email/Mobile'}
                        value={getFieldValue(Fields.username)}
                        validate={false}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={false}
                        onChange={(e, isValid) => {
                            const value = e.target.value;
                            updateFieldValue(Fields.username, value);
                            panelMsg('');
                        }}
                    />

                    {/*password*/}
                    <Input
                        variant={THEME}
                        wrapperClassName={`${FormInputCls._12_12}`}
                        className={`px-2`}
                        type={"password"}
                        id={Fields.password}
                        showMsg={false}
                        placeholder={'Enter Password'}
                        label={'Password'}
                        value={getFieldValue(Fields.password)}
                        validate={false}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={false}
                        showMsgOverride={checkNullStr(getFieldValue(Fields.panelMsg))}
                        onChange={(e, isValid) => {
                            const value = e.target.value;
                            updateFieldValue(Fields.password, value);
                            panelMsg('');
                        }}
                    />
                </div>

                <div className={'w-100 m-0 p-0 px-2'}>
                    {/*msg-box*/}
                    {checkNullStr(getFieldValue(Fields.panelMsg)) && <Flexbox className={'mt-0 bg-infox'} justifyAt={'center'}>
                        <Label className={'p-0 m-0 w-100 fs-md'} textAt={'center'} color={getFieldValue(Fields.panelMsgColor, 'black')}>
                            {getFieldValue(Fields.panelMsg)}
                        </Label>
                    </Flexbox>}

                    {/*submit*/}
                    <Flexbox className={'mt-2'} justifyAt={'center'}>
                        <Button
                            className={'w-100 px-3 py-2 shadow-none'}
                            text={'Login'}
                            variant={CssVariant.primary}
                            disabled={isFieldValueTrue(Fields.submitDisable)}
                            asLoading={isFieldValueTrue(Fields.submitAsLoader)}
                            loadingColorVariant={CssVariant.warning}
                            textOnLoading={true}
                            loadingWidth={'100%'}
                            onClick={handleLogin}
                        />
                    </Flexbox>

                    {/*forgot-pw, sign-up*/}
                    <Flexbox className={'w-100 mt-2'} justifyAt={'between'}>
                        {/*forgot-pw*/}
                        <Anchor
                            className={'m-1 fs-sm'}
                            asLink={true}
                            href={RouteUrls.forgotUserPw}>
                            Forgot Password
                        </Anchor>

                        {/*sign-up*/}
                        <Anchor
                            className={'m-1 fs-sm'}
                            asLink={true}
                            href={RouteUrls.signUp}>
                            Register
                        </Anchor>
                    </Flexbox>
                </div>
            </Section>
        </div>
    </div>)

    async function handleLogin() {
        const fun = "handleLogin:";
        // log('fieldsData:', fieldsData);
        panelMsg('');
        try {
            const dataToSend = getUpdatedFormData();
            let checkedReqFields = checkRequiredFields(dataToSend);

            // log(fun, "dataToSend:", dataToSend);
            // checkedReqFields = false;//for testing

            if (checkedReqFields) {
                updateFieldValue(Fields.submitDisable, true);
                updateFieldValue(Fields.submitAsLoader, true);
                log(`Loging in...`);

                const REQUEST_OPTIONS = {
                    ...dataToSend,
                };

                axios.post(BaseReqUrl + ReqUrls.login, REQUEST_OPTIONS)
                    .then(async (res) => {
                        const fetchedData = await res.data;
                        // log(fun, "fetchedData:", fetchedData);

                        const message = changeStringCase(getDefJsonValue(fetchedData, 'message'), 'sentence') + '';
                        let success = isJsonValueTrue(fetchedData, 'success');

                        const userData = getJsonValueFromNestedKeys(fetchedData, ['data', 'userData'], {});
                        const authToken = getJsonValueFromNestedKeys(fetchedData, ['data', 'token']);
                        // userData[GlobalKeyStore.userAuthToken] = authToken;

                        localStorage.setItem(GlobalKeyStore.userSessionLsData, jsonToStr(userData))
                        localStorage.setItem(GlobalKeyStore.userAuthToken, authToken)
                        setAuthToken(authToken);
                        if (success) {
                            panelMsg(message);
                            navigate(RouteUrls.home);
                            window.location.reload();
                        } else {
                            panelMsgErr(message);
                        }

                        updateFieldValue(Fields.submitDisable, false);
                        updateFieldValue(Fields.submitAsLoader, false);

                    })
                    .catch((err) => {
                        printError(fun, err);
                    })

                // await sendRequest({
                //     reqUrl: ReqUrls.login,
                //     reqOptions: REQUEST_OPTIONS,
                //     onFetched: ((fetchedData) => {
                //         log(fun, "fetchedData:", fetchedData);
                //         const message = changeStringCase(getDefJsonValue(fetchedData, 'message'), 'sentence') + '';
                //         let success = isJsonValueTrue(fetchedData, 'success');
                //
                //         const userData = getJsonValueFromNestedKeys(fetchedData, ['data', 'userData'], {});
                //         const authToken = getJsonValueFromNestedKeys(fetchedData, ['data', 'token']);
                //         userData[GlobalKeyStore.userAuthToken] = authToken;
                //
                //         localStorage.setItem(GlobalKeyStore.userSessionLsData, jsonToStr(userData))
                //         // localStorage.setItem(GlobalKeyStore.userAuthToken, authToken)
                //
                //         if (success) {
                //             // navigate(RouteUrls.home);
                //             panelMsg(message);
                //         } else {
                //             panelMsgErr(message);
                //         }
                //
                //         updateFieldValue(Fields.submitDisable, false);
                //         updateFieldValue(Fields.submitAsLoader, false);
                //     }),
                //     onError: ((e) => {
                //         logErr(fun, e);
                //         updateFieldValue(Fields.submitDisable, false);
                //         updateFieldValue(Fields.submitAsLoader, false);
                //     })
                // });
            }
        } catch (e) {
            logErr(fun, e);
            updateFieldValue(Fields.submitDisable, false);
            updateFieldValue(Fields.submitAsLoader, false);
        }
    }

    function setAuthToken(authToken) {
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = `${authToken}`;
            // axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        } else {
            // axios.defaults.headers.common['Authorization'];
        }
    }

    function getUpdatedFormData() {
        let outData = {};
        try {
            let updatedFormData = {[Fields.username]: getFieldValue(Fields.username), [Fields.password]: getFieldValue(Fields.password)};
            updatedFormData = trimJsonValues(updatedFormData);
            outData = updatedFormData;
        } catch (e) {
            logErr(e);
        }
        return outData;
    }

    function checkRequiredFields(formData = {}) {
        const requiredFields = [
            Fields.username,
            Fields.password,
        ];

        for (const field of requiredFields) {
            // log(`checkRequiredFields.formData[${field}]:`, formData[field], 'not-null:', checkNullStr(formData[field]));
            if (!checkNullStr(formData[field])) {
                panelMsgErr(`'${changeStringCase(field, 'capitalize')}' cannot be empty!`);
                focusIdField(field);
                return false;
            }
        }
        // log("Everything is in order, you can proceed");
        panelMsg('');
        return true;
    }

    function focusIdField(id, onlyFocus = false) {
        focusFormIdElement(id, onlyFocus, 1500);
    }


    function updateFieldValue(field, value) {
        // log(`updateFieldValue.field: ${field}, value: `, value);
        setFieldsData(prevState => ({...prevState, [field]: value}));
    }

    function getFieldValue(field, defValue) {
        return getDefJsonValue(fieldsData, field, defValue);
    }

    function isFieldValueTrue(field) {
        return isBoolTrue(getFieldValue(field));
    }

    function log(...text) {
        printLog(TAG, ...text);
    }

    function logErr(...text) {
        printError(TAG, ...text);
    }

    function panelMsg(...text) {
        log(...text);
        updateFieldValue(Fields.panelMsgColor, 'black');
        updateFieldValue(Fields.panelMsg, text);
    }

    function panelMsgErr(text) {
        logErr(...text);
        updateFieldValue(Fields.panelMsgColor, 'red');
        updateFieldValue(Fields.panelMsg, text);
    }
}
export default LoginPage;
