import React, {useEffect, useRef} from 'react';
import Button from "../Button";
import Divider from "@mui/material/Divider";
import {checkNull, checkNullArr, checkNullStr, handleTabFocus, isBoolTrue, printError, printLog} from "../ReactUtils";
import PropTypes from "prop-types";
import ScrollView from "../ScrollView";
import {THEME} from "../index";

const DialogContent = ({
                           className = "",
                           bgColor = "white",
                           width,
                           id,
                           ref,

                           children,
                           onClose,
                           onCancel,
                           onHide,
                           setOpen,
                           sleekControl = true,
                           showDiv = false,
                           disableConfirm = false,
                           confirmClassName = "",
                           cancelClassName = "highlight-dark",
                           footerClassName = "",
                           controlClassName = "",
                           confirmVariant = THEME,
                           headerClassName = "",
                           titleClassName = "",
                           subtitleClassName = "",
                           closeClassName = "",
                           contentClassName = "",
                           closeIconClass = "bi bi-x",
                           dividerClassName = "",
                           controlsAt = "end",
                           confirmId,
                           contentId,

                           title = "",
                           subtitle = "",
                           scrollVariant = "light",
                           controls = [],
                           startControls,
                           closeVariant = "dark",
                           confirmComponent = null,
                           confirmText = "Confirm",
                           cancelText = "Cancel",
                           closeTooltip = "",
                           height = "auto",
                           minHeight,
                           maxHeight,
                           titleAt = "start",
                           subtitleAt = "start",
                           titleColor,
                           subtitleSize = '13px',
                           subtitleColor,
                           contentFontSize,
                           scrolled = true,
                           showCancelControl = true,
                           showConfirmControl = true,
                           showClose = true,
                           showHeader = true,
                           showFooter = true,
                           padded = true,
                           resize = false,
                           resizeVert = false,
                           resizeHor = false,
                           headerContent,
                           onConfirm,

                           style = {},
                           confirmStyle = {},
                           controlStyle = {},
                           titleStyle = {},
                           subtitleStyle = {},
                           footerStyle = {},
                           headerStyle = {},
                           closeStyle = {},
                           dividerStyle = {},
                           contentStyle = {},
                       }) => {
    const TAG = "DialogContent";

    const okButtonRef = useRef();
    const cancelButtonRef = useRef();

    useEffect(() => {
        try {
            handleTabFocus([okButtonRef.current, cancelButtonRef.current]);
        } catch (e) {
            printError(TAG, e);
        }
    });
    // useEffect(() => {
    //     controlsRefs[focusedControlIndex].current.focus();
    // }, [focusedControlIndex]);
    //
    // function handleKeyDown(event) {
    //     if (event.keyCode === 9) {
    //         event.preventDefault();
    //         setFocusedControlIndex((focusedControlIndex + 1) % 2);
    //     }
    // }

    return (<>
            <div className={`fusion-modal overflow-hidden outline-none border-none rounded-4 position-relative ${className} mx-4`}
                 ref={ref}
                 id={id}
                 style={{width: width, backgroundColor: bgColor, ...style}}
            >
                <Button
                    hidden={!showClose}
                    className={`p-1 transition circular highlight-dark-hoverx ${closeClassName}`}
                    tooltip={closeTooltip}
                    width={"26px"}
                    height={"26px"}
                    iconClass={`bi bi-x text-${closeVariant}`}
                    iconStyle={{
                        fontSize: "18px", opacity: ".7", ...closeStyle
                    }}
                    style={{position: "absolute", top: ".2rem", right: ".2rem", ...closeStyle}}
                    onClick={onClose}
                />

                {/*header*/}
                {(isBoolTrue(showHeader) && checkNullStr(title) || checkNullStr(subtitle) || checkNull(headerContent)) &&
                    <div className={`w-100 header d-flex justify-content-between m-0 p-0 px-4 pt-0 pb-1 align-items-center ${headerClassName}`}
                         style={{...headerStyle}}>
                        <div className={'w-100 p-0 m-0'}>
                            {/*title*/}
                            {checkNullStr(title) && <h5 className={`titlex transition w-100 d-flex
                         p-0 m-0 ${titleClassName} justify-content-${titleAt} text-${titleAt}`}
                                                        style={{color: titleColor, ...titleStyle}}>{title}</h5>}

                            {/*subtitle*/}
                            {checkNullStr(subtitle) && <p className={`subtitle w-100 d-flex transition m-0 px-0 py-0 text-gray 
                        ${subtitleClassName}   justify-content-${subtitleAt} text-${subtitleAt}`}
                                                          style={{fontSize: subtitleSize, color: subtitleColor, ...subtitleStyle}}>{subtitle}</p>}
                        </div>

                        {/*header content*/}
                        {/*{checkNull(headerContent) && headerContent}*/}
                    </div>}

                {isBoolTrue(showDiv) && <Divider className={`${dividerClassName}`} sx={{my: 0, ...dividerStyle}}/>}

                {/*body*/}
                {isBoolTrue(scrolled)
                    ?
                    <ScrollView
                        className={`contentx ${contentClassName} ${padded ? 'px-3 py-2' : 'p-0'}`}
                        style={{maxHeight: maxHeight, minHeight: minHeight, marginTop: "-0.1rem", marginBottom: "-0.1rem", fontSize: contentFontSize, ...contentStyle}}
                        height={height}
                        scrollVariant={scrollVariant}
                        scrollHor={false}
                        scrollVert={scrolled}
                    >
                        <div className={'p-0 m-0 w-100 h-100'} id={contentId}>
                            {children}
                        </div>
                    </ScrollView>
                    : <div
                        className={`contentx ${contentClassName} ${padded ? 'px-3 py-2' : 'p-0'}`}
                        style={{
                            height: '100%',
                            maxHeight: maxHeight,
                            minHeight: minHeight,
                            // marginTop: "-0.1rem",
                            // marginBottom: "-0.1rem",
                            // fontSize: contentFontSize,
                            ...contentStyle
                        }}
                    >
                        <div className={'p-0 m-0 w-100 h-100'} id={contentId}>
                            {children}
                        </div>
                    </div>
                }

                {isBoolTrue(showDiv) && <Divider className={`div ${dividerClassName}`} sx={{my: 0, ...dividerStyle}}/>}

                {/*Footer*/}
                {
                    isBoolTrue(showFooter) &&
                    <div
                        className={`footer bg-gray-lightx w-100 flex-nowrap d-flex fd-row justify-content-${controlsAt}
                         m-0 ps-3 pe-1 py-1 ${footerClassName}`}
                        style={{...footerStyle}}>
                        {checkNullArr(startControls) && startControls.map((control, i) => {
                            return control
                        })}
                        {<Button text={cancelText}
                                 hidden={!showCancelControl}
                                 onClick={() => {
                                     if (onClose) onClose();
                                     if (onCancel) onCancel();
                                     if (onHide) onHide();
                                 }}
                                 sleek={sleekControl}
                                 ref={cancelButtonRef}
                                 className={`control bg-tx text-dark highlight-dark-hover 
                                 ${controlClassName} ${cancelClassName}`}
                                 style={{...closeStyle, ...controlStyle}}
                        />}
                        {checkNullStr(confirmComponent)
                            ? confirmComponent
                            : <Button text={confirmText}
                                      id={confirmId}
                                // rippleColor={'light'}
                                      hidden={!showConfirmControl}
                                      onClick={() => {
                                          if (onConfirm) onConfirm();
                                          if (onHide) onHide();
                                      }}
                                      sleek={sleekControl}
                                      disabled={disableConfirm}
                                      ref={okButtonRef}
                                      variant={confirmVariant}
                                      className={`control mx-2 bg-xx ${controlClassName} ${confirmClassName}`}
                                      style={{...confirmStyle, ...controlStyle}}
                            />
                        }
                        {checkNullArr(controls) && controls.map((control, i) => {
                            return control
                        })}
                    </div>}
            </div>
        </>
    )

    function handleClose() {
        printLog("DialogContent:handleClose called")
        // setShow(!show)
        if (checkNull(onClose)) onClose()
        // if (checkNull(setOpen)) setOpen(false)
    }
}

