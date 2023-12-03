import React, {forwardRef, useEffect} from 'react';
import {Button as MButton} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {checkNull, checkNullStr, getDefValueStr, isBoolTrue, printError} from "./ReactUtils";
import PropTypes from 'prop-types';
import Image from "./Image";
import {THEME} from "./index";

/**
 * Creates a button widget to show text/icon or both.
 *
 * @param tooltipPlacement: Location to place tooltip: 'auto-start' | 'auto' | 'auto-end' | 'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-end' | 'bottom' | 'bottom-start' | 'left-end' | 'left' | 'left-start'
 */
const Button = forwardRef(({
                               className = `bg-${THEME}`,
                               iconClass = "",
                               loadingClassName = "",
                               icon,
                               id = "",
                               as,
                               key,
                               border = "none",
                               padding = "",
                               text,
                               circular = false,
                               sleek = false,
                               highlightOnHover = false,
                               highlightVariant = '',
                               highlightTextOnHover = false,
                               hidden = false,
                               disableIconDrag = true,
                               disabled = false,
                               rounded = true,
                               disableRipple = false,
                               rippleColor = "var(--ripple-color)",
                               tabIndex,
                               fontSize,
                               onClick,
                               onMouseEnter,
                               onMouseLeave,
                               onMouseOver,
                               onMouseOut,
                               onContextMenu,
                               width = "auto",
                               height = "auto",
                               iconGap = ".5em",
                               href,
                               target,
                               type,
                               name,
                               value,
                               vertical,
                               title,
                               checked,
                               onInputChange,
                               appendRandomId = false,
                               appendRandomClass = false,
                               outlined = false,
                               active = false,
                               asLoading = false,
                               customSpinner,
                               customSpinnerAtEnd = false,
                               textOnLoading = false,
                               noCursorOnLoading = true,
                               loadingColorVariant = THEME,
                               loadingVariant = 'sm',
                               loadingWidth = "5%",
                               variant = "",
                               textClassName = "",
                               transitionVariant = "transition",
                               tooltipPlacement = "top",
                               color = 'white',
                               fontWeight = "normal",
                               fontFamily = "inherit",
                               spinnerStyle = {},
                               style = {},
                               rippleStyle = {},
                               internalStyle = {},
                               iconStyle = {},
                               iconSize,

                               //Tooltip
                               tooltip = "", // tooltipBg = "#515151fff",
                               // tooltipColor = "white",
                               // tooltipBlurred = true,
                               tooltipArrow = true,
                               ...rest
                           }, ref = null) => {
    const TAG = 'Button.jsx';

    useEffect(() => {
        try {
            if (checkNull(ref)) {
                const button = ref.current;
                if (checkNull(button) && checkNull(icon)) {
                    const children = button.children;
                    for (let child of children) {
                        if (child !== null && child !== undefined) {
                            // child.style.fontSize = fontSize;
                            // child.style.color = color;
                            // child.classList.add(iconClass);
                            if (checkNull(iconStyle, {})) {
                                // child.style = iconStyle;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            printError(TAG, e)
        }
    }, [])
    useEffect(() => {
    })
    return (!hidden && <Tooltip title={tooltip} key={className + text + width + height + key}>
        {/*<Tooltip title={tooltip} arrow={tooltipArrow}>*/}
        {/*<Tooltip title={tooltip} arrow={tooltipArraow} bgColor={tooltipBg} color={tooltipColor} blurred={tooltipBlurred}>*/}
        {createButton()}
    </Tooltip>)


    function createButton() {
        return <MButton
            // itemRef={ref}
            // ref={ref}
            role={as}
            key={className + text + variant + key}
            href={href}
            target={target}
            type={type}
            name={name}
            value={value}
            vertical={vertical}
            checked={checked}
            sx={{...internalStyle}}
            onChange={onInputChange}
            active={active}
            variant={variant}
            disabled={disabled}
            className={`button text-center text-center text-center-force text-capitalize 
                ${(isBoolTrue(highlightOnHover) || checkNullStr(highlightVariant)) ? `highlight-${highlightVariant}-hover` : ""}
                 ${isBoolTrue(highlightTextOnHover) ? `text-${THEME}-hover` : ""} 
                 ${isBoolTrue(isBoolTrue(noCursorOnLoading) && isBoolTrue(asLoading)) ? "cursor-none" : ""} 
                 ${transitionVariant}
                 bg-${variant} 
                 btn-${variant} 
                 ${isBoolTrue(outlined) ? `border-solid border-1-5 border-${variant} bg-t blur-5` : ""}
            ${isBoolTrue(disabled) ? "disable-item" : ""}
            ${isBoolTrue(rounded) ? "rounded-2" : "rounded-0"}
            ${isBoolTrue(sleek) ? "m-1x text-light rounded-10 px-3 py-1 w-auto shadow-none" : ""}
            ${isBoolTrue(circular) ? "circular" : ""}
            ${isBoolTrue(asLoading) ? "w-auto" : ""}
            ${(!checkNull(className)) ? `btn-${THEME} bg-${THEME}` : className} 
    `}
            style={{...getStyles()}}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onContextMenu={(e) => {
                if (!checkNullStr(href) && checkNullStr(tooltip)) e.preventDefault();
                if (onContextMenu) onContextMenu(e);
            }}
            disableRipple={disableRipple}
            tabIndex={tabIndex}
            title={title}
            TouchRippleProps={{
                sx: {
                    // color: rippleColor,
                    color: canSetLightRipple() ? 'var(--ripple-color-light)' : rippleColor, ...rippleStyle
                }
            }}
            {...rest}
        >
            <span
                className={`m-0 p-0 w-100 h-100 d-flex position-relative ${transitionVariant} ${textClassName} justify-content-center align-items-center text-center`}
                ref={ref}
                // style={{color: color}}
                id={id}>
                {(customSpinner && !isBoolTrue(customSpinnerAtEnd)) && customSpinner}
                {isBoolTrue(asLoading) && getSpinner()}
                {checkNull(getIcon(), "") && getIcon()}
                {checkNull(getText(), "") && getText()}
                {(customSpinner && isBoolTrue(customSpinnerAtEnd)) && customSpinner}
            </span>
        </MButton>
    }

    function getStyles() {
        return {
            fontFamily: fontFamily,
            border: border,
            color: color,
            width: asLoading ? loadingWidth : width,
            height: height,
            minWidth: asLoading ? loadingWidth : width,
            minHeight: height,
            maxWidth: asLoading ? loadingWidth : width,
            maxHeight: height,
            padding: padding,
            fontWeight: fontWeight,
            fontSize: fontSize, ...style
        }
    }

    function getIcon() {
        // const icon = <i className={`${ iconClass } `} style={{marginRight: isTextNull() ? "0" : iconGap, ...iconStyle}}/>
        const outIcon = (!checkNullStr(icon)) ? <i className={`${iconClass} bt-icon`}
                                                   style={{
                                                       fontSize: checkNull(iconClass, "") ? iconSize : "0",
                                                       marginRight: isTextNull() ? "0" : iconGap, ...iconStyle,
                                                       color: color, // filter: `brightness(25%) saturation(20%)`,
                                                       opacity: isBoolTrue(disabled) ? .8 : 1,
                                                   }}/>
            // : icon;
            : <Image className={`bt-icon ${iconClass}`}
                     disableDrag={disableIconDrag}
                     wrapperClassName={''}
                     src={icon}
                     width={getDefValueStr(iconSize, fontSize)} height={getDefValueStr(iconSize, fontSize)}
                     style={{
                         marginRight: isTextNull() ? "0" : iconGap, ...iconStyle, color: color
                     }}
            />;
        if (isBoolTrue(asLoading)) {
            if (isBoolTrue(textOnLoading)) {
                return outIcon
            } else {
                return null;
            }
        } else {
            return outIcon
        }
    }

    function getText() {
        return asLoading ? (textOnLoading ? text : "") : text
    }

    function isTextNull() {
        return text == null || text === "" || text + "".length === 0
    }

    function getSpinner() {
        return <span className={`p-0 m-0x px-2x pt-1x position-absolutex ${loadingClassName} ${(isBoolTrue(textOnLoading) && checkNullStr(text)) ? 'pr-2' : 'pr-0'}`}
                     style={{margin: `0 0 ${isBoolTrue(circular) ? '0' : '-.25rem'} 0`, top: 'calc(.15rem+25%)', left: '-1%'}}>
            <span className={`spinner spinner-border spinner-border-${loadingVariant} text-${loadingColorVariant}`}
                  role="status" style={{width: fontSize, height: fontSize, ...spinnerStyle}}>
            </span>
        </span>
    }

    function canSetLightRipple() {
        const v = (variant + '').toLowerCase();
        return (v.includes('primary') || v.includes('info') || v.includes('danger') || v.includes('success') || v.includes('warning')) && (!v.includes('light'));
    }
});


Button.propTypes = {
    /**
     * The class name for the Button
     */
    className: PropTypes.string,

    /**
     * The icon class for the Button (e.g. fa fa-icon, bi bi-icon)
     */
    iconClass: PropTypes.string,

    /**
     * The class name for the spinner element
     */
    loadingClassName: PropTypes.string,

    /**
     * The icon-component for the Button
     */
    icon: PropTypes.node,

    /**
     * The id for the Button
     */
    id: PropTypes.string,

    /**
     * The HTML element to use
     */
    as: PropTypes.oneOf(['button', 'a']),

    /**
     * The border for the Button
     */
    border: PropTypes.string,

    /**
     * The padding for the Button
     */
    padding: PropTypes.string,

    /**
     * Text to display in the Button
     */
    text: PropTypes.any,

    /**
     * Whether to show the component as circular
     */
    circular: PropTypes.bool,

    /**
     * Whether to highlight the component on hover
     */
    highlightOnHover: PropTypes.bool,

    /**
     * Whether to highlight the text on hover
     */
    highlightTextOnHover: PropTypes.bool,

    /**
     * Whether the component is hidden
     */
    hidden: PropTypes.bool,

    /**
     * Whether the component is disabled
     */
    disabled: PropTypes.bool,
    rounded: PropTypes.bool,

    /**
     * Whether to disable the ripple effect
     */
    disableRipple: PropTypes.bool,

    /**
     * The ripple color
     */
    rippleColor: PropTypes.string,

    /**
     * The tab index for the Button
     */
    tabIndex: PropTypes.number,

    /**
     * The ref for the Button
     */
    // ref: PropTypes.object,

    /**
     * The font size for the Button
     */
    fontSize: PropTypes.string,

    /**
     * The onClick handler for the Button
     */
    onClick: PropTypes.func,

    /**
     * The onMouseEnter handler for the Button
     */
    onMouseEnter: PropTypes.func,

    /**
     * The onMouseLeave handler for the Button
     */
    onMouseLeave: PropTypes.func,

    /**
     * The onMouseOver handler for the Button
     */
    onMouseOver: PropTypes.func,

    /**
     * The onMouseOut handler for the Button
     */
    onMouseOut: PropTypes.func,

    /**
     * The width for the Button
     */
    width: PropTypes.string,

    /**
     * The height for the Button
     */
    height: PropTypes.string,

    /**
     * The gap between icon and text
     */
    iconGap: PropTypes.string,

    /**
     * The href for the Button
     */
    href: PropTypes.string,

    /**
     * The type for the Button
     */
    type: PropTypes.string,

    /**
     * The name for the Button
     */
    name: PropTypes.string,

    /**
     * The value for the Button
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * Whether the component is vertical
     */
    vertical: PropTypes.bool,

    /**
     * Whether the component is checked
     */
    checked: PropTypes.bool,

    /**
     * The ref for the input element
     */
    ref: PropTypes.object,

    /**
     * The onChange handler for the input element
     */
    onInputChange: PropTypes.func,

    /**
     * Whether to append a random class to the Button (For security purposes in case someone's using a bot to use the button to click on the forms
     * continuously). By default <code>false</code>.
     */
    appendRandomClass: PropTypes.bool,

    /**
     * Whether to append a random id to the Button (For security purposes in case someone's using a bot to use the button to click on the forms continuously).
     * By default <code>false</code>
     */
    appendRandomId: PropTypes.bool,

    /**
     * Whether the component is outlined
     */
    outlined: PropTypes.bool,

    /**
     * Whether the component is active
     */
    active: PropTypes.bool,

    /**
     * Whether the component is loading
     */
    asLoading: PropTypes.bool,
    customSpinner: PropTypes.any,
    customSpinnerAtEnd: PropTypes.bool,

    /**
     * Whether to show text on loading
     */
    textOnLoading: PropTypes.bool,

    /**
     * The loading size for the Button
     */
    loadingWidth: PropTypes.string,

    /**
     * The variant for the Button
     */
    variant: PropTypes.string,
    transitionVariant: PropTypes.string,
    textClassName: PropTypes.string,

    /**
     * The color for the Button
     */
    color: PropTypes.string,

    /**
     * The font weight for the Button
     */
    fontWeight: PropTypes.string,

    /**
     * The font family for the Button
     */
    fontFamily: PropTypes.string,
    loadingVariant: PropTypes.string,
    loadingColorVariant: PropTypes.string,

    /**
     * The style for the spinner element
     */
    spinnerStyle: PropTypes.object,

    /**
     * The style for the Button
     */
    style: PropTypes.object,

    /**
     * The style for the ripple element
     */
    rippleStyle: PropTypes.object,

    /**
     * The style for the internal element
     */
    internalStyle: PropTypes.object,

    /**
     * The style for the icon
     */
    iconStyle: PropTypes.object,

    /**
     * Size of the icon (preferably in pixels)
     */
    iconSize: PropTypes.string,

    /**
     * Tooltip for the button. Default is empty.
     */
    tooltip: PropTypes.string,

    /**
     * Show/hide the tooltip arrow. Default is true.
     */
    tooltipArrow: PropTypes.bool,
    disableIconDrag: PropTypes.bool,
    noCursorOnLoading: PropTypes.bool,
    key: PropTypes.string,
    sleek: PropTypes.bool,
    target: PropTypes.string,
    tooltipPlacement: PropTypes.string,
};

export default Button;
