import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from './Dialog';
import {checkNull, checkNullStr, isBoolTrue, printError, printLog} from '../ReactUtils';
import {focusFormIdElement} from "../../app/util/AppUtils";

const InputDialog = React.memo(({
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
                                    onEnter,
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

                                    title = "",
                                    subtitle = "",
                                    controls = [],
                                    startControls = [],

                                    scrollVariant = 'light',
                                    scrolled = true,
                                    onConfirm = null,
                                    onCancel = null,
                                    sleekControl = true,

                                    controlStyle = {},
                                    titleStyle = {},
                                    subtitleStyle = {},
                                    footerStyle = {},
                                    headerStyle = {},
                                    dividerStyle = {},
                                    confirmStyle = {},
                                    cancelStyle = {},

                                    enableEnter = true,

                                    //input data
                                    inputType = "text",
                                    inputPlaceholder = "Placeholder",
                                    disableConfirm = false,
                                    disableConfirmOverride = false,
                                    inputValue,
                                    inputRequired = false,
                                    inputValidate = false,
                                    inputRegex,
                                    onInputChange,
                                    maxLength = 100,
                                    ...inputProps

                                }) => {
    const TAG = "InputDialog";

    const inputRef = useRef();

    const [inputStr, setInputStr] = useState("");
    const [disableConfirmBtn, setDisableConfirmBtn] = useState(disableConfirm);

    useEffect(() => {
        focusInput();
    }, [inputValue]);
    useEffect(() => {
        if (!isBoolTrue(disableConfirmOverride)) setDisableConfirmBtn(!checkNullStr(inputStr));
    }, [inputValue || inputStr]);

    useEffect(() => {
        try {
            if (isBoolTrue(enableEnter)) {
                const handleEnter = (event) => {
                    if (event.key === 'Enter') {
                        if (checkNull(onConfirm)) onConfirm(inputStr)
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
                onEnter={() => {
                    focusInput();
                    if (onEnter) onEnter();
                }}
                showClose={false}
                widthClass={widthClass}
                height={height}

                confirmClassName={`${confirmClassName} ${disableConfirmBtn ? 'disable-itemx' : ''}`}
                cancelClassName={`${cancelClassName}`}
                className={`p-0 transition m-0 p-0 mx-2 ${className}`}
                showHeader={true}
                showFooter={true}
                onConfirm={() => {
                    if (checkNull(onConfirm)) onConfirm(inputStr);
                }}
                onCancel={onCancel}
                title={title}
                titleClassName={titleClassName}
                titleStyle={titleStyle}
                padded={false}
                closeOnEscape={false}
                closeOnOutsideClick={false}
                sleekControl={sleekControl}
                scrolled={scrolled}
                contentStyle={contentStyle}
                confirmStyle={confirmStyle}
                cancelStyle={cancelStyle}
                style={style}

                bgColor={bgColor}
                contentFontSize={contentFontSize}
                width={width}
                scrollVariant={scrollVariant}

                contentClassName={`transition m-0 ${contentClassName} px-4 py-2`}
                footerClassName={`${footerClassName} py-2`}
                controlClassName={controlClassName}
                controlsAt={"center"}
                headerClassName={headerClassName}
                subtitleClassName={subtitleClassName}
                dividerClassName={dividerClassName}
                confirmText={confirmText}
                cancelText={cancelText}

                subtitle={subtitle}
                controls={controls}
                startControls={startControls}

                disableConfirm={!isBoolTrue(disableConfirmOverride) ? false : disableConfirmBtn}
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
                <form>
                    <input
                        ref={inputRef}
                        id={getInputId()}
                        maxLength={maxLength}
                        className={"form-control primary w-100 border-1 border-light border outline-none rounded-3 transition px-2 py-1"}
                        value={inputValue}
                        type={inputType}
                        placeholder={inputPlaceholder}
                        required={inputRequired}
                        // validate={inputValidate}
                        pattern={inputRegex}
                        onChange={(e) => {
                            const value = e.target.value;
                            setInputStr(value);
                            if (checkNull(onInputChange)) onInputChange(value);
                        }}
                        {...inputProps}
                    />
                    {children}
                </form>
            </Dialog>
        </>
    )

    function focusInput() {
        try {
            // inputRef.current.focus();
            // $(inputRef.current).focus();
            focusFormIdElement(getInputId(), true, 100);
        } catch (e) {
            printError(TAG, e);
        }
    }

    function getInputId() {
        return TAG + '-input-field';
    }
});
InputDialog.propTypes = {
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
    inputValidate: PropTypes.bool,
    inputRequired: PropTypes.bool,
    showClose: PropTypes.bool,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
    disableConfirmOverride: PropTypes.bool,
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
    disableConfirm: PropTypes.bool,
    contentFontSize: PropTypes.string,

    onInputChange: PropTypes.func,
    inputRegex: PropTypes.any,
    inputType: PropTypes.string,
    inputValue: PropTypes.any,
    inputPlaceholder: PropTypes.any,
    maxLength: PropTypes.number,
};
export default InputDialog;
