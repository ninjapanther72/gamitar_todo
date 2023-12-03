import React, {useState} from 'react'
import {App_THEME_VARIANT as THEME, ReqUrls, RouteUrls} from "../config/AppConfig";
import Button from "../../trident-react-ui/Button";
import {Anchor, Flexbox, Input, Label, Section} from "../../trident-react-ui";
import {CssVariant, FormInputCls, Patterns} from "../../trident-react-ui/config/TridentConfigs";
import {useNavigate} from "react-router-dom";
import {focusFormIdElement, printError, printLog, sendRequest} from "../util/AppUtils";
import {changeStringCase, checkNullStr, createTimeout, getDefJsonValue, isBoolTrue, isJsonValueTrue, trimJsonValues} from "../../trident-react-ui/ReactUtils";

const SignUpPage = ({}) => {
    const TAG = 'SignUpPage';

    const navigate = useNavigate();

    const Fields = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'username',
        password: 'password',
        mobile: 'mobile',
        email: 'email',

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
                title={'Register User'}
                shadowVariant={'sm'}>
                <div className={'w-100 row p-0 m-0'}>
                    {/*firstName*/}
                    <Input
                        variant={THEME}
                        wrapperClassName={`${FormInputCls._12_12}`}
                        className={`px-2`}
                        type={"text"}
                        id={Fields.firstName}
                        showMsg={false}
                        placeholder={'First Name'}
                        value={getFieldValue(Fields.firstName)}
                        validate={false}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={true}
                        onChange={(e, isValid) => {
                            const value = e.target.value;
                            updateFieldValue(Fields.firstName, value);
                            panelMsg('');
                        }}
                    />
                    {/*lastName*/}
                    <Input
                        variant={THEME}
                        wrapperClassName={`${FormInputCls._12_12}`}
                        className={`px-2`}
                        type={"text"}
                        id={Fields.lastName}
                        showMsg={false}
                        placeholder={'Last Name'}
                        value={getFieldValue(Fields.lastName)}
                        validate={false}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={true}
                        onChange={(e, isValid) => {
                            const value = e.target.value;
                            updateFieldValue(Fields.lastName, value);
                            panelMsg('');
                        }}
                    />
                    {/*username*/}
                    <Input
                        variant={THEME}
                        wrapperClassName={`${FormInputCls._12_12}`}
                        className={`px-2`}
                        type={"text"}
                        id={Fields.username}
                        showMsg={false}
                        placeholder={'Username'}
                        value={getFieldValue(Fields.username)}
                        validate={false}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={true}
                        onChange={(e, isValid) => {
                            const value = e.target.value;
                            updateFieldValue(Fields.username, value);
                            panelMsg('');
                        }}
                    />
                    {/*email*/}
                    <Input
                        variant={THEME}
                        wrapperClassName={`${FormInputCls._12_12}`}
                        className={`px-2`}
                        type={"email"}
                        id={Fields.email}
                        showMsg={false}
                        placeholder={'Email'}
                        value={getFieldValue(Fields.email)}
                        validate={false}
                        pattern={Patterns.email}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={true}
                        onChange={(e, isValid) => {
                            const value = e.target.value;
                            updateFieldValue(Fields.email, value);
                            panelMsg('');
                        }}
                    />
                    {/*mobile*/}
                    <Input
                        variant={THEME}
                        wrapperClassName={`${FormInputCls._12_12}`}
                        className={`px-2`}
                        type={"mobile"}
                        id={Fields.mobile}
                        showMsg={false}
                        placeholder={'Mobile'}
                        value={getFieldValue(Fields.mobile)}
                        validate={true}
                        pattern={Patterns.mobile}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={true}
                        onChange={(e, isValid) => {
                            const value = e.target.value;
                            if (isValid) updateFieldValue(Fields.mobile, value);
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
                        placeholder={'Password'}
                        label={'Create Password'}
                        value={getFieldValue(Fields.password)}
                        validate={false}
                        required={true}
                        floatingLabel={false}
                        placeholderAsLabel={false}
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
                            text={'Register'}
                            variant={CssVariant.primary}
                            disabled={isFieldValueTrue(Fields.submitDisable)}
                            asLoading={isFieldValueTrue(Fields.submitAsLoader)}
                            loadingColorVariant={CssVariant.warning}
                            textOnLoading={true}
                            loadingWidth={'100%'}
                            onClick={handleSubmit}
                        />
                    </Flexbox>

                    {/*login*/}
                    <Flexbox className={'w-100 mt-2'} justifyAt={'end'}>
                        {/*Login*/}
                        <Anchor
                            className={'m-1 fs-sm'}
                            asLink={true}
                            href={RouteUrls.login}>
                            Login
                        </Anchor>
                    </Flexbox>
                </div>
            </Section>
        </div>
    </div>)

    async function handleSubmit() {
        const fun = 'handleSubmit:';
        try {
            const dataToSend = getUpdatedFormData();
            let proceed = checkRequiredFields(dataToSend);
            // log(fun, "dataToSend:", dataToSend);
            // proceed = false;
            if (proceed) {
                updateFieldValue(Fields.submitAsLoader, true);
                updateFieldValue(Fields.submitDisable, true);

                const REQUEST_OPTIONS = {
                    ...dataToSend,
                };
                await sendRequest({
                    reqUrl: ReqUrls.registerUser, reqOptions: REQUEST_OPTIONS, onFetched: ((fetchedData) => {
                        // log(fun, 'fetchedData:', fetchedData);

                        const message = getDefJsonValue(fetchedData, 'message');
                        const success = isJsonValueTrue(fetchedData, 'success');
                        if (success) {
                            panelMsg(message);
                            createTimeout(() => {
                                panelMsg('Redirected to login page, you can log in from there...');
                                createTimeout(() => {
                                    setFieldsData({});
                                    navigate(RouteUrls.login);
                                }, 2000);
                            }, 2000);
                        } else {
                            panelMsgErr(message);
                        }
                        updateFieldValue(Fields.submitAsLoader, false);
                        updateFieldValue(Fields.submitDisable, false);
                    }),
                    onError: (e => {
                        logErr(fun, e);
                        panelMsgErr('Registration failed!');
                        updateFieldValue(Fields.submitAsLoader, false);
                        updateFieldValue(Fields.submitDisable, false);
                    })
                });
            }
        } catch (e) {
            logErr(fun, e);
            panelMsgErr('Registration failed!');
            updateFieldValue(Fields.submitAsLoader, false);
            updateFieldValue(Fields.submitDisable, false);
        }
    }

    function getUpdatedFormData() {
        let outData = {};
        try {
            let updatedFormData = {
                [Fields.username]: getFieldValue(Fields.username),
                [Fields.password]: getFieldValue(Fields.password),
                [Fields.email]: getFieldValue(Fields.email),
                [Fields.firstName]: getFieldValue(Fields.firstName),
                [Fields.lastName]: getFieldValue(Fields.lastName),
                [Fields.mobile]: getFieldValue(Fields.mobile),
            };
            updatedFormData = trimJsonValues(updatedFormData);
            outData = updatedFormData;
        } catch (e) {
            logErr(e);
        }
        return outData;
    }

    function checkRequiredFields(formData = {}) {
        const requiredFields = [
            Fields.firstName,
            Fields.lastName,
            Fields.username,
            Fields.email,
            Fields.mobile,
            Fields.password,
        ];

        for (const field of requiredFields) {
            // log(`checkRequiredFields.formData[${field}]:`, formData[field], 'not-null:', checkNullStr(formData[field]));
            if (!checkNullStr(formData[field])) {
                panelMsgErr(`'${changeStringCase(field, 'capitalize', true)}' cannot be empty!`);
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
export default SignUpPage;
