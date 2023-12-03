import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import {checkNull, isBoolTrue, printLog} from '../ReactUtils';
import {THEME} from "../index";

const ConfirmDialog = ({
                           className = "",
                           widthClass = "auto",
                           width,
                           height,
                           bgColor = "white",
                           style = {},
                           contentStyle = {},
                           children,
                           open = false,
                           setOpen,
                           contentFontSize,

                           titleAt = "center",
                           subtitleAt = "center",
                           titleColor,
                           subtitleSize = '13px',
                           subtitleColor,
                           headerContent,

                           footerClassName = "",
                           cancelClassName = "",
                           confirmClassName = "",
                           controlClassName = "",
                           headerClassName = "",
                           titleClassName = "",
                           subtitleClassName = "",
                           contentClassName = "",
                           dividerClassName = "",

                           confirmText = "Confirm",
                           cancelText = "Cancel",
                           confirmVariant = THEME,

                           title = "",
                           subtitle = "",
                           controls = [],
                           startControls = [],

                           scrollVariant = 'light',
                           scrolled = true,
                           sleekControl = true,
                           onConfirm = null,
                           onCancel = null,
                           onHide = null,

                           controlStyle = {},
                           titleStyle = {},
                           subtitleStyle = {},
                           footerStyle = {},
                           headerStyle = {},
                           dividerStyle = {},
                           confirmStyle = {},
                           cancelStyle = {},

                           enableEnter = true,
                       }) => {
    const TAG = "ConfirmDialog";

    useEffect(() => {
        try {
            if (isBoolTrue(enableEnter)) {
                const handleEnter = (event) => {
                    if (event.key === 'Enter') {
                        if (checkNull(onConfirm)) onConfirm()
                    }
                };
                document.addEventListener('keydown', handleEnter);
                return () => {
                    document.removeEventListener('keydown', handleEnter);
                };
            }
        } catch (e) {
            printLog(e)
        }
    })

    return (<>
            <Dialog
                open={open}
                setOpen={setOpen}
                onClose={() => {
                    if (checkNull(onCancel)) onCancel();
                    if (checkNull(setOpen)) setOpen(false);
                }}
                showClose={false}
                sleekControl={sleekControl}
                widthClass={widthClass}
                height={height}
                contentClassName={`transition m-0 ${contentClassName}`}
                confirmClassName={`${confirmClassName} `}
                cancelClassName={`${cancelClassName}`}
                className={`p-0 transition m-0 p-3 mx-2 ${className}`}
                footerClassName={`px-2 ${footerClassName}`}
                showHeader={true}
                showFooter={true}
                onConfirm={onConfirm}
                onCancel={onCancel}
                onHide={onHide}
                title={title}
                titleClassName={titleClassName}
                titleStyle={titleStyle}
                padded={false}
                closeOnEscape={true}
                closeOnOutsideClick={false}
                scrolled={scrolled}
                contentStyle={contentStyle}
                confirmStyle={confirmStyle}
                cancelStyle={cancelStyle}
                style={style}

                bgColor={bgColor}
                contentFontSize={contentFontSize}
                width={width}
                scrollVariant={scrollVariant}

                controlClassName={controlClassName}
                headerClassName={headerClassName}
                subtitleClassName={subtitleClassName}
                dividerClassName={dividerClassName}
                confirmText={confirmText}
                cancelText={cancelText}
                confirmVariant={confirmVariant}

                subtitle={subtitle}
                controls={controls}
                startControls={startControls}

                showCloseControl={false}
                headerContent={headerContent}
                subtitleColor={subtitleColor}
                titleColor={titleColor}
                subtitleSize={subtitleSize}
                titleAt={titleAt}
                subtitleAt={subtitleAt}

                controlStyle={controlStyle}
                subtitleStyle={subtitleStyle}
                footerStyle={footerStyle}
                headerStyle={headerStyle}
                dividerStyle={dividerStyle}
            >
                {children}
            </Dialog>
        </>
    )
}
ConfirmDialog.propTypes = {
    className: PropTypes.string,
    backdropClassName: PropTypes.string,
    widthClass: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    enableEnter: PropTypes.bool,
    sleekControl: PropTypes.bool,
    contentFontSize: PropTypes.string,
};
export default ConfirmDialog;
