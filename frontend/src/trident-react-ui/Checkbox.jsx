import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from "@mui/material/Tooltip";
import {binaryToBool, boolToBinary, checkNull, checkNullStr, isBoolTrue} from "./ReactUtils";
import {THEME} from "./index";

const Checkbox = React.memo(({
                                 className = "",
                                 wrapperClassName = "",
                                 labelClassName = "",
                                 subtitleClassName = "",
                                 enSubtitleClassName = "",
                                 id,
                                 key,
                                 subtitle,
                                 endSubtitle,

                                 hidden = false,
                                 disabled = false,
                                 tooltip = true,
                                 scrolled = true,
                                 binary = false,
                                 precision = false,
                                 tooltipWordLimit = 30,
                                 fontSize = '13px',
                                 height,
                                 type = 'checkbox',
                                 alignAt = 'center',
                                 justifyAt = 'start',
                                 roundedVariant = '2',

                                 children,
                                 onChange,
                                 checked,
                                 defaultChecked,
                                 variant = THEME,
                                 highlightHoverVariant = 'dark',
                                 selectedHighlightVariant = '',
                                 highlightVariant = '',
                                 outlined = false,

                                 style = {},
                                 wrapperStyle = {},
                                 labelStyle = {},
                                 subtitleStyle = {},
                                 endSubtitleStyle = {},
                                 ...rest
                             }) => {
    const TAG = "Checkbox";

    return (!isBoolTrue(hidden) && <>
        <Tooltip
            className={'text-block'}
            sx={{textAlign: "justify"}}
            style={{textAlign: "justify"}}
            TransitionProps={{textAlign: "justify"}}
            PopperProps={{textAlign: "justify"}}
            title={isBoolTrue(tooltip) ? (((children + "").length >= tooltipWordLimit) ? children : "") : ""}>
            <label
                key={key}
                className={`cb-label text-nowrap p-0 py-1 m-0 w-100 cursor-pointer rounded-${roundedVariant}   
                        ${isBoolTrue(scrolled) ? 'scroller scroller-x-auto no-bar' : ''} 
                        ${isBoolTrue(disabled) ? 'disable-item' : ''} 
                         d-flex m-0 p-0 flex-nowrap jc-${justifyAt} al-${alignAt} bg-infox overflow-hidden ${wrapperClassName}
                         px-1 transition highlight-${highlightVariant} highlight-${highlightHoverVariant}-hover
                         ${isBoolTrue(defaultChecked) || isBoolTrue(checked) ? `highlight-${selectedHighlightVariant}` : ''}
                         ${isBoolTrue(outlined) ? `border-${selectedHighlightVariant}-dark border-${highlightHoverVariant}-hover` : ''}
                        `}
                style={{
                    fontSize: fontSize,
                    height: height,
                    // border: isBoolTrue(outlined) ? `1.3px solid var(--${variant}Dark)` : 'none',
                    borderWidth: isBoolTrue(outlined) ? `1.3px` : 'none',
                    borderStyle: isBoolTrue(outlined) ? `solid` : 'none',
                    ...wrapperStyle
                }}
            >
                <input className={`p-0 m-0x cursor-pointer ${className} ${variant}x ${isBoolTrue(disabled) ? 'disable-item' : ''}`}
                       style={{margin: '.05rem 0 0 0', ...style}}
                       type={type}
                       disabled={disabled}
                       checked={isBoolTrue(binary) ? binaryToBool(checked) : checked}
                       defaultChecked={isBoolTrue(binary) ? binaryToBool(defaultChecked) : defaultChecked}
                       onChange={(e) => {
                           const value = e.target.checked;
                           // printLog(children + ".value:", value);
                           if (checkNull(onChange)) onChange(e, isBoolTrue(binary) ? boolToBinary(value) : value, children);
                       }}
                       {...rest}
                />
                <span
                    className={`d-flex w-100 px-1 cb-text jc-between al-center position-relative ${labelClassName} ${isBoolTrue(disabled) ? 'disable-item' : ''} `}
                    style={{...labelStyle}}>
                    <span className={'w-auto'}>
                        <span>{children}</span>
                        {checkNullStr(subtitle) &&
                            <span className={`fs-md-sm text-gray-dark-high px-1 ${subtitleClassName}`}
                                  style={subtitleStyle}>
                                    {subtitle}
                            </span>}
                    </span>

                    {checkNullStr(endSubtitle) &&
                        <span className={`fs-md-sm text-gray-dark-high px-1 ${enSubtitleClassName}`}
                              style={endSubtitleStyle}>
                        {endSubtitle}
                    </span>}
                </span>
            </label>
        </Tooltip>
    </>)

});

Checkbox.propTypes = {
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    type: PropTypes.string,
    labelClassName: PropTypes.string,
    id: PropTypes.string,
    fontSize: PropTypes.string,
    key: PropTypes.string,
    children: PropTypes.any,
    style: PropTypes.object,
    wrapperStyle: PropTypes.object,
    onChange: PropTypes.func,
    tooltip: PropTypes.bool,
    disabled: PropTypes.bool,
    subtitle: PropTypes.string,
    height: PropTypes.string,
    binary: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    checked: PropTypes.bool,
    scrolled: PropTypes.bool,
    highlightVariant: PropTypes.string,
    highlightHoverVariant: PropTypes.string,
    selectedHighlightVariant: PropTypes.string,
    labelStyle: PropTypes.object,
    tooltipWordLimit: PropTypes.number,
};
export default Checkbox;
