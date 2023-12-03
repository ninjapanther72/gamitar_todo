import React, {useEffect} from 'react';
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import {THEME} from "./index";

/**
 * Create a compact tag for text data.
 */
const CompactTag = ({
                        className = "",
                        id,
                        tooltip = "",
                        key,
                        color = 'white',
                        bgColor = `var(--${THEME}-dark)`,
                        variant = '',
                        textVariant = '',
                        fontSize = '11px',
                        textAt = 'center',
                        wrap = '',
                        children,
                        style = {},
                        ...rest
                    }) => {

    useEffect(() => {

    }, [])

    return (<>
            <Tooltip title={tooltip} key={className + wrap + textAt + children + key}>
                <div
                    className={`compact-tag d-flex flex-${wrap} text-${wrap} text-${textAt} justify-content-${textAt} ${className} bg-${variant} text-${textVariant}`}
                    id={id}
                    key={className + wrap + textAt + children + key}
                    style={{fontSize: fontSize, color: color, backgroundColor: bgColor, ...style}}
                    {...rest}
                >
                    {children}
                </div>
            </Tooltip>
        </>
    )

    function fun() {

    }
}
CompactTag.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    id: PropTypes.any,
    textAt: PropTypes.string,
    tooltip: PropTypes.string,
    children: PropTypes.any,
    key: PropTypes.string,
    color: PropTypes.string,
    bgColor: PropTypes.string,
    variant: PropTypes.string,
    textVariant: PropTypes.string,
    fontSize: PropTypes.string,
    wrap: PropTypes.string,
};
export default CompactTag;
