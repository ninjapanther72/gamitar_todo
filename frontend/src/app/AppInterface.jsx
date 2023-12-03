import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
// import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {useToast} from "./context/ToastContext";
import {Anchor, Avatar, Flexbox, HorDiv, Label} from "../trident-react-ui";
import {concatStrings, getDefJsonValue, isBoolTrue} from "../trident-react-ui/ReactUtils";
import {App_THEME_VARIANT, RouteUrls} from "./config/AppConfig";
import {getSessionFieldValue, printError, printLog} from "./util/AppUtils";
import {Menu, MenuItem} from "@mui/material";
import {Constants} from "../trident-react-ui/config/TridentConfigs";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AppInterface = ({
                          className = "",
                          children,
                          style = {},
                          disableMyAcLink = false
                      }) => {
    const TAG = "AppInterface";

    const {showToast, toastMsg, toastHideDur, toastVariant, changeToastVariant} = useToast();

    const loginUsername = getSessionFieldValue('name');
    const loginUserFullName = concatStrings([getSessionFieldValue('first_name'), getSessionFieldValue('last_name')], ' ');
    // log('loginUserFullName:', loginUserFullName, 'loginUsername:', loginUsername);

    const Fields = {
        avatarImgFile: 'avatarImgFile',
    };
    const [fieldsData, setFieldsData] = useState({});

    const [avatarDropdownAnchorEl, setAvatarDropdownAnchorEl] = useState(null);
    const canShowAvatarDropdown = Boolean(avatarDropdownAnchorEl);

    useEffect(() => {
        showToast(toastMsg);
        // printLog('useEffect.toastMsg:', toastMsg);
    }, [toastMsg]);

    return (<>
        <div
            className={`w-100 m-0 p-2 position-relative ${className}`}
            style={{...style}}
        >
            {/*<Snackbar open={checkNullStr(toastMsg)} autoHideDuration={toastHideDur}*/}
            {/*          onClose={(e, reason) => {*/}
            {/*              showToast('');*/}
            {/*              changeToastVariant('black');*/}
            {/*              // if (reason === 'clickaway') {*/}
            {/*              //     return;*/}
            {/*              // }*/}
            {/*          }}>*/}
            {/*    <Alert severity={toastVariant} sx={{width: "100%"}}>*/}
            {/*        {toastMsg}*/}
            {/*    </Alert>*/}
            {/*</Snackbar>*/}
            {createAvatar()}
            <div className={'w-100 p-0 m-0 mt-5'}>
                {children}
            </div>
            {createAvatarDropdownMenu()}
        </div>
    </>)

    function createAvatar() {
        return <Flexbox className={''} position={'absolute'}
                        style={{top: '.5rem', right: '.5rem'}}>
            <Avatar
                wrapperClassName={` circular overflow-hidden`}
                className={'circular '}
                imgClassName={''}
                innerWrapperClassName={''}
                size={'38px'}
                variant={App_THEME_VARIANT}
                bordered={false}
                showInitials={true}
                personName={loginUserFullName}
                onWrapperClick={(e) => {
                    setAvatarDropdownAnchorEl(e.currentTarget);
                }}>
                {getFieldValue(Fields.avatarImgFile)}
            </Avatar>

        </Flexbox>
    }

    function createAvatarDropdownMenu() {
        return <Menu
            className={"mt-1 select-none"}
            anchorEl={avatarDropdownAnchorEl}
            open={canShowAvatarDropdown}
            onClose={closeAvatarDropdownMenu}
            PaperProps={{
                style: {
                    boxShadow: "var(--shadow)", backgroundColor: "white", borderRadius: ".8rem", width: 'auto', padding: '.05rem .8rem',
                }
            }}>
            <div className={`m-0 p-0 w-100 mb-2 p-0 px-3`}>
                <Flexbox className={"w-100"} justifyAt={'center'}>
                    <Avatar
                        wrapperClassName={`circular overflow-hidden`}
                        className={'circular '}
                        imgClassName={''}
                        innerWrapperClassName={''}
                        size={'62px'}
                        bordered={false}
                        showInitials={true}
                        personName={loginUserFullName}>
                        {getFieldValue(Fields.avatarImgFile, Constants.userVector)}
                    </Avatar>
                </Flexbox>
                {isBoolTrue(disableMyAcLink) ?
                    <Label className={`w-100 p-1 px-2 fw-semi-bold m-0`} textAt={"center"}>
                        {loginUserFullName}
                    </Label>
                    : <Anchor
                        href={RouteUrls.userProfile}
                        textAt={'center'}
                        className={'w-100 p-1 px-2 text-dark fw-semi-bold text-primary-hover highlight-primary-hover transition-sm rounded-2'}>
                        {loginUserFullName}
                    </Anchor>}
            </div>
            <HorDiv variant={'gray-md'}/>

            <MenuItem
                className={`highlight-primary-hover highlight-primary-full-active py-0 px-2 rounded-2 select-none fs-md m-0 mt-1x`}
                // selected={moduleName === 'Pyxis'}
                selected={false}
                onClick={handleLogout}>
                {/*onClick={(e) => e.preventDefault()}>*/}
                <Anchor
                    href={RouteUrls.login}
                    textAt={'start'}
                    className={'w-100 m-0 p-0 py-1 text-dark text-primary-hover'}
                    // onClick={handleLogout}
                >
                    Logout
                </Anchor>
            </MenuItem>
        </Menu>
    }

    function closeAvatarDropdownMenu() {
        setAvatarDropdownAnchorEl(null);
    }

    function handleLogout() {
        const fun = 'handleLogout:';
        try {
            localStorage.clear();
            closeAvatarDropdownMenu();
            // navigate();
            // triggerSessionLogout();
        } catch (e) {
            logErr(fun, e);
        }
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
}
AppInterface.propTypes = {
    className: PropTypes.string, children: PropTypes.any, style: PropTypes.object,
};
export default AppInterface;
