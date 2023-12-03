import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox, Label} from "./index";
import {binaryToBool, boolToBinary, checkNull, checkNullStr, isBoolTrue} from "./ReactUtils";
import {Paper} from "@mui/material";

const RadioToggle = React.memo(({
                                    className = "",
                                    labelClassName = "",
                                    radioClassName = "",
                                    labelFontSize = "12px",
                                    wrap = "nowrap",
                                    radioWrap = "nowrap",
                                    type = "radio",
                                    highlight = false,
                                    config = {
                                        label: "Is Active", active: "Active", inactive: "Inactive"
                                    }, checked = false, binary = false, style = {}, labelStyle = {}, radioStyle = {}, onChange,
                                }) => {
    const TAG = "RadioToggle";

    return (<>
        {<Paper className={`justify-content-start align-items-center d-flex flex-${wrap} fd-row shadow-none border-none ${className}`}
                sx={{...style}}>
            {checkNullStr(config.label) &&
                <Label className={`m-0 p-0 px-1 text-nowrap fw-bold fs-mdx ${labelClassName}`}
                       style={{fontSize: labelFontSize, ...labelStyle}}>{config.label}</Label>}

            <div className={`w-auto p-0 m-0 px-1x justify-content-start d-flex align-items-center flex-${radioWrap} fd-row`}>
                {/*Active radio*/}
                <Checkbox
                    style={{...radioStyle}}
                    wrapperClassName={`m-0 p-0 px-2 ${radioClassName}`}
                    type={type}
                    className={`fs-sm text-dark fw-semi-bold ${isActiveTrue() && isBoolTrue(highlight) ? 'highlight-dark' : ''}`}
                    checked={isActiveTrue()}
                    onChange={(e) => {
                        const value = getCheckedValue(e, true);
                        if (checkNull(onChange)) onChange(e, value);
                    }}>
                    {config.active}
                </Checkbox>

                {/*Inactive radio*/}
                <Checkbox
                    style={{...radioStyle}}
                    wrapperClassName={`m-0 p-0 px-2 ${radioClassName}`}
                    type={type}
                    className={`fs-sm text-dark fw-semi-bold ${!isActiveTrue() && isBoolTrue(highlight) ? 'highlight-dark' : ''}`}
                    checked={!isActiveTrue()}
                    onChange={(e) => {
                        const value = getCheckedValue(e, false);
                        if (checkNull(onChange)) onChange(e, value);
                    }}>
                    {config.inactive}
                </Checkbox>
            </div>
        </Paper>}
    </>)

    function isActiveTrue() {
        return isBoolTrue(binary) ? binaryToBool(checked) : isBoolTrue(checked);
    }

    function getCheckedValue(e, active) {
        return isBoolTrue(binary)
            ? (boolToBinary(active ? isBoolTrue(e.target.checked) : !isBoolTrue(e.target.checked)))
            : isBoolTrue(binary) ? isBoolTrue(e.target.checked) : (active ? config.active : config.inactive);
    }
});
RadioToggle.propTypes = {
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    radioClassName: PropTypes.string,
    type: PropTypes.string,
    wrap: PropTypes.string,
    radioWrap: PropTypes.string,
    checked: PropTypes.bool,
    binary: PropTypes.bool,
    highlight: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    labelStyle: PropTypes.object,
    radioStyle: PropTypes.object,
    config: PropTypes.object,
};
export default RadioToggle;
