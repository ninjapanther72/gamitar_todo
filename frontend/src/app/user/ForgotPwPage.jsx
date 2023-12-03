import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Anchor, Flexbox, Input, Label, Section} from "../../trident-react-ui";
import {focusFormIdElement, printError, printLog, sendRequest} from "../util/AppUtils";
import {changeStringCase, checkNullStr, getDefJsonValue, isBoolTrue, isJsonValueTrue, trimJsonValues} from "../../trident-react-ui/ReactUtils";
import {App_THEME_VARIANT as THEME, ReqUrls, RouteUrls} from "../config/AppConfig";
import {CssVariant, FormInputCls} from "../../trident-react-ui/config/TridentConfigs";
import Button from "../../trident-react-ui/Button";
import {useNavigate} from "react-router-dom";

const ForgotPwPage = ({}) => {
    const TAG = "ForgotPwPage";
    const navigate = useNavigate();

    const [showResetPwPanel, setShowResetPwPanel] = useState(false);

    const Fields = {
        confirmEmail: 'Email',
        currPw: 'Current Password',
        newPw: 'New Password',
        newPwConfirm: 'Confirm Password',

        emailConfirm_Submit_Disable:
            'emailConfirm_Submit_Disable',
        emailConfirm_Submit_AsLoader: 'emailConfirm_Submit_AsLoader',

        resetPw_Submit_Disable: 'resetPw_Submit_Disable',
        resetPw_Submit_AsLoader: 'resetPw_Submit_AsLoader',

        panelMsg: 'panelMsg',
        panelMsgColor: 'panelMsgColor',
    };
    const [fieldsData, setFieldsData] = useState({});

    useEffect(() => {

    }, []);

    return (<>
        <div className={`row m-0 p-0 mt-2 jc-center`}>
            <div className={`m-0 p-0 jc-center col-sm-8 col-md-4 px-2 pb-1`}>
                <Section
                    className={'px-5 py-3 w-100 h-auto'}
                    title={'Reset Password'}
                    shadowVariant={'sm'}>
                    {showResetPwPanel ? createResetPwPanel() : createEmailConfirmPanel()}

                    {/*login, sign-up*/}
                    <Flexbox className={'w-100 mt-0 px-2'} justifyAt={'between'}>
                        {/*login*/}
                        <Anchor
                            className={'m-1 fs-sm'}
                            asLink={true}
                            href={RouteUrls.login}>
                            Login
                        </Anchor>

                        {/*sign-up*/}
                        <Anchor
                            className={'m-1 fs-sm'}
                            asLink={true}
                            href={RouteUrls.signUp}>
                            Register
                        </Anchor>
                    </Flexbox>
                </Section>
            </div>
        </div>
    </>)

    function createEmailConfirmPanel() {
        return <div className={'w-100 p-0 m-0 mb-3'}>
            <Flexbox className={''} justifyAt={'center'}>
                <div>
                    <h3 className="text-center"><i className="fa fa-lock fa-4x"></i></h3>
                    <h2 className="text-center">Forgot Password?</h2>
                    <p className={'text-center'}>You can reset your password here.</p>
                </div>
            </Flexbox>

            <div className={'w-100 row p-0 m-0'}>
                {/*email*/}
                <Input
                    variant={THEME}
                    wrapperClassName={`${FormInputCls._12_12}`}
                    className={`px-2`}
                    type={"text"}
                    id={Fields.confirmEmail}
                    showMsg={false}
                    placeholder={'Enter Email/Username'}
                    label={'Email/Username'}
                    value={getFieldValue(Fields.confirmEmail)}
                    validate={false}
                    required={true}
                    floatingLabel={false}
                    placeholderAsLabel={false}
                    onChange={(e, isValid) => {
                        const value = e.target.value;
                        updateFieldValue(Fields.confirmEmail, value);
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
                        text={'Forgot Password'}
                        variant={CssVariant.primary}
                        disabled={isFieldValueTrue(Fields.emailConfirm_Submit_Disable)}
                        asLoading={isFieldValueTrue(Fields.emailConfirm_Submit_AsLoader)}
                        loadingColorVariant={CssVariant.warning}
                        textOnLoading={true}
                        loadingWidth={'100%'}
                        onClick={handleEmailCheckSubmit}
                    />
                </Flexbox>
            </div>
        </div>
    }

    function createResetPwPanel() {
        return <div className={'w-100 p-0 m-0 mb-3 mt-2 position-relative'}>
            {/*back-btn*/}
            <Button
                className={'p-2 position-absolute shadow-none highlight-dark-hover text-dark'}
                iconClass={'bi bi-arrow-left'}
                circular={true}
                width={'28px'}
                height={'28px'}
                style={{top: '-2rem', left: '-2rem'}}
                color={''}
                variant={''}
                onClick={() => {
                    setShowResetPwPanel(false);
                    updateFieldValue(Fields.confirmEmail, '');
                    panelMsg('');
                }}
            />

            <div className={'w-100 row p-0 m-0'}>
                {/*/!*currPw*!/*/}
                {/*<Input*/}
                {/*    variant={THEME}*/}
                {/*    wrapperClassName={`${FormInputCls._12_12}`}*/}
                {/*    className={`px-2`}*/}
                {/*    type={"password"}*/}
                {/*    id={Fields.currPw}*/}
                {/*    showMsg={false}*/}
                {/*    placeholder={'Enter Current Password'}*/}
                {/*    label={'Current Password'}*/}
                {/*    value={getFieldValue(Fields.currPw)}*/}
                {/*    validate={false}*/}
                {/*    required={true}*/}
                {/*    floatingLabel={false}*/}
                {/*    placeholderAsLabel={false}*/}
                {/*    onChange={(e, isValid) => {*/}
                {/*        const value = e.target.value;*/}
                {/*        updateFieldValue(Fields.currPw, value);*/}
                {/*        panelMsg('');*/}
                {/*    }}*/}
                {/*/>*/}

                {/*newPw*/}
                <Input
                    variant={THEME}
                    wrapperClassName={`${FormInputCls._12_12}`}
                    className={`px-2`}
                    type={"password"}
                    id={Fields.newPw}
                    showMsg={false}
                    placeholder={'Enter New Password'}
                    label={'New Password'}
                    value={getFieldValue(Fields.newPw)}
                    validate={false}
                    required={true}
                    floatingLabel={false}
                    placeholderAsLabel={false}
                    onChange={(e, isValid) => {
                        const value = e.target.value;
                        updateFieldValue(Fields.newPw, value);
                        panelMsg('');
                    }}
                />

                {/*newPwConfirm*/}
                <Input
                    variant={THEME}
                    wrapperClassName={`${FormInputCls._12_12}`}
                    className={`px-2`}
                    type={"password"}
                    id={Fields.newPwConfirm}
                    showMsg={false}
                    placeholder={'Confirm Password'}
                    label={'Confirm Password'}
                    value={getFieldValue(Fields.newPwConfirm)}
                    validate={false}
                    required={true}
                    floatingLabel={false}
                    placeholderAsLabel={false}
                    onChange={(e, isValid) => {
                        const value = e.target.value;
                        updateFieldValue(Fields.newPwConfirm, value);
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
                        text={'Reset Password'}
                        variant={CssVariant.primary}
                        disabled={isFieldValueTrue(Fields.resetPw_Submit_AsLoader)}
                        asLoading={isFieldValueTrue(Fields.resetPw_Submit_Disable)}
                        loadingColorVariant={CssVariant.warning}
                        textOnLoading={true}
                        loadingWidth={'100%'}
                        onClick={handleForgotPwSubmit}
                    />
                </Flexbox>
            </div>
        </div>
    }

    async function handleEmailCheckSubmit() {
        const fun = 'handleEmailCheckSubmit:';
        try {
            const dataToSend = getUpdatedFormData();
            let proceed = checkRequiredFields(dataToSend);
            // log(fun, "dataToSend:", dataToSend);
            // proceed = false;
            if (proceed) {
                updateFieldValue(Fields.emailConfirm_Submit_AsLoader, true);
                updateFieldValue(Fields.emailConfirm_Submit_Disable, true);

                const REQUEST_OPTIONS = {
                    ...dataToSend,
                };
                await sendRequest({
                    reqUrl: ReqUrls.forgotUserPw_EmailExistCheck, reqOptions: REQUEST_OPTIONS, onFetched: ((fetchedData) => {
                        // log(fun, 'fetchedData:', fetchedData);

                        const message = getDefJsonValue(fetchedData, 'message');
                        const success = isJsonValueTrue(fetchedData, 'success');
                        if (success) {
                            // panelMsg(message);
                            panelMsg('');
                            setShowResetPwPanel(true);
                        } else {
                            panelMsgErr(message);
                        }

                        updateFieldValue(Fields.emailConfirm_Submit_AsLoader, false);
                        updateFieldValue(Fields.emailConfirm_Submit_Disable, false);
                    }), onError: (e => {
                        logErr(fun, e);
                        panelMsgErr('Email confirmation failed!');
                        updateFieldValue(Fields.emailConfirm_Submit_AsLoader, false);
                        updateFieldValue(Fields.emailConfirm_Submit_Disable, false);
                    })
                });
            }
        } catch (e) {
            logErr(fun, e);
            panelMsgErr('Email confirmation failed!');
            updateFieldValue(Fields.emailConfirm_Submit_AsLoader, false);
            updateFieldValue(Fields.emailConfirm_Submit_Disable, false);
        }
    }

    async function handleForgotPwSubmit() {
        const fun = 'handleForgotPwSubmit:';
        try {
            const dataToSend = getUpdatedFormData();
            let proceed = checkRequiredFields(dataToSend);
            // log(fun, "dataToSend:", dataToSend);
            // proceed = false;
            if (proceed) {
                updateFieldValue(Fields.resetPw_Submit_AsLoader, true);
                updateFieldValue(Fields.resetPw_Submit_Disable, true);

                const REQUEST_OPTIONS = {
                    ...dataToSend,
                };
                await sendRequest({
                    reqUrl: ReqUrls.forgotUserPw_ResetPw, reqOptions: REQUEST_OPTIONS, onFetched: ((fetchedData) => {
                        // log(fun, 'fetchedData:', fetchedData);

                        const message = getDefJsonValue(fetchedData, 'message');
                        const success = isJsonValueTrue(fetchedData, 'success');
                        if (success) {
                            panelMsg(message);
                            navigate(RouteUrls.login);
                        } else {
                            panelMsgErr(message);
                        }
                        updateFieldValue(Fields.resetPw_Submit_AsLoader, false);
                        updateFieldValue(Fields.resetPw_Submit_Disable, false);
                    }),
                    onError: (e => {
                        logErr(fun, e);
                        panelMsgErr('Password Reset failed!');
                        updateFieldValue(Fields.resetPw_Submit_AsLoader, false);
                        updateFieldValue(Fields.resetPw_Submit_Disable, false);
                    })
                });
            }
        } catch (e) {
            logErr(fun, e);
            panelMsgErr('Password Reset failed!');
            updateFieldValue(Fields.resetPw_Submit_AsLoader, false);
            updateFieldValue(Fields.resetPw_Submit_Disable, false);
        }
    }

    function getUpdatedFormData() {
        let outData = {};
        try {
            let updatedFormData = {
                ...fieldsData,

                username: getFieldValue(Fields.confirmEmail),
                email: getFieldValue(Fields.confirmEmail),
                password: getFieldValue(Fields.newPw),
                currentPassword: getFieldValue(Fields.currPw),
                newPassword: getFieldValue(Fields.newPw),
                confirmPassword: getFieldValue(Fields.newPw),
            };
            updatedFormData = trimJsonValues(updatedFormData);
            outData = updatedFormData;
        } catch (e) {
            logErr(e);
        }
        return outData;
    }

    function checkRequiredFields(formData = {}) {
        const requiredFields = [];
        if (showResetPwPanel) {
            // requiredFields.push(Fields.currPw);
            requiredFields.push(Fields.newPw);
            requiredFields.push(Fields.newPwConfirm);
        } else {
            requiredFields.push(Fields.confirmEmail);
        }
        for (const field of requiredFields) {
            // log(`checkRequiredFields.formData[${field}]:`, formData[field], 'not-null:', checkNullStr(formData[field]));
            if (!checkNullStr(formData[field])) {
                panelMsgErr(`'${changeStringCase(field, 'capitalize')}' cannot be empty!`);
                focusIdField(field);
                return false;
            }
        }
        if (showResetPwPanel) {
            // log('checkRequiredFields.pw:', getFieldValue(Fields.newPw), 'newPw:', getFieldValue(Fields.newPw));
            if (getFieldValue(Fields.newPw) !== getFieldValue(Fields.newPwConfirm)) {
                panelMsgErr(`Password don't match!`);
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
ForgotPwPage.propTypes = {
    className: PropTypes.string, children: PropTypes.any, style: PropTypes.object,
};
export default ForgotPwPage;