DialogContent.propTypes = {
    className: PropTypes.string,
    bgColor: PropTypes.string,
    width: PropTypes.string,
    id: PropTypes.string,
    ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

    children: PropTypes.node,
    onClose: PropTypes.func,
    setOpen: PropTypes.func,
    confirmClassName: PropTypes.string,
    cancelClassName: PropTypes.string,
    footerClassName: PropTypes.string,
    controlClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    titleClassName: PropTypes.string,
    subtitleClassName: PropTypes.string,
    closeClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    closeIconClass: PropTypes.string,
    dividerClassName: PropTypes.string,
    controlsAt: PropTypes.string,
    confirmId: PropTypes.string,

    title: PropTypes.string,
    subtitle: PropTypes.string,
    scrollVariant: PropTypes.oneOf(["light", "dark"]),
    controls: PropTypes.arrayOf(PropTypes.node),
    startControls: PropTypes.arrayOf(PropTypes.node),
    closeVariant: PropTypes.oneOf(["light", "dark"]),
    confirmComponent: PropTypes.any,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    closeTooltip: PropTypes.string,
    height: PropTypes.string,
    maxHeight: PropTypes.string,
    minHeight: PropTypes.string,
    titleAt: PropTypes.oneOf(["start", "center", "end"]),
    subtitleAt: PropTypes.oneOf(["start", "center", "end"]),
    titleColor: PropTypes.string,
    subtitleSize: PropTypes.string,
    subtitleColor: PropTypes.string,
    scrolled: PropTypes.bool,
    showCancelControl: PropTypes.bool,
    showConfirmControl: PropTypes.bool,
    showClose: PropTypes.bool,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
    padded: PropTypes.bool,
    resize: PropTypes.bool,
    resizeVert: PropTypes.bool,
    resizeHor: PropTypes.bool,
    showDiv: PropTypes.bool,
    sleekControl: PropTypes.bool,
    headerContent: PropTypes.node,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onHide: PropTypes.func,
    contentFontSize: PropTypes.string,

    style: PropTypes.object,
    contentStyle: PropTypes.object,
    confirmStyle: PropTypes.object,
    controlStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    subtitleStyle: PropTypes.object,
    footerStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    closeStyle: PropTypes.object,
    dividerStyle: PropTypes.object,
    disableConfirm: PropTypes.bool,
};

export default DialogContent;
