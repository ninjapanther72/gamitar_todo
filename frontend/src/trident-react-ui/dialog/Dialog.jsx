import React, {useEffect, useRef} from "react";
import PropTypes from 'prop-types';

import Container from "@mui/material/Container";
import {Modal as MUIModal} from "@mui/material";
import {checkNull, createTimeout, isBoolTrue, printLog} from "../ReactUtils";
import DialogContent from "./DialogContent";
import {THEME} from "../index";

/**
 * PropTypes for the Modal component.
 */
const Dialog = React.memo(({
                               className = "",
                               backdropClassName = "",
                               widthClass = "col-10",
                               width,
                               height,
                               maxHeight,
                               minHeight,
                               bgColor = "white",
                               style = {},
                               contentStyle = {},
                               id,
                               controlsAt,
                               confirmId,
                               children,
                               open = false,
                               setOpen,
                               onClose,
                               onEnter,
                               contentFontSize,
                               sleekControl = true,
                               showCancelControl = true,
                               showConfirmControl = true,
                               disableConfirm = false,
                               confirmVariant = THEME,

                               backdropColor = "rgba(0,0,0,0.4)",

                               titleAt = "start",
                               subtitleAt = "start",
                               titleColor,
                               subtitleSize = '13px',
                               subtitleColor,
                               headerContent,

                               contentId,

                               footerClassName = "",
                               cancelClassName = "",
                               confirmClassName = "",
                               controlClassName = "",
                               headerClassName = "",
                               titleClassName = "",
                               subtitleClassName = "",
                               closeClassName = "",
                               contentClassName = "",
                               dividerClassName = "",
                               closeIconClass = "bi bi-x",

                               confirmComponent = null,
                               confirmText = "Confirm",
                               cancelText = "Cancel",

                               title = "",
                               subtitle = "",
                               controls = [],
                               startControls = [],

                               closeTooltip = "",
                               closeVariant = "dark",
                               scrollVariant = 'light',
                               disableEnforceFocus = true,
                               scrolled = true,
                               showCloseControl = true,
                               showClose = true,
                               showHeader = true,
                               showFooter = true,
                               padded = true,
                               closeOnEscape = true,
                               closeOnOutsideClick = true,
                               onOutsideClick = null,
                               onEscapeClose = null,
                               onConfirm = null,
                               onCancel = null,
                               onHide = null,

                               backdropStyle = {},
                               controlStyle = {},
                               titleStyle = {},
                               subtitleStyle = {},
                               footerStyle = {},
                               headerStyle = {},
                               closeStyle = {},
                               dividerStyle = {},
                               confirmStyle = {},
                               cancelStyle = {},
                           }) => {
    const TAG = 'Modal';
    const modalRef = useRef();
    const DL_CONTENT_ID = id;

    useEffect(() => {
        // Close on Escape press
        try {
            if (isBoolTrue(open)) {
                const handleEscape = (event) => {
                    if (isBoolTrue(closeOnEscape)) {
                        if (event.key === 'Escape') {
                            // printLog("Modal.Escape pressed");
                            if (checkNull(onEscapeClose)) onEscapeClose(event);
                            handleClose(event);
                        }
                    }
                };
                document.addEventListener('keydown', handleEscape);
                return () => {
                    document.removeEventListener('keydown', handleEscape);
                };
            }
        } catch (e) {
            printLog(TAG, e)
        }
    });


    return (
        <Container id={"modal-container"}>
            <MUIModal
                open={open}
                onClose={handleClose}
                closeAfterTransition={true}
                disableBackdropClick={false}
                id={"modal-backdrop"}
                // ref={modalRef}
                sx={{display: "grid", placeItems: "center", backgroundColor: backdropColor, ...backdropStyle}}
                className={`modal-backdrop ${backdropClassName}`}

                onEnter={(node) => {
                    node.firstChild.style.transform = "scale(0.5)";
                    createTimeout(() => {
                        node.firstChild.style.transform = "scale(1)";
                    }, 300);
                    if (checkNull(onEnter)) onEnter(node);
                }}
                onExited={(node) => {
                    node.firstChild.style.transform = "scale(0.1)";
                }}
            >
                {/* <AnimView className={`p-0 m-0 center-force ${widthClass} `}
                    animStyle="zoomIn" durationMS={1000}
                    onlyOnScroll={false} enable={false}> */}
                <DialogContent
                    ref={modalRef}
                    className={`${className} ${widthClass}`}
                    bgColor={bgColor}
                    style={{transition: "transform 0.3s ease-in-out", ...style}}
                    width={width}
                    height={height}
                    maxHeight={maxHeight}
                    minHeight={minHeight}
                    scrolled={scrolled}
                    scrollVariant={scrollVariant}

                    id={id}
                    setOpen={setOpen}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                    onHide={onHide}
                    onClose={handleClose}

                    disableConfirm={disableConfirm}
                    controlsAt={controlsAt}
                    confirmId={confirmId}
                    cancelClassName={cancelClassName}
                    confirmClassName={confirmClassName}
                    footerClassName={footerClassName}
                    controlClassName={controlClassName}
                    headerClassName={headerClassName}
                    titleClassName={titleClassName}
                    subtitleClassName={subtitleClassName}
                    closeClassName={closeClassName}
                    contentClassName={contentClassName}
                    dividerClassName={dividerClassName}
                    closeIconClass={closeIconClass}
                    confirmText={confirmText}
                    confirmComponent={confirmComponent}
                    cancelText={cancelText}
                    sleekControl={sleekControl}
                    showCancelControl={showCancelControl}
                    showConfirmControl={showConfirmControl}
                    confirmVariant={confirmVariant}

                    title={title}
                    subtitle={subtitle}
                    controls={controls}
                    startControls={startControls}

                    closeTooltip={closeTooltip}
                    showCloseControl={showCloseControl}
                    showClose={showClose}
                    headerContent={headerContent}
                    subtitleColor={subtitleColor}
                    titleColor={titleColor}
                    subtitleSize={subtitleSize}
                    titleAt={titleAt}
                    subtitleAt={subtitleAt}

                    contentStyle={contentStyle}
                    controlStyle={controlStyle}
                    titleStyle={titleStyle}
                    subtitleStyle={subtitleStyle}
                    footerStyle={footerStyle}
                    headerStyle={headerStyle}
                    closeStyle={closeStyle}
                    dividerStyle={dividerStyle}
                    cancelStyle={cancelStyle}
                    confirmStyle={confirmStyle}
                    showHeader={showHeader}
                    showFooter={showFooter}
                    padded={padded}
                    closeVariant={closeVariant}
                    contentFontSize={contentFontSize}
                    contentId={contentId}
                >
                    {children}
                </DialogContent>
                {/* </AnimView> */}
            </MUIModal>
        </Container>
    )

    function handleClose(event, reason) {
        // if (reason && reason == "backdropClick" && "escapeKeyDown")
        if (!isBoolTrue(closeOnOutsideClick) && checkNull(reason, "") && reason === "backdropClick") {
            // printLog("backdropClick called");
            if (checkNull(onOutsideClick)) onOutsideClick(event);
            return;
        }
        // if (!isBoolTrue(closeOnEscape) && checkNull(reason, "") && reason === "escapeKeyDown") {
        //     printLog("escapeKeyDown called");
        //     if (checkNull(onEscapeClose)) onEscapeClose(event);
        //     return;
        // }
        if (checkNull(onClose)) onClose();
        if (checkNull(onHide)) onHide();
        // if (checkNull(onCancel)) onCancel();
        // if (checkNull(setOpen)) setOpen(false);
    }
});


