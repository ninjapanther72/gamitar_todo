import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from "@mui/material/Tooltip";
import {isBoolTrue} from "./ReactUtils";

const Anchor = React.memo(({
                               className = "",
                               variant = "",

                               bgColor = "",
                               color = "black",
                               overflow = "",
                               fontSize = "14px",
                               href,
                               rel,
                               onClick,
                               target = "",
                               bordered = false,
                               asLink = true,
                               disabled = false,
                               textAt = "center",
                               width,
                               tooltip = "",
                               height,
                               iconStyle = {},

                               id,
                               key,

                               children,
                               iconClass = "",
                               icon,
                               startControls,
                               endControls,

                               style = {},
                               ...rest
                           }) => {
    const TAG = "Anchor";

    return (<>
        <Tooltip arrow={true} title={tooltip}>
            <a className={`cursor-pointer p-0 m-0 d-flex justify-content-${textAt} ${asLink ? 'footer-link' : ''} text-${textAt} ${className} ${isBoolTrue(disabled) ? 'disable-item' : ''}`}
               href={href}
               target={target}
               id={id}
               rel={(target + "").includes('_blank') ? 'noreferrer' : rel}
               key={href + className + key}
               style={{
                   width: width, height: height, fontSize: fontSize, color: color, backgroundColor: bgColor, ...style
               }}
               onClick={onClick}
               {...rest}
            >
                {children}
            </a>
        </Tooltip>
    </>)

    function fun() {

    }
});
Anchor.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.string,
    id: PropTypes.string,
    bgColor: PropTypes.string,
    color: PropTypes.string,
    fontSize: PropTypes.string,
    key: PropTypes.string,
    width: PropTypes.string,
    href: PropTypes.string,
    height: PropTypes.string,
    icon: PropTypes.any,
    iconClass: PropTypes.string,
    target: PropTypes.string,
    tooltip: PropTypes.string,
    textAt: PropTypes.string,
    overflow: PropTypes.string,
    rel: PropTypes.string,
    bordered: PropTypes.bool,
    asLink: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.any,
    startControls: PropTypes.any,
    endControls: PropTypes.any,
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    onClick: PropTypes.func,

};
export default Anchor;
