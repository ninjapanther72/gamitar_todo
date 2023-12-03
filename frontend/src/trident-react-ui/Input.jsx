import React, {useEffect, useRef, useState} from "react";
import {changeStringCase, checkNull, checkNullStr, createTimeout, getDefValue, isBoolTrue, multSize, printError, subtractSize} from "./ReactUtils";
import Button from "./Button";
import PropTypes from 'prop-types';
import Icon from "./Icon";
import $ from "jquery";
import {THEME} from "./index";

const Input = React.memo(({
                              //ClassName
                              className = "",
                              wrapperClassName = "",
                              innerWrapperClassName = "",
                              controlClassName = "",
                              controlIconClassName = "",
                              labelClassName = "",
                              tooltipClassName = "",
                              errorClassOnInvalid = "danger",
                              iconColor = "black",
                              iconSize = "22px",
                              iconGap = "10px",
                              variant = THEME, //Style
                              wrapperStyle = {},
                              innerWrapperStyle = {},

                              id,
                              useBlur = false,
                              showDefMsg = true,
                              appendRandomClass = false,
                              errorTimeoutMS = 2500,
                              asTextArea = false,
                              transition = true,
                              showMsgOnNonValidate = false,

                              //Text
                              rows,
                              cols,
                              value,
                              defaultValue,
                              placeholder = "Enter text",
                              inputValueState,
                              inputValueSetState,

                              //icon
                              leftIcon = "",
                              rightIcon = "",
                              leftIconTooltip = "",
                              rightIconTooltip = "",
                              onLeftIconClick,
                              onRightIconClick,
                              iconStyle = {},
                              iconClassName = "",

                              //label
                              label = "",
                              labelSize = "12px",
                              labelColor = "#3D3B3E",
                              labelStyle = {},
                              floatingLabel = true,
                              placeholderAsLabel = true,
                              showLabel = true,
                              overrideInvalid = false,

                              //Validation msg
                              msg = "",
                              msgTextSize = "9px",
                              msgHeight = "14px",
                              msgStyle = {},
                              msgColor = "#E43217",
                              msgClassName = "",
                              italicMsg = false,
                              showMsg = true,
                              showMsgOverride = true,
                              animateMsg = false,

                              //Other
                              type = "text",
                              name = "text",
                              title = "",
                              onChange,
                              onPaste,
                              onCut,
                              capitalizeOnType = false,
                              onKeyPress,
                              onKeyDown,
                              onFocus,
                              onBlur,
                              onClick,
                              onError,
                              error = false,
                              success = false,
                              info = false,
                              hidden = false,
                              required = false,
                              disabled = false,
                              validate = false,
                              showClear = false,
                              style = {},
                              controlStyle = {},
                              maxLength,
                              accept,
                              autoComplete,// 'none' | 'inline' | 'list' | 'both' | undefined;
                              min,
                              max,
                              minLength,
                              pattern,
                              readOnly,
                              wrap = "wrap",
                              controlColor = "gray",
                              controlSize = "24px",
                              ...rest
                          }) => {
    let TAG = "Input";

    let inputRef = useRef();

    const [isFloating, setIsFloating] = useState(false);
    const [inputType, setInputType] = useState(type);
    const [overrideMsg, setOverrideMsg] = useState(false);
    const [inputMsg, setInputMsg] = useState(msg);
    const [inputMsgColor, setInputMsgColor] = useState(msgColor);


    const [nativeValue, setNativeValue] = useState('');

    const [showValidationMsg, setShowValidationMsg] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        setIsFloating(checkNullStr(value));
    }, [value]);
    useEffect(() => {
        try {
            setIsFloating(isInputGo() ? checkNullStr(inputRef.current.value) || checkNullStr(inputRef.current.innerText) || checkNullStr(inputRef.current.innerHTML) : checkNullStr(value));
        } catch (e) {
            printError(TAG, e);
        }
    }, [isInputGo() ? (checkNullStr(inputRef.current.value) || checkNullStr(inputRef.current.innerText) || checkNullStr(inputRef.current.innerHTML)) : value]);

    // useEffect(() => {
    //     setOverrideMsg(showMsg);
    // }, [showMsg]);
    useEffect(() => {
        setInputMsg(msg);
    }, [msg]);
    useEffect(() => {
        setInputMsgColor(msgColor);
    }, [msgColor]);
    useEffect(() => {
        // setNativeValue(value);
    }, [value]);
    return (!hidden && createWidget())

    function createWidget() {
        return <div
            className={getWrapperClass()}
            style={{...wrapperStyle}}>
            <div className={`d-flex jc-start flex-wrap fd-row ${innerWrapperClassName} ${transition ? ' transition ' : ''}`}
                 style={{...innerWrapperStyle}}
            >
                {/*floating-label*/}
                {(canShowFloatingLabel()) && <label className={`floating-label fw-bold fs-sm text-gray w-100 transition text-nowrap overflow-hidden   text-nowrap justify-content-start text-start px-1 py-0 me-2  
                    ${labelClassName} mt-0 pb-0 pt-0
                    ${variant}
                    ${isBoolTrue(placeholderAsLabel) ? '' : ''}
                    ${!isBoolTrue(floatingLabel) ? '' : ''}
                    ${isInvalid ? (getDefValue(errorClassOnInvalid, "")) : ""}`}
                                                    style={{marginBottom: ".2rem", height: "auto", ...labelStyle}}>
                    {getLabelText()}
                </label>}

                {/*{!isBoolTrue(canShowFloatingLabel()) && <br/>}*/}
                {/*<div className={'w-100 p-0 m-0 d-flex justify-content-start fd-row flex-nowrap'}>*/}
                {/*Left icon*/}
                <div className={`d-flex w-100 flex-nowrap fd-row jc-start al-center m-0 p-0`}>
                    {checkNullStr(leftIcon) && !isTypeFile() && !asTextArea && <Icon
                        className={`input-icon position-absolute text-darkx px-1 ${leftIcon} ${iconClassName}`}
                        tooltip={leftIconTooltip}
                        onClick={onLeftIconClick}
                        style={{left: iconGap, fontSize: iconSize, color: iconColor, ...iconStyle}}/>}

                    {/*Create input field*/}
                    {isBoolTrue(asTextArea) ? createTextArea() : createInput()}

                    {/*Right icon*/}
                    {checkNullStr(rightIcon) && !isTypeFile() && !asTextArea && <Icon
                        className={`input-icon position-absolute xtext-dark px-2 ${rightIcon} ${iconClassName}`}
                        tooltip={rightIconTooltip}
                        onClick={onRightIconClick}
                        style={{right: iconGap, fontSize: iconSize, color: iconColor, ...iconStyle}}/>}

                    {/*Clear control*/}
                    {showClear && <Button
                        className={`bg-t shadow-none p-1 circular ${controlClassName} `}
                        iconClass={`bi bi-x text-dark fw-bold ${controlIconClassName}`}
                        width={controlSize}
                        height={controlSize}
                        fontSize={"15px"}
                        disabled={disabled}
                        // tooltip={"Clear"}
                        style={{
                            margin: "1.5px", marginLeft: "-" + subtractSize(controlSize, 5), ...controlStyle
                        }}
                        onClick={clearInput}
                    />}


                    {/*Password toggle*/}
                    {type === "password" && <Button
                        className={`shadow-none p-1 circular text-dark ${controlClassName} `}
                        iconClass={`text-${controlColor} ${showPassword ? 'bi bi-eye ' : 'bi bi-eye-slash'}`}
                        width={controlSize}
                        height={controlSize}
                        fontSize={"15px"}
                        disabled={disabled}
                        // tooltip={showPassword?"Hide":"Show"}
                        style={{
                            margin: "1.5px", marginLeft: "-" + multSize(controlSize, 1.5), ...controlStyle
                        }}
                        onClick={handleTogglePassword}
                    />}
                </div>
            </div>


            {/*// checkNull(validate) && showValidationMsg &&*/}
            {/*Message label*/}
            {(isBoolTrue(showMsgOverride)) &&
                <label className={`px-1 mb-0 pb-0 fw-bold transition text-nowrap overflow-hidden text-start d-flex text-nowrap ${msgClassName}x`}
                       style={{
                           fontStyle: isBoolTrue(italicMsg) ? "italic" : "normal",
                           color: inputMsgColor,
                           marginTop: ".1rem",
                           fontSize: msgTextSize,
                           height: msgHeight,
                           opacity: (((((isBoolTrue(validate) || isBoolTrue(required))) && ((!isBoolTrue(validate) && isBoolTrue(showMsg) || ((!isBoolTrue(required) && !isBoolTrue(validate)) && isBoolTrue(showMsg))) ? true : showValidationMsg))) || !isBoolTrue(validate) && isBoolTrue(showMsgOnNonValidate)) ? 1 : 0, ...msgStyle
                       }}>
                    {(overrideMsg && isBoolTrue(showDefMsg)) ? inputMsg : msg}
                    {/*{inputMsg}*/}
                </label>}
        </div>
    }

    function createInput() {
        return <input
            value={value}
            // defaultValue={inputDefValue}
            ref={inputRef}
            autoComplete="new-password"
            className={getInputClass()}
            id={id}
            name={name}
            disabled={disabled}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            // type={inputType}
            placeholder={placeholder}
            style={{
                paddingTop: !isTypeFile() ? ".6rem" : ".2rem",
                paddingBottom: !isTypeFile() ? ".6rem" : ".2rem",
                // paddingLeft: (checkNull(leftIcon, "") || asTextArea) && !isTypeFile() ? multSize(iconSize, 2) : ".6rem",
                // paddingRight: type === "password" ? multSize(iconSize, 2) + ' !important' : ".6rem !important",
                ...style
            }}
            maxLength={maxLength}
            minLength={minLength}
            onClick={onClick}
            onChange={handleOnChange}
            onPaste={handleOnPaste}
            onCut={handleOnCut}
            onFocus={(e) => {
                if (checkNull(onFocus)) onFocus(e);
                setIsFloating(true);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            accept={accept}
            min={(min + "")}
            max={(max + "")}
            pattern={pattern}
            readOnly={readOnly}
            required={required}
            {...rest}
        />
    }

    function createTextArea() {
        return <textarea
            value={value}
            ref={inputRef}
            rows={rows}
            cols={cols}
            className={getInputClass() + " scroll scroller"}
            id={id}
            name={name}
            title={title}
            disabled={disabled}
            placeholder={placeholder}
            style={{...style}}
            defaultValue={defaultValue}
            maxLength={maxLength}
            minLength={minLength}
            onClick={onClick}
            onChange={handleOnChange}
            autoComplete={autoComplete}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            required={required}
            {...rest}
        />
    }

    function handleKeyDown(e) {
        if (isBoolTrue(validate) && checkNullStr(pattern)) {
            const {value, selectionStart, selectionEnd} = inputRef.current;
            if (e.key === 'Backspace') {
                // Prevent the default backspace behavior
                e.preventDefault();
                // Delete the character one by one
                if (selectionStart !== selectionEnd) {
                    const newValue = value.slice(0, selectionStart) + value.slice(selectionEnd);
                    inputRef.current.value = newValue;
                    setNativeValue(newValue);
                    if (checkNull(onChange)) onChange(e, true);
                } else {
                    const newValue = value.substring(0, value.length - 1);
                    setNativeValue(newValue);
                    inputRef.current.value = newValue;
                    if (checkNull(onChange)) onChange(e, true);
                }
            }
        }
        if (checkNull(onKeyDown)) onKeyDown(e, true);
    }

    function handleOnPaste(e) {
        if (isBoolTrue(validate) && checkNullStr(pattern)) {
            const {value, selectionStart, selectionEnd} = inputRef.current;
            const newValue = value.slice(0, selectionStart) + value.slice(selectionEnd);
            inputRef.current.value = newValue;
            setNativeValue(newValue);
            if (checkNull(onChange)) onChange(e, true);
        }
        if (checkNull(onPaste)) onPaste(e);
    }

    function handleOnCut(e) {
        if (isBoolTrue(validate) && checkNullStr(pattern)) {
            const {value, selectionStart, selectionEnd} = inputRef.current;
            const newValue = value.slice(0, selectionStart) + value.slice(selectionEnd);
            inputRef.current.value = newValue;
            setNativeValue(newValue);
            if (checkNull(onChange)) onChange(e, true);
        }
        if (checkNull(onCut)) onCut(e);
    }

    function handleOnChange(e) {
        let changeValue = e.target.value + "";
        if (isBoolTrue(capitalizeOnType)) changeValue = changeStringCase(changeValue, "upper");
        setIsFloating(checkNullStr(changeValue));
        setNativeValue(changeValue);
        if (isBoolTrue(validate) && checkNullStr(pattern)) {
            const sanitizedInput = changeValue.replace(pattern, '');
            setNativeValue(sanitizedInput);

            if (pattern.test(changeValue)) {
                setShowValidationMsg(false);

                if (checkNull(onChange)) onChange(e, true);

                const {selectionStart, selectionEnd} = inputRef.current;
                if (selectionStart !== selectionEnd) {
                    inputRef.current.value = '';
                }
                // if (checkNull(onKeyDown)) onKeyDown(e, true);
                // if (checkNull(onKeyPress)) onKeyPress(e, true);
            } else {
                // triggerActionsOnInvalid(e, changeValue);
                // if (!isBoolTrue(overrideInvalid)) clearInput();
                setShowValidationMsg(true);
                setIsInvalid(true);
                if (errorTimeoutMS > 0) {
                    // if (errorTimeoutMS > 0 && checkNullStr(changeValue)) {
                    createTimeout(() => {
                        setIsInvalid(false);
                        setShowValidationMsg(false);
                    }, errorTimeoutMS)
                }
                if (isBoolTrue(overrideInvalid)) if (checkNull(onChange)) onChange(e, false);
                // if (checkNull(onKeyDown)) onKeyDown(e, false)
                // if (checkNull(onKeyPress)) onKeyPress(e, false)
                // if (checkNull(onError)) onError(e, changeValue)
            }
        } else {
            if (checkNull(onChange)) onChange(e, true)
        }
        setIsInvalid(false);
    }

    function handleBlur(e) {
        try {
            if (isBoolTrue(useBlur)) {
                // e.preventDefault();
                // e.stopPropagation();
                if (checkNull(onBlur)) onBlur(e);
                if (!checkNullStr(value)) {
                    setIsFloating(false);
                }
                if (isBoolTrue(required) && (!checkNullStr(value) || !checkNullStr(nativeValue))) {
                    // setIsInvalid(true);
                    setShowValidationMsg(true);
                    setOverrideMsg(true);
                    setInputMsgColor('red');
                    setInputMsg('This field is required');
                } else {
                    // setIsInvalid(isInvalid);
                    setShowValidationMsg(showValidationMsg);
                    setOverrideMsg(false);
                    setInputMsgColor(msgColor);
                    setInputMsg(msg);
                }
            }
        } catch (e) {
            printError(TAG, e)
        }
    }

    function triggerActionsOnInvalid(e, changeValue) {
        setShowValidationMsg(true);
        setIsInvalid(true);
        if (errorTimeoutMS > 0 && checkNullStr(changeValue)) {
            createTimeout(() => {
                setIsInvalid(false);
                setShowValidationMsg(false);
            }, errorTimeoutMS)
        }
        if (checkNull(onChange)) onChange(e, false);
        // if (checkNull(onKeyDown)) onKeyDown(e, false)
        // if (checkNull(onKeyPress)) onKeyPress(e, false)
        if (checkNull(onError)) onError(e, changeValue)
    }

    function handleTogglePassword() {
        if (isInputGo()) {
            if (!showPassword) {
                // inputRef.current.type = 'password';
                // setInputType('password');
            } else {
                // inputRef.current.type = "text";
                // setInputType("text");
            }
        }
        setShowPassword(!showPassword);
        focusInput();
    }

    function isInputEmpty() {
        return !(isInputGo() ? checkNull(inputRef.current.value, "") : false)
    }

    function clearInput() {
        if (isInputGo()) {
            inputRef.current.value = ""
            focusInput()
        }
    }

    function isInputGo() {
        return checkNull(inputRef) && checkNull(inputRef.current)
    }

    function getInput() {
        return (isInputGo()) ? inputRef.current : null;
    }

    function focusInput() {
        if (isInputGo()) {
            // inputRef.current.focus();
            try {
                $(getInput()).focus();
            } catch (e) {
                printError(TAG, e)
            }
        }
    }

    function getWrapperClass() {
        return `input-wrapper d-flex flex-column overflow-visible p-0 transition 
            ${wrapperClassName} 
            ${(floatingLabel && canShowFloatingLabel()) ? 'floating-input-wrapper' : ''}
            ${(floatingLabel && isFloating && canShowFloatingLabel()) ? 'floating' : ''}
            `
    }

    function getInputClass() {
        return `form-control form-group m-0 p-0 py-0 my-0 w-100  
          ${checkNullStr(leftIcon) ? 'left-iconx pl-4' : 'pl-2'}
          ${className} 
          ${variant} 
          ${isBoolTrue(error) ? 'error' : ''}
          ${isBoolTrue(success) ? 'success' : ''}
          ${isBoolTrue(info) ? 'info' : ''}
          ${isBoolTrue(transition) ? 'transition' : ''}
          ${isBoolTrue(disabled) ? 'disabled' : ''}
          ${(type === "password" || checkNullStr(rightIcon)) ? 'right-iconx pr-4' : 'pr-2'}
          ${isInvalid ? (getDefValue(errorClassOnInvalid, "")) : ""}
        `
    }

    function getLabelText() {
        let text = checkNull(label, "") ? label : (placeholderAsLabel && (checkNull(placeholder)) ? placeholder : "");
        // let text = placeholder;
        text = (text + "").replaceAll("*", "").trim();
        text = <span className={'p-0 m-0'}>{isBoolTrue(required) && <span className={'m-0 p-0 text-danger select-none'}>*</span>}{text}</span>
        // text = <span className={'p-0 m-0'}>{isBoolTrue(required) && <span className={'m-0 p-0 fw-bold fs-md text-danger'}>*</span>}{text}</span>
        return text;
    }

    function canShowFloatingLabel() {
        return isBoolTrue(showLabel) && (checkNullStr(getLabelText()) || (placeholderAsLabel && checkNullStr(placeholder)));
        // return true;
    }

    function isTypeFile() {
        return type === "file";
    }

});


