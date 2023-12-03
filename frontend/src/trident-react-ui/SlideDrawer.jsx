import React, {useEffect} from "react";
import Drawer from "@mui/material/Drawer";
import PropTypes from 'prop-types';
import {checkNullJson, checkNullStr, getDefJsonValue, getDefValueStr, isBoolTrue, isJsonValueTrue} from "./ReactUtils";
import {Button, ScrollView, Section, SimpleLoader} from "./index";
import Label from "./Label";

const SlideDrawer = ({
                         children,
                         open = false,
                         title,
                         subtitle,
                         titleContent,
                         headerClassName = '',
                         titleClassName = '',
                         subtitleClassName = '',
                         titleWrapperClassName = '',
                         onOpen,
                         onClose,
                         titleSize,
                         showClose = true,
                         scrollable = true,
                         blurredBg = false,
                         closeOnEscape = true,
                         closeOnClickAway = true,
                         closeOnClose = true,
                         bg = 'white',
                         width = '50%',
                         height = '95%',
                         titleAt = 'center',
                         subtitleAt = 'center',
                         placement = 'right',
                         headerBg,
                         className = '',
                         contentClassName = '',
                         scrollClassName = '',
                         scrollVariant = 'dark',
                         style = {},
                         contentStyle = {},
                         titleStyle = {},
                         subtitleStyle = {},
                         headerStyle = {},
                         loadingStatus = {},
                     }) => {
    const TAG = 'SlideDrawer';

    const [openDrawer, setOpenDrawer] = React.useState(false);
    useEffect(() => {
        setOpenDrawer(isBoolTrue(open));
    }, [open]);

    const toggleDrawer = (open) => (event, reason) => {
        // printLog(TAG, 'toggleDrawer.open:', open);
        // printLog(TAG, 'toggleDrawer.event:', event);
        // printLog(TAG, 'toggleDrawer.event.key:', event.key);
        // printLog(TAG, 'toggleDrawer.reason:', reason);
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        if (!open && !isBoolTrue(closeOnEscape) && event.key === "Escape") {
            return;
        }
        if (!open && !isBoolTrue(closeOnClickAway) && reason === "backdropClick") {
            return;
        }
        if (isBoolTrue(open)) {
            if (onOpen) onOpen();
            setOpenDrawer(true);
        } else {
            if (onClose) onClose();

            if (isBoolTrue(closeOnClose)) {
                setOpenDrawer(false);
            }
        }
    };

    return (<Drawer
        anchor={getDefValueStr(placement, 'right')}
        open={openDrawer}
        onClose={toggleDrawer(false)}
        className={`slide-drawer-standard p-0 px-0 overflow-hidden ${className}`}
        PaperProps={{
            sx: {
                margin: "1rem !important", borderRadius: "1rem !important", width: width, height: height, overflow: 'hidden', backgroundColor: `${bg} !important`, // backdropFilter: "blur(100px) !important",
                // backgroundColor: `blue !important`, // backdropFilter: "blur(100px) !important",
                // backgroundColor: "rgba(255,255,255,.2) !important",
                filter: "brightness(100%) blur(0%) !important", ...style
            },
        }}>
        {isBoolTrue(scrollable) ? <ScrollView className={`${scrollClassName} w-100 h-100 p-0 m-0`} scrollVariant={scrollVariant}>
            {createContent()}
        </ScrollView> : <div className={`w-100 p-0 m-0`}>
            {createContent()}
        </div>}
    </Drawer>);

    function createContent() {
        return <Section className={`p-0 m-0 w-100 h-100 position-relative`} bg={'t'} borderless={true}>
            {/*close button*/}
            {isBoolTrue(showClose) && <Button
                style={{
                    [(placement === 'bottom') ? 'bottom' : 'top']: '.2rem', [(placement === 'left') ? 'left' : 'right']: '.2rem', zIndex: 11,
                }}
                className={`p-2 m-0 highlight-dark-hover position-absolute`}
                variant={'t'}
                circular={true}
                width={'24px'}
                height={'24px'}
                iconSize={'14px'}
                iconClass={`bi bi-x text-dark`}
                onClick={toggleDrawer(false)}
            />}

            {/*header*/}
            <div className={`px-2 py-1 m-0x d-flex ${headerClassName} ${isBoolTrue(scrollable) ? 'position-fixedx' : ''} w-100 bg-${headerBg}`}
                 style={{zIndex: 10, ...headerStyle}}>
                <div className={`w-100 m-0 p-0 ${titleWrapperClassName}`}>
                    {/*title*/}
                    {checkNullStr(title) && <h6
                        className={`d-flex w-100 text-black m-0 pt-1 p-0 fs-md justify-content-${titleAt} ${titleClassName} d-flex w-auto`}
                        style={{fontSize: titleSize, ...titleStyle}}>{title}</h6>}

                    {titleContent && titleContent}

                    {/*subtitle*/}
                    {checkNullStr(subtitle) && <p className={`w-100 d-flex text-gray-dark fs-sm p-0 pb-0 m-0 text-wrap flex-wrap
                             text-${subtitleAt} justify-content-${subtitleAt} ${subtitleClassName}`}
                                                  style={{...subtitleStyle}}>
                        {subtitle}
                    </p>}
                </div>
            </div>

            <div className={`mt-3x ${contentClassName}`}
                 style={{
                     ...contentStyle
                 }}>
                {/*loading*/}
                {checkNullJson(loadingStatus) && <div className={`p-0 m-0 w-100 ${isJsonValueTrue(loadingStatus, 'loaded') ? 'mt-0' : 'mt-3'}`}>
                    {!isJsonValueTrue(loadingStatus, 'loaded') && <SimpleLoader wrapperClassName={'m-1'}/>}

                    {checkNullStr(getDefJsonValue(loadingStatus, 'msg')) &&
                        <Label className={'w-100 m-0 p-1'} textAt={'center'}>{getDefJsonValue(loadingStatus, 'msg')}</Label>}
                </div>}

                {children}
            </div>
        </Section>
    }

};


SlideDrawer.propTypes = {
    className: PropTypes.string,
    bg: PropTypes.string,
    style: PropTypes.object,
    headerClassName: PropTypes.string,
    titleWrapperClassName: PropTypes.string,
    headerStyle: PropTypes.object,
    titleClassName: PropTypes.string,
    titleStyle: PropTypes.object,
    subtitleClassName: PropTypes.string,
    titleContent: PropTypes.any,
    subtitleStyle: PropTypes.object,
    subtitleAt: PropTypes.string,
    closeClassName: PropTypes.string,
    scrollClassName: PropTypes.string,
    titleSize: PropTypes.string,
    closeStyle: PropTypes.object,
    showClose: PropTypes.bool,
    children: PropTypes.any,
    contentClassName: PropTypes.string,
    contentStyle: PropTypes.object,
    onClose: PropTypes.func,
    onEntering: PropTypes.func,
    onExiting: PropTypes.func,
    onOpen: PropTypes.func,
    open: PropTypes.bool,
    closeOnClose: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    closeOnClickAway: PropTypes.bool,
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    bgImage: PropTypes.string,
    blurVariant: PropTypes.string,
    blurAmount: PropTypes.string,
    bgFit: PropTypes.string,
    bgBrightness: PropTypes.string,
    titleAt: PropTypes.string,
    loadingStatus: PropTypes.object,
};
export default SlideDrawer;