Dialog.propTypes = {
    className: PropTypes.string,
    backdropClassName: PropTypes.string,
    widthClass: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bgColor: PropTypes.string,
    style: PropTypes.object,
    contentStyle: PropTypes.object,
    id: PropTypes.string,
    children: PropTypes.node,
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    onClose: PropTypes.func,
    onEnter: PropTypes.func,
    backdropColor: PropTypes.string,
    titleAt: PropTypes.oneOf(['start', 'center', 'end']),
    subtitleAt: PropTypes.oneOf(['start', 'center', 'end']),
    titleColor: PropTypes.string,
    subtitleSize: PropTypes.string,
    subtitleColor: PropTypes.string,
    headerContent: PropTypes.node,
    footerClassName: PropTypes.string,
    cancelClassName: PropTypes.string,
    confirmClassName: PropTypes.string,
    controlClassName: PropTypes.string,
    headerClassName: PropTypes.string,
    titleClassName: PropTypes.string,
    subtitleClassName: PropTypes.string,
    closeClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    dividerClassName: PropTypes.string,
    closeIconClass: PropTypes.string,
    confirmComponent: PropTypes.any,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    controls: PropTypes.array,
    startControls: PropTypes.array,
    closeTooltip: PropTypes.string,
    closeVariant: PropTypes.string,
    scrollVariant: PropTypes.string,
    disableEnforceFocus: PropTypes.bool,
    scrolled: PropTypes.bool,
    showCloseControl: PropTypes.bool,
    showClose: PropTypes.bool,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
    padded: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    onOutsideClick: PropTypes.func,
    onEscapeClose: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onHide: PropTypes.func,
    backdropStyle: PropTypes.object,
    controlStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    subtitleStyle: PropTypes.object,
    footerStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    closeStyle: PropTypes.object,
    dividerStyle: PropTypes.object,
    confirmStyle: PropTypes.object,
    cancelStyle: PropTypes.object,
    contentFontSize: PropTypes.string,
    controlsAt: PropTypes.string,
    confirmId: PropTypes.string,
    disableConfirm: PropTypes.bool,
    sleekControl: PropTypes.bool,
    showCancelControl: PropTypes.bool,
    showConfirmControl: PropTypes.bool,
};
export default Dialog;