Input.propTypes = {
    /**
     * The CSS class name to apply to the root element.
     */
    className: PropTypes.string,

    /**
     * The CSS class name to apply to the wrapper element.
     */
    wrapperClassName: PropTypes.string,

    /**
     * The CSS class name to apply to the inner wrapper element.
     */
    innerWrapperClassName: PropTypes.string,

    /**
     * The CSS class name to apply to the control element.
     */
    controlClassName: PropTypes.string,

    /**
     * The CSS class name to apply to the icon element within the control element.
     */
    controlIconClassName: PropTypes.string,

    /**
     * The CSS class name to apply to the label element.
     */
    labelClassName: PropTypes.string,

    /**
     * The CSS class name to apply to the element when the input is invalid.
     */
    errorClassOnInvalid: PropTypes.string,

    /**
     * The styles to apply to the wrapper element.
     */
    wrapperStyle: PropTypes.object,

    /**
     * The styles to apply to the inner wrapper element.
     */
    innerWrapperStyle: PropTypes.object,

    /**
     * The ID to apply to the root element.
     */
    id: PropTypes.string,

    /**
     * Whether or not to append a random class name to the root element.
     */
    appendRandomClass: PropTypes.bool,

    /**
     * Whether or not to animate the message element.
     */
    animateMsg: PropTypes.bool,

    /**
     * The number of milliseconds to display an error message before hiding it.
     */
    errorTimeoutMS: PropTypes.number,

    /**
     * Whether or not to render the component as a textarea.
     */
    asTextArea: PropTypes.bool,

    /**
     * The number of rows to display in a textarea.
     */
    rows: PropTypes.number,

    /**
     * The number of columns to display in a textarea.
     */
    cols: PropTypes.number,

    /**
     * The value of the input.
     */
    value: PropTypes.string,

    /**
     * The default value of the input.
     */
    defaultValue: PropTypes.string,

    /**
     * The placeholder text to display in the input.
     */
    placeholder: PropTypes.string,

    /**
     * The state value of the input.
     */
    inputValueState: PropTypes.any,

    /**
     * The setState function to update the state value of the input.
     */
    inputValueSetState: PropTypes.func,

    /**
     * The label to display above the input.
     */
    label: PropTypes.string,

    /**
     * The size of the label text.
     */
    labelSize: PropTypes.string,

    /**
     * The color of the label text.
     */
    labelColor: PropTypes.string,

    /**
     * The styles to apply to the label element.
     */
    labelStyle: PropTypes.object,

    /**
     * Whether or not to use a floating label.
     */
    floatingLabel: PropTypes.bool,

    /**
     * Whether or not to use the placeholder text as the label.
     */
    placeholderAsLabel: PropTypes.bool,

    /**
     * The message to display below the input.
     */
    msg: PropTypes.string,

    /**
     * The size of the message text.
     */
    msgTextSize: PropTypes.string,

    /**
     * The styles to apply to the message element.
     */
    msgStyle: PropTypes.object,

    /**
     * The color of the validation message text.
     */
    msgColor: PropTypes.string,

    /**
     * Additional CSS class name(s) to apply to the validation message element.
     */
    msgClassName: PropTypes.string,

    /**
     * The name of the input.
     */
    name: PropTypes.string,

    /**
     * The type of input.
     */
    type: PropTypes.string,

    /**
     * The minimum value of the input.
     */
    min: PropTypes.string,

    /**
     * The maximum value of the input.
     */
    max: PropTypes.string,

    /**
     * The minimum length of the input.
     */
    minLength: PropTypes.number,

    /**
     * The maximum length of the input.
     */
    maxLength: PropTypes.number,

    /**
     * Whether the input is required.
     */
    required: PropTypes.bool,

    /**
     * Whether the input is disabled.
     */
    disabled: PropTypes.bool,

    /**
     * Whether the input should be validated. By default is <code>false</code>
     */
    validate: PropTypes.bool, showMsgOnNonValidate: PropTypes.bool,

    /**
     * Whether to show the clear icon on the input.
     */
    showClear: PropTypes.bool,

    /**
     * Whether the validation message text should be in italic.
     */
    italicMsg: PropTypes.bool,

    /**
     * Whether to show the validation message text.
     */
    showMsg: PropTypes.bool,

    /**
     * The style object to apply to the input.
     */
    style: PropTypes.object,

    /**
     * The style object to apply to the control (wrapper) element.
     */
    controlStyle: PropTypes.object,

    /**
     * The size of the control (wrapper) element.
     */
    controlSize: PropTypes.string,

    /**
     * Accepted file formats if type is set to "file"
     */
    accept: PropTypes.string, wrap: PropTypes.string,

    /**
     * Enable/disable auto-completion
     */
    autoComplete: PropTypes.string,

    /**
     * Pattern of the input value.
     */
    pattern: PropTypes.any, showMsgOverride: PropTypes.bool,

    /**
     * Make the field read-only.
     */
    readOnly: PropTypes.bool, useBlur: PropTypes.bool, overrideInvalid: PropTypes.bool, showDefMsg: PropTypes.bool,

    /**
     * Height of the message field.
     */
    msgHeight: PropTypes.string, onPaste: PropTypes.func, onCut: PropTypes.func, capitalizeOnType: PropTypes.bool,
};


export default Input;
